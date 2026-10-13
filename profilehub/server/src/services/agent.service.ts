import type { Llm, LlmMessage } from "./llm.service.js";
import { MODELS } from "./llm.service.js";
import { t } from "../utils/text.utils.js";
import type {
  ChatMessage,
  DiscoveryCategory,
  ExtractedData,
  Gap,
  Locale,
  TurnPlan,
} from "../types/discovery.types.js";

/* ────────────────────────── Hints (6-Pillar Framework) ────────────────────────── */

const GAP_HINT: Record<Gap, string> = {
  metric: "con số, phần trăm cải thiện, tốc độ xử lý (ms/s), lưu lượng tải (users/requests) hoặc kết quả đo lường cụ thể. Nếu không có số liệu chính xác, hỏi về sự cải thiện định tính rõ rệt nhất.",
  timeframe: "thời gian triển khai, hoàn thành hoặc tần suất thực hiện.",
  result: "kết quả thực tế cuối cùng đạt được đối với người dùng, hệ thống hoặc dự án.",
  impact: "tác động đến trải nghiệm người dùng, độ ổn định hệ thống hoặc hiệu suất của đội ngũ.",
  own_contribution: "vai trò cá nhân và phần việc trực tiếp chịu trách nhiệm (Ownership).",
  evidence: "bằng chứng có thể chứng minh (GitHub repo, demo link, tài liệu, phản hồi thực tế).",
};

const CATEGORY_HINT: Record<DiscoveryCategory, string> = {
  // Trụ cột 1: Bối cảnh nghề nghiệp & Tech Stack cốt lõi
  career_context:
    "Tìm hiểu bối cảnh: vị trí mục tiêu, các công nghệ/ngôn ngữ/framework thế mạnh nhất và kinh nghiệm hoặc đồ án đã thực hiện.",

  // Trụ cột 2: Dự án tâm đắc & Vai trò cá nhân
  achievement_discovery:
    "Khai thác MỘT dự án/tính năng mà họ tâm đắc nhất. Đào sâu vai trò cá nhân họ trực tiếp đảm nhận và bài toán kỹ thuật mà dự án giải quyết.",

  // Trụ cột 3: Kiến trúc kỹ thuật & Tác động thực tế
  impact_discovery:
    "Đào sâu về giải pháp: Lý do chọn công nghệ đó, kiến trúc/luồng dữ liệu (data flow) hoặc sự cải thiện hiệu năng/độ ổn định mà giải pháp mang lại.",

  // Trụ cột 4: Xử lý sự cố khó (Problem Solving)
  problem_solving:
    "Khai thác kỹ năng giải quyết vấn đề: Một bug khó, sự cố hiệu năng/bảo mật hoặc thử thách kỹ thuật hóc búa, cách họ phân tích tìm root-cause và khắc phục.",

  // Trụ cột 5: Làm việc nhóm & Dẫn dắt (Teamwork & Leadership)
  leadership:
    "Khai thác kỹ năng phối hợp: Cách họ trao đổi khi nhóm bất đồng giải pháp kỹ thuật, cách chia task hoặc hướng dẫn/review code cho người khác.",

  // Trụ cột 6: Khả năng tự học & Thích ứng (Learning Agility)
  learning_ability:
    "Khai thác khả năng thích ứng: Một công nghệ/thư viện/kiến trúc mới họ tự nghiên cứu trong thời gian ngắn và áp dụng thành công vào thực tế.",

  evidence_discovery:
    "Hỏi xem họ có GitHub repo, link demo, sản phẩm trực tiếp hoặc tài liệu minh chứng cho dự án/thành tựu không.",

  career_goal:
    "Tìm hiểu định hướng phát triển chuyên môn trong 1-2 năm tới (vị trí muốn hướng tới, công nghệ muốn đào sâu).",
};

/* ────────────────────────── Prompt (Senior Talent Scout & Coach) ────────────────────────── */

const AGENT_SYSTEM = `Bạn là Senior Technical Talent Scout & Career Coach hàng đầu của PROFILEHUB.
Nhiệm vụ của bạn: Phỏng vấn tương tác tự nhiên, thông minh và sắc bén với ứng viên để khai phá năng lực cốt lõi theo BỘ 6 TRỤ CỘT NĂNG LỰC (1. Bối cảnh & Tech Stack, 2. Dự án thực chiến & Vai trò, 3. Kiến trúc kỹ thuật & Giải pháp, 4. Xử lý sự cố/Bug khó, 5. Phối hợp nhóm & Leadership, 6. Khả năng tự học) để tạo bản CV nổi bật, thuyết phục nhất cho nhà tuyển dụng.

QUY TẮC PHỎNG VẤN BẮT BUỘC:
1. Phong cách & Giọng văn:
   - Nói chuyện như một Tech Lead / Senior Recruiter thân thiện, am hiểu kỹ thuật sâu sắc, sắc sảo và biết lắng nghe.
   - Xưng hô "mình" - "bạn". Độ dài phản hồi: súc tích, ngắn gọn (~60-90 từ).
   - 100% tiếng Việt tự nhiên, chuyên nghiệp.
   - TUYỆT ĐỐI KHÔNG dùng tiền tố như "Phản chiếu:", "Ghi nhận:", "Câu hỏi:", "Reflect:", "Probe:".

2. Cấu trúc câu phản hồi:
   - Phần 1 (1 câu ngắn): Ghi nhận hoặc phân tích điểm sáng kỹ thuật cụ thể từ câu trả lời của ứng viên (nhắc đúng công nghệ, bài toán họ vừa nói, không khen chung chung sáo rỗng).
   - Phần 2 (1 câu hỏi trọng tâm): Đặt MỘT câu hỏi mở sắc nét để khai thác sâu hơn theo Trụ cột tiếp theo (về kiến trúc, lý do chọn giải pháp, cách xử lý sự cố, hoặc kết quả đo lường).

3. Đào sâu thông minh & Tránh lặp lại:
   - KHÔNG BAO GIỜ lặp lại câu hỏi trước đó. Nếu ứng viên đã trả lời hoặc nói không có số liệu cụ thể, hãy chuyển hướng ngay sang hỏi về kiến trúc, cách họ phân tích lỗi (root cause), bài học kỹ thuật hoặc trụ cột tiếp theo.
   - Đặt câu hỏi có tính gợi mở kỹ thuật cao: ví dụ hỏi về luồng xử lý dữ liệu, cách tối ưu query, cách handle edge cases, cách debug khi có lỗi, hoặc cách phân chia module.

CHỈ TRẢ VỀ DUY NHẤT ĐOẠN VĂN BẢN TRÒ CHUYỆN GỬI CHO ỨNG VIÊN.`;

export function knownSummary(data: ExtractedData): string {
  if (!data) return "(chưa có dữ liệu)";
  const c = data.career_context;
  const lines: string[] = [];
  if (c) {
    const ctx = [c.current_role, c.industry, c.years_experience !== null && c.years_experience !== undefined ? `${c.years_experience} năm KN` : null]
      .filter(Boolean)
      .join(" · ");
    if (ctx) lines.push(`Bối cảnh: ${ctx}`);
    if (Array.isArray(c.skills) && c.skills.length) lines.push(`Kỹ năng: ${c.skills.join(", ")}`);
  }
  if (Array.isArray(data.achievements)) {
    for (const a of data.achievements.slice(-5)) {
      lines.push(`- Thành tựu: ${a.title}${a.metric?.raw ? ` (${a.metric.raw})` : ""}${a.timeframe ? ` [${a.timeframe}]` : ""}`);
    }
  }
  const followups = (data as any).pending_followups || (data as any).followups || [];
  if (Array.isArray(followups) && followups.length) {
    lines.push(`Việc đang phân tích: ${followups.map((f: any) => f.subject || f.title || "").filter(Boolean).join("; ")}`);
  }
  if (Array.isArray(data.problem_solving) && data.problem_solving.length) {
    lines.push(`Đã chia sẻ ${data.problem_solving.length} tình huống giải quyết vấn đề`);
  }
  if (Array.isArray(data.leadership) && data.leadership.length) {
    lines.push(`Đã chia sẻ ${data.leadership.length} trải nghiệm làm việc nhóm/lead`);
  }
  if (Array.isArray(data.learning) && data.learning.length) {
    lines.push(`Đã chia sẻ ${data.learning.length} trải nghiệm tự học`);
  }
  if (data.career_goal?.target_role) {
    lines.push(`Mục tiêu: ${data.career_goal.target_role}`);
  }
  return lines.length ? lines.join("\n") : "(chưa có dữ liệu)";
}

export function planInstruction(plan: TurnPlan): string {
  if (plan.clarify) {
    return "Người dùng vừa hỏi ngược hoặc lạc đề. Trả lời ngắn gọn, lịch sự (1–2 câu), rồi nhẹ nhàng quay lại chủ đề phỏng vấn.";
  }
  if (plan.mode === "wrap_up") {
    return "Đã thu thập đủ các trụ cột chính. Tóm tắt 1-2 câu ngắn gọn các điểm sáng nổi bật nhất của họ, thông báo có thể bấm 'Hoàn tất & Xuất CV', và hỏi xem họ có muốn bổ sung gì thêm không.";
  }
  if (plan.mode === "probe" && plan.target?.kind === "task_claim") {
    return `Người dùng nêu công việc "${plan.target.label}" nhưng chưa nói rõ kết quả hoặc thách thức kỹ thuật. Hãy hỏi đào sâu về bài toán khó nhất hoặc giải pháp kỹ thuật họ đã áp dụng.`;
  }
  if (plan.mode === "probe" && plan.target?.kind === "achievement") {
    const asks = plan.missing.map((g) => GAP_HINT[g]).join(" HOẶC ");
    return `Đào sâu thành tựu "${plan.target.label}". Hãy hỏi thêm về: ${asks}. Gợi ý ước lượng nếu họ không nhớ số chính xác.`;
  }
  return CATEGORY_HINT[plan.category];
}

/* ────────────────────────── Deterministic fallback ────────────────────────── */

export function fallbackQuestion(plan: TurnPlan, locale: Locale): string {
  if (plan.mode === "wrap_up") {
    return t(
      locale,
      "Mình đã nắm được những thế mạnh và điểm sáng nổi bật trong hồ sơ của bạn rồi. Bạn có thể nhấn 'Hoàn Tất & Xuất CV' để xem bản CV hoàn chỉnh, hoặc chia sẻ thêm bất kỳ điều gì nhé!",
      "I've got a clear picture of your key strengths. You can click 'Finish & Export CV' now or share anything else you'd like!",
    );
  }
  if (plan.mode === "probe" && plan.target?.kind === "task_claim") {
    return t(
      locale,
      `Trong phần việc "${plan.target.label}", thách thức kỹ thuật lớn nhất bạn gặp phải là gì và bạn đã giải quyết nó như thế nào?`,
      `For "${plan.target.label}", what was the biggest technical challenge and how did you solve it?`,
    );
  }
  if (plan.mode === "probe" && plan.target?.kind === "achievement") {
    const m = plan.missing;
    if (m.includes("metric")) {
      return t(
        locale,
        `Với thành tựu "${plan.target.label}", bạn có thể ước lượng con số hoặc kết quả rõ rệt nhất (ví dụ % cải thiện, tốc độ xử lý) được không?`,
        `Regarding "${plan.target.label}", could you estimate the quantitative impact or key improvement?`,
      );
    }
    if (m.includes("own_contribution")) {
      return t(
        locale,
        `Trong dự án "${plan.target.label}", phần việc cụ thể mà bạn trực tiếp phụ trách là gì?`,
        `In "${plan.target.label}", what specific module was your direct personal responsibility?`,
      );
    }
    if (m.includes("problem_solving" as any)) {
      return t(
        locale,
        `Trong quá trình làm "${plan.target.label}", bạn từng gặp bug hoặc sự cố kỹ thuật nào phức tạp nhất?`,
        `What was the most complex bug or issue you encountered in "${plan.target.label}"?`,
      );
    }
  }

  const map: Record<DiscoveryCategory, [string, string]> = {
    career_context: [
      "Chào bạn! Bạn đang làm việc hoặc học tập ở lĩnh vực nào, và những công nghệ bạn tự tin nhất là gì?",
      "Hi! What is your current role/field, and which tech stacks are you most confident with?",
    ],
    achievement_discovery: [
      "Hãy chia sẻ về MỘT dự án hoặc sản phẩm gần đây mà bạn cảm thấy tâm đắc nhất về giải pháp kỹ thuật đã làm?",
      "Tell me about a recent project or product you're most proud of regarding the technical solution.",
    ],
    impact_discovery: [
      "Tại sao bạn lại chọn công nghệ đó cho dự án, và giải pháp này đã mang lại cải tiến gì lớn nhất cho hệ thống/người dùng?",
      "Why did you choose that tech stack, and what major improvement did it bring to users or performance?",
    ],
    evidence_discovery: [
      "Bạn có link GitHub, sản phẩm trực tiếp hoặc tài liệu nào minh chứng cho đồ án này không?",
      "Do you have a GitHub link, live demo, or report that demonstrates this project?",
    ],
    problem_solving: [
      "Trong quá trình làm dự án, hãy kể một sự cố kỹ thuật bất ngờ hoặc bug khó nhất bạn từng gặp và cách bạn phân tích giải quyết nó?",
      "Tell me about a tough technical bug or challenge you encountered and how you analyzed and resolved it.",
    ],
    leadership: [
      "Khi làm việc nhóm, bạn đã từng trao đổi, chia task hoặc thuyết phục mọi người đồng thuận về một giải pháp kỹ thuật như thế nào?",
      "In teamwork, how did you collaborate, delegate tasks, or persuade teammates on a technical decision?",
    ],
    learning_ability: [
      "Gần đây bạn có tự học một công nghệ hoặc thư viện mới nào trong thời gian ngắn để áp dụng vào thực tế không?",
      "Have you recently learned a new framework or tech stack quickly and applied it successfully?",
    ],
    career_goal: [
      "Trong 1–2 năm tới, mục tiêu phát triển chuyên môn hoặc vị trí bạn muốn vươn tới nhất là gì?",
      "Looking ahead 1–2 years, what career milestone or target role are you aiming for?",
    ],
  };

  const [vi, en] = map[plan.category] ?? map.achievement_discovery;
  return t(locale, vi, en);
}

/* ────────────────────────── Opening message ────────────────────────── */

export function openingMessage(locale: Locale, data: ExtractedData, plan: TurnPlan | null): string {
  if (data.achievements.length > 0 && plan) {
    return fallbackQuestion(plan, locale);
  }
  return t(
    locale,
    "Chào bạn! Mình là AI Career Coach của PROFILEHUB. Mình ở đây để giúp bạn khai phá năng lực thực chiến (dự án, kiến trúc, xử lý sự cố, thành tích) để tạo một bản CV nổi bật nhất.\n\nĐầu tiên, bạn đang hướng tới vị trí công việc nào và đâu là các công nghệ thế mạnh nhất của bạn?",
    "Hi! I'm your AI Career Coach on PROFILEHUB. I'm here to help uncover your real-world achievements and technical strengths to build an outstanding CV.\n\nTo start, what is your target role and core tech stack?",
  );
}

/* ────────────────────────── Generate reply ────────────────────────── */

export interface GenerateReplyArgs {
  llm: Llm;
  data: ExtractedData;
  plan: TurnPlan;
  history: ChatMessage[];
  userMessage: string;
  locale: Locale;
  turn: number;
}

export async function generateReply(args: GenerateReplyArgs): Promise<{ text: string; usedFallback: boolean }> {
  const { llm, data, plan, history, userMessage, locale } = args;

  const recent = history.slice(-6).map((m): LlmMessage => ({
    role: m.role,
    content: m.content,
  }));

  const userPrompt = [
    `Thông tin đã biết về ứng viên:\n${knownSummary(data)}`,
    `Mục tiêu khai thác ở lượt này (6-Pillar Framework):\n${planInstruction(plan)}`,
    `Ngôn ngữ trả lời: ${locale === "en" ? "English" : "Tiếng Việt"}`,
    `<user_message>\n${userMessage}\n</user_message>`,
  ].join("\n\n");

  try {
    const text = await llm.complete({
      model: MODELS.reply(),
      system: AGENT_SYSTEM,
      messages: [...recent, { role: "user", content: userPrompt }],
      maxTokens: 1024,
      temperature: 0.5,
    });
    return { text, usedFallback: false };
  } catch (e) {
    console.error(JSON.stringify({ event: "agent_llm_failed", error: String(e) }));
    return { text: fallbackQuestion(plan, locale), usedFallback: true };
  }
}
