import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  teacherName?: string;
  verifiedAt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerifiedBadge({ verifiedAt, size = 'md' }: VerifiedBadgeProps) {
  const formattedDate = verifiedAt ? new Date(verifiedAt).toLocaleDateString('vi-VN') : '';

  const sizeStyles = {
    sm: { padding: '2.5px 8px', fontSize: '11px', iconSize: 13 },
    md: { padding: '4px 10px', fontSize: '11.5px', iconSize: 15 },
    lg: { padding: '6px 14px', fontSize: '12.5px', iconSize: 16 },
  }[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#ecfdf5',
        color: '#059669',
        border: '1px solid #a7f3d0',
        borderRadius: '16px',
        fontWeight: 'bold',
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
      title={formattedDate ? `Đồ án đã được xác thực (${formattedDate})` : 'Đồ án đã được xác thực'}
    >
      <ShieldCheck size={sizeStyles.iconSize} color="#059669" />
      <span>Verified</span>
    </div>
  );
}
