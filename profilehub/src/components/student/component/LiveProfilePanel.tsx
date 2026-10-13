import React from 'react';
import { Profile } from '../../../types/type';

export const LiveProfilePanel: React.FC<{ profile?: Profile }> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center text-slate-400">
        <div className="space-y-4">
          <div className="w-12 h-12 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium">Đang xây dựng Career Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 bg-slate-50">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Live Career Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Cập nhật realtime từ hội thoại</p>
      </div>

      {/* Career Summary */}
      {profile.summary && (
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            {profile.summary}
          </p>
        </section>
      )}

      {/* Achievements Card (Thỏa mãn DoD) */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Achievements & Impacts</h3>
        <div className="space-y-3">
          {profile.achievements.map((ach) => (
            <div key={ach.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <p className="text-sm font-medium text-slate-900">{ach.description}</p>
                </div>
                {ach.metric && (
                  <div className="mt-2 inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100">
                    Metric: {ach.metric}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career DNA Widget (Linear Style Progress Bars) */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Career DNA</h3>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          {Object.entries(profile.careerDna).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-20 text-xs font-medium text-slate-600 capitalize">{key}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-bold text-slate-900">{value}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Progress Tracker Component */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Profile Completeness</h3>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-wrap gap-2">
          {['Context', 'Achievement', 'Impact', 'Evidence', 'Leadership'].map((step) => {
            const isDone = profile.progress?.[step.toLowerCase()] ?? false;
            return (
              <div key={step} className={`px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-colors ${
                isDone 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                {step}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};