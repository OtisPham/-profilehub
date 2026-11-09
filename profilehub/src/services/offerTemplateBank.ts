import type { OfferBenefitItem, CreateOfferParams } from '../types/database';

export const DEFAULT_OFFER_BENEFITS: OfferBenefitItem[] = [
  {
    id: 'ben_hw_macbook',
    category: 'hardware',
    icon: '💻',
    title: 'Trang Bị MacBook Pro M3 & Màn Hình 4K',
    description: 'Cấp máy tính cấu hình cao mới 100% kèm trợ cấp màn hình và phụ kiện công thái học tại nhà.'
  },
  {
    id: 'ben_health_vip',
    category: 'health',
    icon: '🏥',
    title: 'Bảo Hiểm Sức Khỏe VIP Toàn Diện',
    description: 'Gói chăm sóc sức khỏe quốc tế khám chữa bệnh tại các bệnh viện hàng đầu (Vinmec, FV, Hoàn Mỹ).'
  },
  {
    id: 'ben_culture_hybrid',
    category: 'culture',
    icon: '🏠',
    title: 'Làm Việc Linh Hoạt (Hybrid 2-3 Ngày WFH)',
    description: 'Chủ động quản lý thời gian, cân bằng công việc - cuộc sống mà không bị gò bó chấm công cứng nhắc.'
  },
  {
    id: 'ben_finance_bonus',
    category: 'finance',
    icon: '📈',
    title: 'Thưởng Hiệu Suất & Lương Tháng 13+',
    description: 'Đánh giá tăng lương định kỳ 2 lần/năm kèm thưởng dự án và cổ phần khuyến khích nhân tài (ESOP).'
  },
  {
    id: 'ben_learning_udemy',
    category: 'learning',
    icon: '🎓',
    title: 'Ngân Sách Học Tập $500/Năm & Mentor 1:1',
    description: 'Hỗ trợ mua khóa học Udemy, Coursera, thi chứng chỉ AWS/GCP và được Tech Lead kèm cặp 1:1.'
  },
  {
    id: 'ben_culture_trip',
    category: 'culture',
    icon: '🏖️',
    title: 'Du Lịch Hàng Năm & 15 Ngày Phép Năm',
    description: 'Team building resort 5 sao hằng năm, 15 ngày phép hưởng nguyên lương và tiệc happy hour mỗi tuần.'
  }
];

export const getSampleOfferParams = (candidateId = 'cand_sample', candidateName = 'Nguyễn Văn An'): CreateOfferParams => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  return {
    candidateId,
    candidateName,
    candidateEmail: 'candidate@example.com',
    recruiterId: 'recruiter_enterprise_01',
    companyName: 'Công Ty Cổ Phần Công Nghệ ProfileHub',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=120&h=120&q=80',
    isCompanyVerified: true,
    jobTitle: 'Junior Fullstack Engineer',
    department: 'Khối Phát Triển Sản Phẩm (Product & Engineering)',
    level: 'junior',
    workplaceType: 'hybrid',
    location: 'Tầng 12, Tòa nhà Innovation, TP. Hồ Chí Minh',
    salaryOfficial: 16000000,
    salaryProbation: 13600000,
    probationPeriodMonths: 2,
    signOnBonus: 5000000,
    currency: 'VND',
    startDate: nextMonth.toISOString().split('T')[0],
    deadlineDate: deadline.toISOString().split('T')[0],
    benefits: DEFAULT_OFFER_BENEFITS,
    customMessage: 'Hội đồng tuyển dụng và Ban Lãnh đạo rất ấn tượng với đồ án thực chiến và phong thái bảo vệ giải pháp kỹ thuật của bạn trong buổi phỏng vấn. Chúng tôi tin rằng bạn sẽ là mảnh ghép xuất sắc để cùng ProfileHub vươn xa!'
  };
};
