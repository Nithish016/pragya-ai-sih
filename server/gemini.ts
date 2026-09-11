import { GoogleGenAI, Type } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competency: string;
  sourceReference: string;
}

export async function generateQuizQuestionsFromChunks(
  contextChunks: string[],
  count: number = 5,
  difficulty: string = 'Medium',
  competency: string = 'General Statistics'
): Promise<GeneratedQuestion[]> {
  const client = getGeminiClient();

  if (client) {
    try {
      const combinedContext = contextChunks.join('\n\n--- CHUNK BREAK ---\n\n');
      const prompt = `You are a Senior Statistical Examination Specialist for the National Statistical Systems Training Academy (NSSTA), Government of India.
Generate exactly ${count} multiple choice questions (MCQs) strictly grounded in the following official learning material:

LEARNING MATERIAL CONTEXT:
${combinedContext}

REQUIREMENTS:
- Competency Focus: ${competency}
- Target Difficulty: ${difficulty}
- Exactly 4 plausible options per question (only 1 strictly correct).
- Provide a detailed educational explanation explaining WHY the correct option is right and cite the specific concept.
- Cite the source reference or section.
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: {
                  type: Type.INTEGER,
                  description: '0-based index (0, 1, 2, or 3) of the correct answer'
                },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                competency: { type: Type.STRING },
                sourceReference: { type: Type.STRING }
              },
              required: ['question', 'options', 'correctAnswer', 'explanation', 'difficulty', 'competency']
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q: any) => ({
          question: q.question,
          options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || 'Verified statistical concept.',
          difficulty: (['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : difficulty) as any,
          competency: q.competency || competency,
          sourceReference: q.sourceReference || 'Uploaded Statistical Manual'
        }));
      }
    } catch (err) {
      console.warn('Gemini quiz generation fallback triggered:', err);
    }
  }

  // Fallback high-quality generation if Gemini API unavailable or context-specific
  return generateFallbackQuestions(contextChunks, count, difficulty, competency);
}

function generateFallbackQuestions(
  chunks: string[],
  count: number,
  difficulty: string,
  competency: string
): GeneratedQuestion[] {
  const bank: GeneratedQuestion[] = [
    {
      question: `In the context of ${competency}, which principle is essential for maintaining unbiased estimation during sample survey execution?`,
      options: [
        'Ensuring strictly positive and known selection probabilities across all sampling units',
        'Arbitrarily replacing non-responding households with convenient neighbors',
        'Discarding all survey samples that deviate from the national median',
        'Excluding rural enumeration blocks to reduce logistical field expenditure'
      ],
      correctAnswer: 0,
      explanation: 'Probability sampling requires every target unit to possess a known, non-zero probability of inclusion, allowing design-unbiased Horvitz-Thompson estimation.',
      difficulty: 'Medium',
      competency: competency,
      sourceReference: 'MoSPI National Statistical Sampling Manual, Ch 3.1'
    },
    {
      question: `How does Computer Assisted Personal Interviewing (CAPI) reduce non-sampling errors compared to traditional Pen-and-Paper (PAPI) methods?`,
      options: [
        'It eliminates the requirement for statistical sampling frames',
        'It enforces real-time logical range checks, skip patterns, and mathematical consistency rules at the point of data capture',
        'It automatically inflates sample size without visiting respondents',
        'It replaces official field surveyors with unsupervised crowd workers'
      ],
      correctAnswer: 1,
      explanation: 'CAPI software validates input ranges and skips immediately during the interview, preventing impossible contradictions (e.g. child age with tertiary degree).',
      difficulty: 'Easy',
      competency: competency,
      sourceReference: 'MoSPI CAPI Implementation Guidelines'
    },
    {
      question: `When reporting statistical indicators where regional coefficients of variation (CV) exceed 15%, what visual best practice must be applied?`,
      options: [
        'Hide the underlying variance and present only the rounded point estimate',
        'Accompany the estimate with explicit 95% confidence interval error margins',
        'Switch the measurement unit to logarithmic scale without labeling',
        'Omit the geographical region from the national release'
      ],
      correctAnswer: 1,
      explanation: 'High coefficient of variation signifies substantial sampling uncertainty; displaying confidence intervals prevents misleading policymakers on point precision.',
      difficulty: 'Hard',
      competency: competency,
      sourceReference: 'NSO Dissemination & Data Quality Assurance Standard'
    },
    {
      question: `Which sampling strategy is optimal when the target population consists of heterogeneous sub-populations (strata) that are internally homogeneous?`,
      options: [
        'Stratified Random Sampling',
        'Snowball Convenience Sampling',
        'Voluntary Response Sampling',
        'Quota Sampling without Randomization'
      ],
      correctAnswer: 0,
      explanation: 'Stratified sampling ensures representation across all sub-groups while minimizing sampling variance by exploiting intra-stratum homogeneity.',
      difficulty: 'Easy',
      competency: competency,
      sourceReference: 'Statistical Foundations for Official Surveyors'
    },
    {
      question: `Under the Cleveland & McGill perceptual hierarchy, what visual encoding should be prioritized when comparing quantitative survey frequencies across five socio-economic groups?`,
      options: [
        'Aligned horizontal or vertical bars with a baseline zero',
        'Radial donut chart with variable slice thickness',
        '3D isometric cylinders with shadow reflections',
        'Color saturation gradients across arbitrary polygonal tiles'
      ],
      correctAnswer: 0,
      explanation: 'Aligned position along a common scale offers the highest human perceptual decoding accuracy, avoiding area or angle distortion.',
      difficulty: 'Medium',
      competency: competency,
      sourceReference: 'MoSPI Guidelines on Data Presentation, Section 4.2'
    }
  ];

  return bank.slice(0, count);
}

export async function generateAIExplanation(
  questionText: string,
  selectedOptionText: string,
  correctOptionText: string,
  isCorrect: boolean,
  competency: string
): Promise<string> {
  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `You are an AI Statistical Tutor for Pragya AI / SkillQuest.
Question: "${questionText}"
User Selected: "${selectedOptionText}"
Correct Answer: "${correctOptionText}"
Was User Correct: ${isCorrect ? 'Yes' : 'No'}
Competency: ${competency}

Provide a concise, encouraging 2-sentence explanation explaining the underlying statistical concept, why the correct answer holds true, and what the user should remember for official data analysis.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini explanation fallback:', err);
    }
  }

  if (isCorrect) {
    return `Excellent! "${correctOptionText}" is strictly accurate according to official statistical standards for ${competency}. You correctly identified the underlying methodology.`;
  } else {
    return `Not quite. You chose "${selectedOptionText}", but "${correctOptionText}" is the correct standard because it ensures design consistency and error mitigation in ${competency}.`;
  }
}

export interface DailyNugget {
  id: string;
  topicId: string;
  topicTitle: string;
  courseId: string;
  courseTitle: string;
  competency: string;
  keyConcept: string;
  summary: string;
  didYouKnow: string;
  practicalExample: string;
  retentionQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  tags: string[];
  readTimeSeconds: number;
  sourceReference: string;
  generatedAt: string;
}

export interface DailyNuggetTopicInput {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  courseId: string;
  courseTitle: string;
  competency: string;
  chaptersContent?: string;
  userRole?: string;
}

export async function generateDailyNugget(input: DailyNuggetTopicInput): Promise<DailyNugget> {
  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `You are the Pragya AI Senior Learning Scientist and Cognitive Retention Specialist for India's Civil Services Capacity Building and Academic Students.
Generate a high-retention, engaging "Daily Nugget" micro-learning card for the following topic from the learner's active learning path:

COURSE: ${input.courseTitle}
TOPIC: ${input.topicTitle}
COMPETENCY FOCUS: ${input.competency}
TOPIC SUMMARY: ${input.topicDescription}
${input.chaptersContent ? `LEARNING CONTEXT / CHAPTER EXTRACT:\n${input.chaptersContent.slice(0, 1500)}` : ''}

OBJECTIVES:
1. keyConcept: 1 punchy, memorable, display-worthy statement (maximum 18 words) that encapsulates the golden rule or core truth.
2. summary: A crisp 2-3 sentence explanation designed for spaced repetition retention, explaining why this concept matters and how to remember it.
3. didYouKnow: A fascinating "Did You Know?" fact, official rule of thumb, or historical/statistical standard (e.g., Cleveland-McGill visual perception ranking, MoSPI field rule, Central Limit Theorem threshold n>=30, or p-value fallacy).
4. practicalExample: 1-2 sentence concrete real-world civil service or student analytics application (e.g. in NSS survey reports, state data bulletins, or census tabulation).
5. retentionQuiz: A rapid 1-question micro-check to lock in memory:
   - question: Clear, focused retention question directly testing the key concept.
   - options: Exactly 3 plausible choices (clean, concise).
   - correctIndex: 0-based integer index (0, 1, or 2) of the correct choice.
   - explanation: 1 sentence explaining why this choice is correct.
6. tags: 2-3 concise keyword tags (e.g. ["Data Perception", "Chart Selection", "MoSPI Guidelines"]).
7. readTimeSeconds: Integer between 35 and 55.
8. sourceReference: Official citation or textbook standard (e.g. "MoSPI National Guidelines on Data Presentation" or "NSSTA Official Statistics Handbook").`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              keyConcept: { type: Type.STRING },
              summary: { type: Type.STRING },
              didYouKnow: { type: Type.STRING },
              practicalExample: { type: Type.STRING },
              retentionQuiz: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ['question', 'options', 'correctIndex', 'explanation']
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              readTimeSeconds: { type: Type.INTEGER },
              sourceReference: { type: Type.STRING }
            },
            required: ['keyConcept', 'summary', 'didYouKnow', 'practicalExample', 'retentionQuiz', 'tags', 'sourceReference']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed && parsed.keyConcept && parsed.summary && parsed.retentionQuiz) {
          return {
            id: `nugget_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            topicId: input.topicId,
            topicTitle: input.topicTitle,
            courseId: input.courseId,
            courseTitle: input.courseTitle,
            competency: input.competency,
            keyConcept: parsed.keyConcept,
            summary: parsed.summary,
            didYouKnow: parsed.didYouKnow || 'Official statistical standards require strict visual alignment to prevent perceptual distortion.',
            practicalExample: parsed.practicalExample || 'Applied routinely in MoSPI annual demographic bulletins to guarantee evidence-based policymaking.',
            retentionQuiz: {
              question: parsed.retentionQuiz.question,
              options: Array.isArray(parsed.retentionQuiz.options) && parsed.retentionQuiz.options.length >= 2
                ? parsed.retentionQuiz.options
                : ['Option A', 'Option B', 'Option C'],
              correctIndex: typeof parsed.retentionQuiz.correctIndex === 'number' ? parsed.retentionQuiz.correctIndex : 0,
              explanation: parsed.retentionQuiz.explanation || 'Verified statistical principle.'
            },
            tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : [input.competency, 'Retention'],
            readTimeSeconds: parsed.readTimeSeconds || 45,
            sourceReference: parsed.sourceReference || 'National Statistical Systems Training Academy (NSSTA)',
            generatedAt: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Daily Nugget generation fallback triggered:', err);
    }
  }

  // Curated Fallback Bank for high-retention topics
  return getFallbackDailyNugget(input);
}

function getFallbackDailyNugget(input: DailyNuggetTopicInput): DailyNugget {
  const fallbackBank: Record<string, Partial<DailyNugget>> = {
    top_viz_1: {
      keyConcept: 'Position along a common aligned scale provides the highest perceptual decoding accuracy for the human brain.',
      summary: 'According to the Cleveland & McGill graphical perception hierarchy, readers compare lengths and baseline positions with 40% higher accuracy than angles, volumes, or color saturations. Bar charts aligned to zero must always take precedence over donut or 3D bubble charts in public statistics.',
      didYouKnow: 'Cleveland & McGill’s 1984 experiments showed that human judgment of area produces an average cognitive error rate three times higher than judgment of aligned length.',
      practicalExample: 'When presenting state-wise GSDP growth rates in NSO releases, aligned horizontal bar charts prevent misinterpretation across legislative committees.',
      retentionQuiz: {
        question: 'Which graphical encoding is decoded with the highest human accuracy when comparing demographic categories?',
        options: [
          'Position along a common, aligned baseline axis',
          'Angle and slice area in a circular donut chart',
          'Color hue saturation intensity across polygons'
        ],
        correctIndex: 0,
        explanation: 'Aligned position along a common scale offers the highest human perceptual decoding accuracy, avoiding area or angle distortion.'
      },
      tags: ['Cleveland & McGill', 'Cognitive Perception', 'Chart Selection'],
      readTimeSeconds: 40,
      sourceReference: 'MoSPI National Guidelines on Data Presentation, Section 4.2'
    },
    top_viz_2: {
      keyConcept: 'Chart selection must strictly align with the question: comparison, composition, distribution, or relationship.',
      summary: 'Before choosing a chart format, determine the analytic intent. Bar charts excel at discrete comparisons, scatter plots reveal two-variable correlations, and histograms communicate frequency distributions.',
      didYouKnow: 'Using dual Y-axes with differing scales is considered a primary cause of spurious correlation claims in government policy submissions.',
      practicalExample: 'To show how district education budgets correlate with female literacy rates, a bivariate scatter plot with a trendline is mathematically superior to twin bar charts.',
      retentionQuiz: {
        question: 'What is the primary risk of using dual vertical axes with different scales on a single chart?',
        options: [
          'It artificially inflates or deflates visual correlation between unrelated variables',
          'It doubles the required storage size of the publication file',
          'It is unsupported by standard modern web browsers'
        ],
        correctIndex: 0,
        explanation: 'Dual axes can be manipulated to make lines intersect arbitrarily, creating the false illusion of causation.'
      },
      tags: ['Chart Archetypes', 'Distribution Analysis', 'MoSPI Standards'],
      readTimeSeconds: 45,
      sourceReference: 'NSSTA Official Data Visualization Field Manual'
    },
    top_inf_1: {
      keyConcept: 'The Central Limit Theorem guarantees that sample means approximate normality when sample size n ≥ 30.',
      summary: 'Regardless of how skewed or non-normal the underlying population distribution might be, the distribution of sample means approaches a bell curve as sample size increases. This mathematical foundation enables confidence intervals and hypothesis testing in all large-scale sample surveys.',
      didYouKnow: 'To halve the standard error (margin of error) of an official survey estimate, you must quadruple (4x) the sample size.',
      practicalExample: 'In NSS Household Consumer Expenditure surveys, regional stratum samples exceeding n=30 allow civil servants to construct reliable 95% confidence intervals.',
      retentionQuiz: {
        question: 'By what factor must your survey sample size increase if you wish to reduce the standard error by half?',
        options: [
          'By 4 times (quadruple)',
          'By 2 times (double)',
          'By 10 times (decuple)'
        ],
        correctIndex: 0,
        explanation: 'Because standard error equals sigma divided by sqrt(n), quadrupling n reduces the denominator sqrt(4n) = 2*sqrt(n), halving the standard error.'
      },
      tags: ['Central Limit Theorem', 'Standard Error', 'Sample Surveys'],
      readTimeSeconds: 45,
      sourceReference: 'Statistical Foundations for Official Surveyors, Chapter 4'
    }
  };

  const specific = fallbackBank[input.topicId];
  if (specific && specific.keyConcept && specific.summary && specific.retentionQuiz) {
    return {
      id: `nugget_${input.topicId}_${Date.now()}`,
      topicId: input.topicId,
      topicTitle: input.topicTitle,
      courseId: input.courseId,
      courseTitle: input.courseTitle,
      competency: input.competency,
      keyConcept: specific.keyConcept,
      summary: specific.summary,
      didYouKnow: specific.didYouKnow || 'Ensuring positive inclusion probabilities is mandatory for design-unbiased official estimation.',
      practicalExample: specific.practicalExample || 'Utilized routinely in national survey administration and policy evaluation frameworks.',
      retentionQuiz: specific.retentionQuiz,
      tags: specific.tags || [input.competency, 'Daily Retention'],
      readTimeSeconds: specific.readTimeSeconds || 45,
      sourceReference: specific.sourceReference || 'National Statistical Systems Training Academy (NSSTA)',
      generatedAt: new Date().toISOString()
    };
  }

  // Dynamic fallback constructed from topic details
  return {
    id: `nugget_${input.topicId}_${Date.now()}`,
    topicId: input.topicId,
    topicTitle: input.topicTitle,
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    competency: input.competency,
    keyConcept: `Mastering ${input.topicTitle} is fundamental to ensuring rigorous, reproducible evidence in public statistics.`,
    summary: `${input.topicDescription} Spaced review reinforces core analytical decision rules, helping officers and students minimize cognitive biases and eliminate methodological errors.`,
    didYouKnow: `In official statistics and research standards, adhering to consistent definitions prevents non-sampling errors that cannot be corrected by larger sample sizes.`,
    practicalExample: `When analyzing socio-economic microdata or formulating administrative policy reports, applying ${input.competency} principles ensures accountability.`,
    retentionQuiz: {
      question: `What is the primary benefit of applying standardized methodologies to ${input.topicTitle}?`,
      options: [
        'Ensures temporal comparability and eliminates systematic administrative bias',
        'Guarantees 100% survey response rates without field visits',
        'Allows researchers to bypass formal peer and departmental review'
      ],
      correctIndex: 0,
      explanation: 'Standardized definitions and protocols protect longitudinal comparability and safeguard data integrity.'
    },
    tags: [input.competency, 'Retention', 'Micro-Learning'],
    readTimeSeconds: 40,
    sourceReference: 'NSSTA Official Statistics Handbook',
    generatedAt: new Date().toISOString()
  };
}

