import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play, ExternalLink, Award, Shield, CheckCircle2, X } from 'lucide-react';

interface ShowcasedCoursesProps {
  onNavigate?: (page: string) => void;
  onSelectCourse?: (courseId: string) => void;
}

export interface ShowcasedCourseItem {
  id: string;
  title: string;
  duration: string;
  provider: string;
  providerType: string;
  image: string;
  badge: string;
  description: string;
  category: string;
  enrolled: number;
}

export const SHOWCASED_COURSES_DATA: ShowcasedCourseItem[] = [
  {
    id: 'sc_posh',
    title: 'Prevention of Sexual Harassment of Women at Workplace',
    duration: '1h 52m',
    provider: 'By Institute of Secretariat Training and Management',
    providerType: 'ISTM',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    badge: 'Course',
    category: 'Behavioral & Governance',
    description: 'Statutory compliance under PoSH Act 2013, Internal Complaints Committee (ICC) procedures, gender sensitization, and employer obligations in government departments.',
    enrolled: 42800
  },
  {
    id: 'sc_fire_safety',
    title: 'Fire Safety in Healthcare Facilities',
    duration: '1h 23m',
    provider: 'By Ministry of Health and Family Welfare',
    providerType: 'MoHFW',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    badge: 'Course',
    category: 'Emergency Preparedness',
    description: 'Protocol on hospital fire audits, medical gas cylinder hazards, fire evacuation paths, and critical ICU life-support containment protocols.',
    enrolled: 31200
  },
  {
    id: 'sc_ndrf',
    title: 'Civil Defence Services (नागरिक सुरक्षा सेवाएँ)',
    duration: '1h 17m',
    provider: 'By National Disaster Response Force (NDRF)',
    providerType: 'NDRF',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    badge: 'Course',
    category: 'Disaster Management',
    description: 'Community first-response doctrines, air raid precautions, flood & earthquake rapid drills, and coordination with district magistrate disaster units.',
    enrolled: 54600
  },
  {
    id: 'sc_swachhata',
    title: 'स्वच्छता ही सेवा - 2024 पर प्रशिक्षण मॉड्यूल',
    duration: '20m',
    provider: 'By Ministry of Housing and Urban Affairs (MoHUA)',
    providerType: 'MoHUA',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    badge: 'Course',
    category: 'Public Health & Mission Mode',
    description: 'Safaimitra Suraksha Shivirs, transformation of Cleanliness Target Units (CTUs), and nationwide mass cleanliness mobilization benchmarks.',
    enrolled: 89400
  },
  {
    id: 'sc_data_viz',
    title: 'Data Visualization for Statistical Analysis',
    duration: '4h 30m',
    provider: 'By National Statistical Systems Training Academy (NSSTA)',
    providerType: 'MoSPI',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    badge: 'Course',
    category: 'Official Statistics',
    description: 'Principles of graphical perception, Cleveland rankings, NSS thematic maps, and executive dashboard design for civil services.',
    enrolled: 18900
  },
  {
    id: 'sc_evidence_policy',
    title: 'Principles of Evidence-Based Policy in Official Statistics',
    duration: '5h 00m',
    provider: 'By Capacity Building Commission (CBC)',
    providerType: 'CBC',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    badge: 'Course',
    category: 'Policy & Governance',
    description: 'Translating survey findings into actionable cabinet policy notes and statistical validation methodologies.',
    enrolled: 22400
  }
];

export const ShowcasedCourses: React.FC<ShowcasedCoursesProps> = ({ onNavigate, onSelectCourse }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<ShowcasedCourseItem | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCardClick = (course: ShowcasedCourseItem) => {
    if (onSelectCourse) {
      onSelectCourse(course.id);
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <section className="relative w-full rounded-3xl bg-[#FAF4EB] border border-orange-100/70 p-6 sm:p-8 overflow-hidden shadow-xs">
      {/* Subtle watermark pattern background */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0F2942 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="w-16 hidden sm:block" /> {/* spacer for centered title */}

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F2942] font-['Space_Grotesk'] text-center flex-1">
          Showcased Courses
        </h2>

        <button
          onClick={() => onNavigate && onNavigate('recommendations')}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap"
        >
          <span>Show all</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Horizontal Scroll Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth snap-x snap-mandatory"
        >
          {SHOWCASED_COURSES_DATA.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCardClick(course)}
              className="w-[280px] sm:w-[290px] shrink-0 snap-start rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col overflow-hidden group/card hover:-translate-y-0.5"
            >
              {/* Card Image with duration overlay */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Duration Badge on image bottom-right */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-medium text-white shadow-xs">
                  <Clock className="h-3 w-3 text-slate-300" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {/* Category / Type Badge */}
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-300 bg-orange-50/60 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">
                      <Play className="h-2.5 w-2.5 fill-orange-600 text-orange-600" />
                      <span>{course.badge}</span>
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-sm font-bold text-[#1E3A8A] group-hover/card:text-blue-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                {/* Provider info with emblem icon */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 text-[10px] font-bold font-serif">
                    🏛️
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                    {course.provider}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Modal Preview if clicked */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wider">
              <Play className="h-3.5 w-3.5 fill-orange-600 text-orange-600" />
              <span>Showcased Pragya AI Accredited Course</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] leading-tight">
                {selectedCourse.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Accredited Body</div>
                <div className="font-semibold text-slate-800 mt-0.5">{selectedCourse.providerType}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Duration</div>
                <div className="font-semibold text-slate-800 mt-0.5">{selectedCourse.duration}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Competency Pillar</div>
                <div className="font-semibold text-slate-800 mt-0.5">{selectedCourse.category}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Officers Enrolled</div>
                <div className="font-semibold text-slate-800 mt-0.5">{selectedCourse.enrolled.toLocaleString()}+</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  if (onNavigate) onNavigate('topic_learning');
                }}
                className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Launch in Pragya AI Learning Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
