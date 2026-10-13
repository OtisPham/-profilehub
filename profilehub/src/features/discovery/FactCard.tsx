import React from 'react';
import type { PublicPendingFact } from '../../types';

interface FactCardProps {
  fact: PublicPendingFact;
  onResolve: (factId: string, action: 'confirm' | 'reject') => void;
}

export const FactCard: React.FC<FactCardProps> = ({ fact, onResolve }) => {
  const isPending = fact.status === 'pending';

  return (
    <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-sm transition-all hover:border-blue-300 mb-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
          {fact.entity_type}
        </span>
        <span className="text-[11px] text-gray-400">
          Độ tin cậy: <strong className="text-gray-600 capitalize">{fact.confidence}</strong>
        </span>
      </div>

      <p className="text-xs text-gray-800 font-medium line-clamp-2">
        {fact.data.title || fact.data.description || fact.evidence_quote}
      </p>

      {fact.data.techStack && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {fact.data.techStack.map((tech: string) => (
            <span key={tech} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {tech}
            </span>
          ))}
        </div>
      )}

      {isPending ? (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onResolve(fact.id, 'confirm')}
            className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded-lg transition-colors"
          >
            ✓ Xác nhận
          </button>
          <button
            type="button"
            onClick={() => onResolve(fact.id, 'reject')}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1 px-2 rounded-lg transition-colors"
          >
            ✕ Bỏ qua
          </button>
        </div>
      ) : (
        <div className="mt-2 text-[11px] font-medium text-right">
          {fact.status === 'confirmed' ? (
            <span className="text-emerald-600">✓ Đã thêm vào Profile</span>
          ) : (
            <span className="text-gray-400">Đã bỏ qua</span>
          )}
        </div>
      )}
    </div>
  );
};
