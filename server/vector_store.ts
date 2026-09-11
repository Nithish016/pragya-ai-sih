export interface VectorChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  metadata: {
    filename?: string;
    competency?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Intermediate' | 'Advanced';
    courseId?: string;
    topicId?: string;
    sourceReference?: string;
  };
  vector: number[]; // numerical representation
}

// In-process vector store replicating ChromaDB semantic vector search operations
class ChromaVectorStore {
  private chunks: VectorChunk[] = [];
  private vocabulary: Map<string, number> = new Map();

  constructor() {
    this.seedInitialKnowledge();
  }

  // Basic word tokenizer and cleaning
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  // Calculate term vector
  private textToVector(tokens: string[]): number[] {
    const vector: number[] = [];
    const termCounts: Record<string, number> = {};

    tokens.forEach((token) => {
      termCounts[token] = (termCounts[token] || 0) + 1;
      if (!this.vocabulary.has(token)) {
        this.vocabulary.set(token, this.vocabulary.size);
      }
    });

    // Generate dense fixed-length representation (128 dimensions hash-bucketed)
    const dim = 128;
    const denseVector = new Array(dim).fill(0);

    for (const [term, count] of Object.entries(termCounts)) {
      let hash = 0;
      for (let i = 0; i < term.length; i++) {
        hash = (hash << 5) - hash + term.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % dim;
      denseVector[index] += count;
    }

    // Normalize
    const magnitude = Math.sqrt(denseVector.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? denseVector : denseVector.map((val) => val / magnitude);
  }

  // Cosine similarity
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct));
  }

  // Chunk text into semantic paragraphs/windows
  public chunkText(text: string, chunkSize = 400, overlap = 50): string[] {
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 20);
    const chunks: string[] = [];

    let currentChunk = '';
    for (const paragraph of paragraphs) {
      if ((currentChunk + ' ' + paragraph).length <= chunkSize) {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = paragraph;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    if (chunks.length === 0 && text.trim().length > 0) {
      chunks.push(text.trim());
    }

    return chunks;
  }

  // Add document chunks to vector index
  public addDocument(
    documentId: string,
    text: string,
    metadata: VectorChunk['metadata']
  ): VectorChunk[] {
    const textChunks = this.chunkText(text);
    const newChunks: VectorChunk[] = [];

    textChunks.forEach((chunkText, idx) => {
      const tokens = this.tokenize(chunkText);
      const vector = this.textToVector(tokens);
      const chunk: VectorChunk = {
        id: `chunk_${documentId}_${idx + 1}`,
        documentId,
        chunkIndex: idx + 1,
        text: chunkText,
        metadata: {
          ...metadata,
          sourceReference: `${metadata.filename || 'Document'} - Section ${idx + 1}`
        },
        vector
      };
      this.chunks.push(chunk);
      newChunks.push(chunk);
    });

    return newChunks;
  }

  // Semantic query across Chroma chunks
  public query(
    queryText: string,
    options: {
      topK?: number;
      filterCompetency?: string;
      filterDocumentId?: string;
    } = {}
  ): { chunk: VectorChunk; score: number }[] {
    const topK = options.topK || 5;
    const queryTokens = this.tokenize(queryText);
    const queryVector = this.textToVector(queryTokens);

    let filtered = this.chunks;
    if (options.filterCompetency) {
      filtered = filtered.filter(
        (c) =>
          c.metadata.competency?.toLowerCase() === options.filterCompetency?.toLowerCase()
      );
    }
    if (options.filterDocumentId) {
      filtered = filtered.filter((c) => c.documentId === options.filterDocumentId);
    }

    const scored = filtered.map((chunk) => {
      const similarity = this.cosineSimilarity(queryVector, chunk.vector);
      // Boost if query tokens explicitly match
      let keywordBonus = 0;
      queryTokens.forEach((token) => {
        if (chunk.text.toLowerCase().includes(token)) {
          keywordBonus += 0.05;
        }
      });
      const finalScore = Math.min(1, similarity + keywordBonus);
      return { chunk, score: finalScore };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  public getChunkCount(): number {
    return this.chunks.length;
  }

  private seedInitialKnowledge() {
    // Seed initial statistical documents into vector store
    this.addDocument(
      'mat_mospi_manual',
      `MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION (MoSPI) - STATISTICAL SAMPLING MANUAL
Dual-frame sampling in the Indian Official Statistical System combines area frames for demographic and household surveys with list frames for industrial establishments (ASI). Stratified multistage random sampling is utilized in National Sample Survey (NSS) rounds to ensure representation across NSS regions, agro-climatic zones, and rural-urban sectors.`,
      {
        filename: 'MoSPI_National_Statistical_Sampling_Manual_2025.pdf',
        competency: 'Survey Methods & Sampling',
        difficulty: 'Intermediate'
      }
    );

    this.addDocument(
      'mat_viz_guidelines',
      `DATA VISUALIZATION STANDARDS FOR NATIONAL STATISTICAL OFFICE BULLETINS
Cognitive perception experiments by Cleveland & McGill demonstrate that aligned position scales provide the highest decoding precision. When plotting categorical frequencies, always use horizontal or vertical bar charts with an explicit zero baseline. Avoid 3D perspective charts and circular donut charts which distort public understanding of budgetary allocations and poverty headcounts.`,
      {
        filename: 'MoSPI_Data_Visualization_Guidelines.pdf',
        competency: 'Data Visualization',
        difficulty: 'Intermediate'
      }
    );

    this.addDocument(
      'mat_inference_primer',
      `STATISTICAL INFERENCE AND HYPOTHESIS TESTING FOR GOVERNMENT EVALUATION
In socio-economic program evaluations, researchers test null hypotheses regarding intervention impact. Under the Central Limit Theorem, the distribution of sample means approaches normality when sample size n exceeds 30. The standard error (SE = sigma / sqrt(n)) establishes the confidence boundary for welfare impact assessments.`,
      {
        filename: 'Inference_Principles_NSSTA.pdf',
        competency: 'Statistical Inference',
        difficulty: 'Advanced'
      }
    );
  }
}

export const chromaVectorStore = new ChromaVectorStore();
