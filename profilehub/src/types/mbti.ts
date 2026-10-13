export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIDimensions {
  extraversion: number;  // 0..100 (100 = 100% E, 0 = 100% I)
  introversion: number;  // 100 - extraversion
  sensing: number;       // 0..100 (100 = 100% S, 0 = 100% N)
  intuition: number;     // 100 - sensing
  thinking: number;      // 0..100 (100 = 100% T, 0 = 100% F)
  feeling: number;       // 100 - thinking
  judging: number;       // 0..100 (100 = 100% J, 0 = 100% P)
  perceiving: number;    // 100 - judging
}

export interface MBTIProfileInfo {
  type: MBTIType;
  title: string;
  vietnameseTitle: string;
  tagline: string;
  badgeColor: string;
  badgeBg: string;
  strengths: string[];
  workStyle: string;
  idealTeamRole: string;
  communicationStyle: string;
  growthAreas: string[];
  behavioralQuestions: string[];
}

export interface MBTIQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  question: string;
  optionA: {
    text: string;
    value: 'E' | 'S' | 'T' | 'J';
  };
  optionB: {
    text: string;
    value: 'I' | 'N' | 'F' | 'P';
  };
}

export interface CandidateMBTIResult {
  mbtiType: MBTIType;
  dimensions: MBTIDimensions;
  testedAt: string;
  profile: MBTIProfileInfo;
}

export interface RoleMBTIPersona {
  roleKey: string;
  roleTitle: string;
  roleArchetype: string;
  roleArchetypeVi: string;
  primaryIdealType: MBTIType;
  idealTypes: MBTIType[];
  keyTraitsNeeded: string[];
  targetDimensions: {
    extraversionScore: number; // 0..100
    intuitionScore: number;    // 0..100
    thinkingScore: number;     // 0..100
    judgingScore: number;      // 0..100
  };
  workEnvironmentDescription: string;
}

export interface DualMBTIMatchAnalysis {
  candidateMBTI: CandidateMBTIResult;
  rolePersona: RoleMBTIPersona;
  idealProfileInfo: MBTIProfileInfo;
  synergyScore: number; // 0..100
  fitLevel: 'PERFECT_NATURAL_FIT' | 'STRONG_CULTURAL_FIT' | 'BALANCED_GROWTH_FIT' | 'POTENTIAL_MISALIGNMENT';
  fitLevelLabel: string;
  dimensionComparisons: Array<{
    dimension: 'EI' | 'SN' | 'TF' | 'JP';
    title: string;
    roleExpectation: string;
    candidatePreference: string;
    score: number; // 0..100
    status: 'ALIGNED' | 'BALANCED' | 'DIVERGENT';
    statusText: string;
    insightComment: string;
  }>;
  strengthsInRole: string[];
  potentialFrictionOrStress: string[];
  behavioralInterviewProbes: string[];
  managerOnboardingTips: string[];
}

