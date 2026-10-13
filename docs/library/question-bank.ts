// =====================================================================
// Ngân hàng câu hỏi FRS v1.1 (mục 3.3 spec). Mỗi câu chỉ có ĐÚNG 1 dấu "?"
// để ai_reply luôn tuân thủ quy tắc "1 câu hỏi mỗi lượt".
// =====================================================================

export type QuestionPriority = "P0" | "P1" | "P2";

export interface BankQuestion {
  id: string;
  priority: QuestionPriority;
  kind: "slot" | "nudge";
  text: string;
}

const q = (id: string, priority: QuestionPriority, text: string, kind: "slot" | "nudge" = "slot"): BankQuestion =>
  ({ id: `FRS-${id}`, priority, kind, text });

export const QUESTION_BANK: readonly BankQuestion[] = [
  // Học vấn
  q("EDU-01", "P0", "Bạn học trường nào, ngành gì, năm mấy và dự kiến tốt nghiệp khi nào?"),
  q("EDU-02", "P1", "Môn học hoặc đồ án nào bạn hứng thú và làm tốt nhất, vì sao?"),
  q("EDU-03", "P1", "Bạn có học bổng, điểm cao hay giải thưởng học thuật nào không?"),
  // Đồ án, dự án
  q("PRJ-01", "P0", "Kể mình nghe về một đồ án hoặc dự án bạn tự hào nhất: mục tiêu là gì và nhóm có mấy người?"),
  q("PRJ-02", "P0", "Phần nào trong dự án là do riêng bạn làm và tự quyết định?"),
  q("PRJ-03", "P1", "Khó khăn lớn nhất trong dự án là gì và bạn đã xử lý ra sao?"),
  q("PRJ-04", "P0", "Có ai dùng, xem hoặc chấm sản phẩm này không, ví dụ điểm số, nhận xét của giảng viên hay link demo/GitHub?"),
  q("PRJ-05", "P1", "Nếu được làm lại, bạn sẽ đổi điều gì?"),
  // CLB, tình nguyện, cuộc thi
  q("ACT-01", "P0", "Bạn có tham gia CLB, đội nhóm hay hoạt động tình nguyện nào không, vai trò và trong bao lâu?"),
  q("ACT-02", "P0", "Bạn từng tổ chức hoặc phụ trách việc gì, quy mô ra sao (số người, số buổi, ngân sách)?"),
  q("ACT-03", "P1", "Bạn từng tham gia cuộc thi nào, với vai trò, kết quả và bài học gì?"),
  // Làm thêm, thực tập
  q("JOB-01", "P0", "Bạn từng làm thêm, thực tập hoặc freelance gì, kể cả việc không liên quan đến ngành?"),
  q("JOB-02", "P1", "Công việc đó dạy bạn điều gì phù hợp với vị trí bạn muốn ứng tuyển?"),
  q("JOB-03", "P2", "Có lúc nào bạn phải xử lý một khách hàng hoặc đồng nghiệp khó không?"),
  // Tự học
  q("LRN-01", "P1", "Bạn tự học điều gì ngoài chương trình, bằng cách nào và trong bao lâu?"),
  q("LRN-02", "P1", "Bạn đã tạo ra sản phẩm, bài viết hay repo nào từ việc tự học?"),
  q("LRN-03", "P2", "Bạn có từng giúp bạn khác học, như kèm bạn, làm gia sư hay viết tài liệu không?"),
  // Động lực
  q("MOT-01", "P0", "Điều gì khiến bạn quan tâm đến vị trí hoặc lĩnh vực này, có khoảnh khắc nào không?"),
  q("MOT-02", "P1", "Trong học tập và hoạt động, bạn thích loại việc nào nhất và việc gì làm bạn mất năng lượng?"),
  q("MOT-03", "P2", "Nếu chưa chắc muốn làm gì, có vài việc nào bạn thấy mình làm tốt và thích nhất không?"),
  // Câu gợi nhớ (dùng khi người dùng bí, không tính là slot)
  q("NUDGE-01", "P2", "Nghĩ về học kỳ gần nhất: có việc nhóm nào mà nếu bạn không làm thì nhóm sẽ gặp khó không?", "nudge"),
  q("NUDGE-02", "P2", "Lần gần nhất có ai nhờ bạn giúp một việc học tập, kỹ thuật hay tổ chức là khi nào?", "nudge"),
  q("NUDGE-03", "P2", "Có việc nào bạn tự làm mà không ai bắt bạn không?", "nudge"),
];

export const QUESTION_IDS: ReadonlySet<string> = new Set(QUESTION_BANK.map((x) => x.id));

const PRIORITY_RANK: Record<QuestionPriority, number> = { P0: 0, P1: 1, P2: 2 };

export function getQuestion(id: string | null | undefined): BankQuestion | undefined {
  return id ? QUESTION_BANK.find((x) => x.id === id) : undefined;
}

/** Các câu hỏi (slot) chưa được phủ, ưu tiên P0 -> P2, giữ thứ tự trong ngân hàng. */
export function openQuestions(covered: ReadonlySet<string>, limit = 5): BankQuestion[] {
  return QUESTION_BANK
    .map((question, order) => ({ question, order }))
    .filter(({ question }) => question.kind === "slot" && !covered.has(question.id))
    .sort((a, b) => PRIORITY_RANK[a.question.priority] - PRIORITY_RANK[b.question.priority] || a.order - b.order)
    .slice(0, limit)
    .map(({ question }) => question);
}

/** Câu gợi nhớ, xoay vòng theo số lượt để tránh lặp. */
export function pickNudge(turnCount: number): BankQuestion {
  const nudges = QUESTION_BANK.filter((x) => x.kind === "nudge");
  return nudges[turnCount % nudges.length];
}
