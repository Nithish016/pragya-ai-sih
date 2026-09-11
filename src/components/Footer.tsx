import React from 'react';
import { ExternalLink, Shield, HelpCircle, FileText, Phone, Mail, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-700">
      {/* Upper Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Pragya AI / MoSPI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#0F2942] flex items-center justify-center text-white font-black text-xs">
                PAI
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#0F2942] leading-tight flex items-center gap-1.5">
                  <span>Pragya AI</span>
                  <span className="text-orange-600 font-bold text-xs">(प्रज्ञा AI)</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Civil Services Capacity Building • Government of India
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pragya AI is a next-generation civil service capacity building platform featuring AI competency gap diagnostics, adaptive multi-format learning, interactive state performance heatmaps, and national ministry leaderboards.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold pt-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>MoSPI Cadre Node: Active</span>
            </div>
          </div>

          {/* Col 2: Core Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2942] mb-3">
              Platform Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="hover:text-orange-600 cursor-pointer">Learn Hub (Course Catalog)</li>
              <li className="hover:text-orange-600 cursor-pointer">Competencies Hub (FRAC Matrix)</li>
              <li className="hover:text-orange-600 cursor-pointer">Interactive SkillQuest (Games & Quizzes)</li>
              <li className="hover:text-orange-600 cursor-pointer">Discussion & Peer Learning</li>
              <li className="hover:text-orange-600 cursor-pointer">Cadre Leaderboard & Badges</li>
            </ul>
          </div>

          {/* Col 3: Key Partners & Institutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2942] mb-3">
              Capacity Building Partners
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="hover:text-orange-600 cursor-pointer">National Statistical Systems Training Academy (NSSTA)</li>
              <li className="hover:text-orange-600 cursor-pointer">Capacity Building Commission (CBC)</li>
              <li className="hover:text-orange-600 cursor-pointer">Institute of Secretariat Training & Management (ISTM)</li>
              <li className="hover:text-orange-600 cursor-pointer">Lal Bahadur Shastri National Academy of Administration (LBSNAA)</li>
              <li className="hover:text-orange-600 cursor-pointer">Department of Personnel & Training (DoPT)</li>
            </ul>
          </div>

          {/* Col 4: Helpdesk & Grievances */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2942] mb-3">
              Support & Grievance
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-orange-600" />
                <span>Toll-Free: 1800-11-2026 (Mon-Sat 9AM-6PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-orange-600" />
                <span>support@pragya-ai.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>Grievance Officer: Shri D.K. Sharma, Director</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Ministry of Statistics & Programme Implementation (MoSPI), Sardar Patel Bhawan, New Delhi - 110001
              </div>
            </div>
          </div>
        </div>

        {/* Partners Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-bold text-slate-700">Supported Portals:</span>
            <span className="hover:text-slate-900 cursor-pointer">Digital India</span>
            <span className="hover:text-slate-900 cursor-pointer">MyGov.in</span>
            <span className="hover:text-slate-900 cursor-pointer">data.gov.in</span>
            <span className="hover:text-slate-900 cursor-pointer">India.gov.in</span>
            <span className="hover:text-slate-900 cursor-pointer">MoSPI Official</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Last Updated: 10 September 2026 • Portal Version 4.2.8
          </div>
        </div>
      </div>

      {/* Official Government Disclaimer Bar */}
      <div className="bg-[#0F2942] text-white py-4 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            Pragya AI @2026 (प्रज्ञा AI) • Ministry of Statistics & Programme Implementation (MoSPI), Government of India. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Hyperlinking Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Accessibility Statement</span>
          </div>
        </div>
      </div>

      {/* Indian Tricolor Strip at bottom */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>
    </footer>
  );
};
