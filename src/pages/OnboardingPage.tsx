import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Settings, Save, CheckCircle2, Sparkles, UserCheck, GraduationCap } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (page: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { profile, updateProfile, triggerConfetti } = useAuth();

  const [formData, setFormData] = useState({
    educationLevel: profile?.educationLevel || 'Undergraduate',
    degree: profile?.degree || 'B.Sc Mathematics',
    specialization: profile?.specialization || 'Applied Statistics & Probability',
    institution: profile?.institution || 'Delhi University',
    currentRole: profile?.currentRole || 'Junior Statistical Officer',
    department: profile?.department || 'Survey Design & Research Division',
    experienceLevel: profile?.experienceLevel || 'Entry',
    interests: profile?.interests || ['Data Science', 'Statistics', 'AI', 'Data Visualization'],
    skills: profile?.skills || ['Statistics', 'Excel', 'Basic Python'],
    learningGoals: profile?.learningGoals || ['Improve Data Analytics', 'Prepare for Senior Statistical Officer']
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePreFillDemo = () => {
    setFormData({
      educationLevel: 'Undergraduate',
      degree: 'B.Sc Mathematics',
      specialization: 'Applied Statistics & Probability',
      institution: 'Delhi University',
      currentRole: 'Junior Statistical Officer',
      department: 'Survey Design & Research Division',
      experienceLevel: 'Entry',
      interests: ['Data Science', 'Statistics', 'AI', 'Data Visualization', 'Official Statistics'],
      skills: ['Statistics', 'Excel', 'Basic Python', 'Survey Sampling'],
      learningGoals: ['Improve Data Analytics', 'Master Official Statistical Dissemination', 'Prepare for Senior Statistical Officer']
    });
  };

  const handleSave = async () => {
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      updateProfile(formData);
      setSavedSuccess(true);
      triggerConfetti();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            <span>Learner Profile & Academic Background</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
            Officer Profile & Role Configuration
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pragya AI feeds these parameters into the 12-factor recommendation engine to calculate course match scores.
          </p>
        </div>

        <button
          onClick={handlePreFillDemo}
          className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-900 px-3.5 py-2 text-xs font-bold transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-600" />
          <span>Prefill MoSPI JSO Profile</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Profile saved! Course recommendations will now prioritize closing your Data Visualization gap.</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Education Level</label>
            <select
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
            >
              <option value="Undergraduate">Undergraduate (B.Sc / B.Tech / B.A)</option>
              <option value="Postgraduate">Postgraduate (M.Sc / M.Stat / M.Tech)</option>
              <option value="Doctorate">Doctorate (Ph.D)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Degree & Discipline</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              placeholder="e.g. B.Sc Mathematics"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Specialization</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              placeholder="e.g. Applied Statistics"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Institution / University</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              placeholder="e.g. Delhi University"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Current Role / Cadre</label>
            <input
              type="text"
              value={formData.currentRole}
              onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              placeholder="e.g. Junior Statistical Officer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Department / Wing</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              placeholder="e.g. Survey Design & Research Division"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white px-6 py-2.5 text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="h-4 w-4 text-[#FF9933]" />
            <span>Save & Re-rank Recommendations</span>
          </button>
        </div>
      </div>
    </div>
  );
};
