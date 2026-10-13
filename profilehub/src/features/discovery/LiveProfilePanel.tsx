import React from 'react';
import type { CareerDNA, PublicPendingFact } from '../../types';
import { FactCard } from './FactCard';

interface LiveProfilePanelProps {
  careerDNA: CareerDNA;
  pendingFacts: PublicPendingFact[];
  onResolveFact: (factId: string, action: 'confirm' | 'reject') => void;
}

export const LiveProfilePanel: React.FC<LiveProfilePanelProps> = ({
  careerDNA,
  pendingFacts,
  onResolveFact,
}) => {
  const pendingCount = pendingFacts.filter((f) => f.status === 'pending').length;

  return (
    <aside className="hidden lg:flex lg:w-88 bg-white border-l border-gray-200 flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-semibold text-base text-gray-900">Live Career DNA</h2>
        <p className="text-xs text-gray-500 mt-0.5">Tiến trình định hình hồ sơ trực tiếp</p>
      </div>

      <div className="flex-1 p-5 space-y-6 overflow-y-auto">
        {/* Progress & Scores */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
              Độ hoàn thiện hồ sơ
            </span>
            <span className="text-sm font-bold text-blue-700">{careerDNA.discoveryProgress}%</span>
          </div>
          <div className="w-full bg-blue-200/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${careerDNA.discoveryProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-blue-200/50">
            <div>
              <span className="text-[11px] text-gray-500 block">Employability Score</span>
              <strong className="text-lg font-bold text-gray-900">{careerDNA.employabilityScore}/100</strong>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Vị thế thị trường</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-0.5">
                {careerDNA.marketPosition}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Facts Section */}
        {pendingCount > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Chờ xác nhận ({pendingCount})
              </h3>
            </div>
            <div className="space-y-2">
              {pendingFacts
                .filter((f) => f.status === 'pending')
                .map((fact) => (
                  <FactCard key={fact.id} fact={fact} onResolve={onResolveFact} />
                ))}
            </div>
          </div>
        )}

        {/* Top Strengths */}
        <div>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Thế mạnh nổi bật
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {careerDNA.topStrengths.map((st, i) => (
              <span
                key={i}
                className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-lg border border-gray-200/60"
              >
                ★ {st}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Roles */}
        <div>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Vị trí gợi ý
          </h3>
          <div className="space-y-1.5">
            {careerDNA.recommendedRoles.map((role, i) => (
              <div
                key={i}
                className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-800 flex items-center justify-between"
              >
                <span>{role}</span>
                <span className="text-[11px] text-blue-600 font-semibold">Match 92%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer action */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm"
        >
          Xuất Hồ Sơ & Báo Cáo
        </button>
      </div>
    </aside>
  );
};
