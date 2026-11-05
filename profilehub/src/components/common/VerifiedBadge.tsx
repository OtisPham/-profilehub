import React from 'react';
import { ShieldCheck, Rocket, Sparkles, ExternalLink } from 'lucide-react';
import { VerifiedBadgeProps, ProjectBadgeVariant } from '../../types/projectBadge.types';
import { getBadgeVisualConfig } from '../../services/projectBadgeService';

export default function VerifiedBadge({
  variant = 'verified',
  demoUrl,
  evidenceName,
  verifiedAt,
  size = 'md',
  interactive = true,
  className = ''
}: VerifiedBadgeProps) {
  if (variant === 'none') {
    return null;
  }

  const formattedDate = verifiedAt ? new Date(verifiedAt).toLocaleDateString('vi-VN') : '';
  const config = getBadgeVisualConfig(variant);

  // Kích thước chuẩn hóa theo size
  const sizeStyles = {
    sm: { padding: '2.5px 8px', fontSize: '11px', iconSize: 13, linkIconSize: 10, gap: '4px' },
    md: { padding: '4px 10px', fontSize: '11.5px', iconSize: 14, linkIconSize: 11, gap: '5px' },
    lg: { padding: '6px 14px', fontSize: '12.5px', iconSize: 16, linkIconSize: 12, gap: '6px' },
  }[size];

  const hasValidDemo = Boolean(demoUrl && demoUrl.trim() !== '' && demoUrl.trim() !== '#');
  const canClick = Boolean(interactive && hasValidDemo && (variant === 'full' || variant === 'demo-ready'));

  const handleClick = (e: React.MouseEvent) => {
    if (canClick && demoUrl) {
      e.stopPropagation();
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (canClick && demoUrl && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Xác định tooltip hiển thị
  let tooltipText = config?.tooltip || 'Đồ án đã được xác thực';
  if (formattedDate) {
    tooltipText = `Đồ án đã được xác thực (${formattedDate})`;
  } else if (canClick) {
    tooltipText = `🚀 Bấm để mở bản Demo trực tiếp: ${demoUrl}`;
  }

  // Render Icon phù hợp
  const renderIcon = () => {
    switch (variant) {
      case 'full':
        return <Sparkles size={sizeStyles.iconSize} color={config?.textColor || '#065f46'} className="shrink-0" />;
      case 'demo-ready':
        return <Rocket size={sizeStyles.iconSize} color={config?.textColor || '#1d4ed8'} className="shrink-0" />;
      case 'verified':
      default:
        return <ShieldCheck size={sizeStyles.iconSize} color={config?.textColor || '#059669'} className="shrink-0" />;
    }
  };

  // Nhãn hiển thị
  let displayLabel = config?.label || 'Verified';
  if (variant === 'verified' && evidenceName) {
    displayLabel = `Verified: ${evidenceName}`;
  }

  return (
    <div
      role={canClick ? 'button' : undefined}
      tabIndex={canClick ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`verified-badge inline-flex items-center select-none transition-all duration-150 ${
        canClick ? 'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        backgroundColor: config?.bgColor || '#ecfdf5',
        color: config?.textColor || '#059669',
        border: `1px solid ${config?.borderColor || '#a7f3d0'}`,
        borderRadius: '16px',
        fontWeight: 700,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        boxShadow: canClick ? '0 1px 3px rgba(0, 0, 0, 0.08)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
        cursor: canClick ? 'pointer' : 'default',
      }}
      title={tooltipText}
      aria-label={tooltipText}
    >
      {renderIcon()}
      <span>{displayLabel}</span>
      {canClick && (
        <ExternalLink
          size={sizeStyles.linkIconSize}
          color={config?.textColor || '#1d4ed8'}
          style={{ opacity: 0.7, marginLeft: '1px' }}
        />
      )}
    </div>
  );
}
export { VerifiedBadge };
