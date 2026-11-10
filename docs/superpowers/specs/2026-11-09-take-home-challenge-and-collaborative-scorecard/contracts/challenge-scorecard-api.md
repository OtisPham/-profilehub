# Giao Ước Kỹ Thuật: Service API Thử Thách Kỹ Thuật & Bảng Chấm Điểm
> **Mã đặc tả:** `SPEC-20261109-CHALLENGE-SCORECARD`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-take-home-challenge-and-collaborative-scorecard/data-model.md), [`src/utils/pipelineSync.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/utils/pipelineSync.ts)

---

## 1. Giao Ước Service `challengeScorecardService.ts`

```typescript
export interface IChallengeScorecardService {
  /**
   * Nhà tuyển dụng giao thử thách kỹ thuật cho ứng viên
   */
  issueChallenge(params: {
    candidatePipelineId: string;
    recruiterId: string;
    studentId: string;
    jobId: string;
    title: string;
    description: string;
    requirements: string[];
    deadlineHours: number;
  }): TakeHomeChallenge;

  /**
   * Sinh viên nộp bài giải thử thách kèm link GitHub Pull Request
   */
  submitChallengeSolution(params: {
    candidatePipelineId: string;
    pullRequestUrl: string;
    demoUrl?: string;
    solutionNotes: string;
  }): TakeHomeChallenge | null;

  /**
   * Nhà tuyển dụng chấm điểm và đánh giá bài giải thử thách
   */
  evaluateChallenge(params: {
    candidatePipelineId: string;
    score: number;
    feedback: string;
    evaluatedBy: string;
  }): TakeHomeChallenge | null;

  /**
   * Người phỏng vấn gửi phiếu chấm điểm phỏng vấn (Scorecard)
   */
  submitScorecard(params: {
    candidatePipelineId: string;
    interviewerId: string;
    interviewerName: string;
    interviewerRole: string;
    scores: ScorecardCriteriaScores;
    recommendation: ScorecardRecommendation;
    strengths: string;
    improvementAreas: string;
  }): InterviewScorecard;

  /**
   * Tính toán điểm đồng thuận trung bình từ tất cả các Scorecards của ứng viên
   */
  calculateConsensus(scorecards: InterviewScorecard[]): {
    averageScore: number;
    recommendation: ScorecardRecommendation;
    totalInterviews: number;
  };

  /**
   * Tạo thông tin ẩn danh trung tính cho chế độ Blind Screening
   */
  getBlindCandidateInfo(candidateId: string): {
    anonymousName: string;
    anonymousRole: string;
  };
}
```

---

## 2. UI Component Contracts

### 2.1. `IssueChallengeModal.tsx`
* **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `candidate: CandidatePipelineItem | null`
  - `onChallengeIssued?: (challenge: TakeHomeChallenge) => void`
* **Nghiệp vụ:**
  - Cung cấp sẵn các mẫu đề bài (Template Bank) theo ngành: Frontend (Tối ưu Core Web Vitals), Backend (RBAC / Redis Caching), Fullstack (Real-time Chat).
  - Tự động điền deadline dựa trên số giờ đã chọn (48h, 72h, 120h).

### 2.2. `SubmitChallengeModal.tsx`
* **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `candidate: CandidatePipelineItem | null`
  - `onSubmitted?: (challenge: TakeHomeChallenge) => void`
* **Nghiệp vụ:**
  - Hiển thị đề bài và đồng hồ đếm ngược thời gian còn lại (Countdown Timer).
  - Form nhập: GitHub Pull Request URL, Demo link, Lời chú thích giải pháp kiến trúc.

### 2.3. `InterviewScorecardModal.tsx`
* **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `candidate: CandidatePipelineItem | null`
  - `interviewerName: string`
  - `onScorecardSaved?: (scorecard: InterviewScorecard) => void`
* **Nghiệp vụ:**
  - Hệ thống 5 sao trực quan cho 5 tiêu chí vàng.
  - Tùy chọn đề xuất: `Tuyển Ngay (Strong Hire)` / `Tuyển (Hire)` / `Phân Vân (Neutral)` / `Từ Chối (No Hire)`.
  - Ô nhập Điểm mạnh & Điểm cần cải thiện.
