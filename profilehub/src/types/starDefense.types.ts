/**
 * STAR Defense Cheat-Sheet & Metric Justification Types
 * Phao cứu sinh giải trình số liệu phỏng vấn & bảo vệ câu chữ STAR trước Tech Lead
 */

export interface MetricBasisInfo {
  metricText: string;
  measurementTool: string;
  beforeMetric: string;
  afterMetric: string;
  reproductionMethod: string;
}

export interface TrapQuestionItem {
  id: string;
  question: string;
  interviewerIntent: string;
  modelAnswer: string;
  pitfallToAvoid: string;
}

export interface RedFlagWarning {
  term: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  suggestedReplacement: string;
}

export interface StarDefenseItem {
  id: string;
  bulletText: string;
  projectId?: string;
  projectName?: string;
  detectedTechs: string[];
  metricBasis?: MetricBasisInfo;
  trapQuestions: TrapQuestionItem[];
  redFlags: RedFlagWarning[];
  candidateNotes?: string;
  updatedAt: string;
}

export interface ProjectDefenseOverview {
  projectId: string;
  projectName: string;
  defenseItems: StarDefenseItem[];
  overallReadinessScore: number; // 0 - 100%
  highRiskCount: number;
  totalTrapQuestions: number;
}
