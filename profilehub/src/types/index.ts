// =====================================================================
// ProfileHub Core Domain & Discovery Types
// =====================================================================

export const ENTITY_TYPES = ["experience", "achievement", "project", "activity", "education"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const MESSAGE_CATEGORIES = [
  "answer", "dump", "short_or_vague", "correction", "topic_switch", "counter_question",
  "low_confidence", "fabrication_request", "sensitive_info", "wants_to_stop",
  "overwhelmed", "off_topic", "gibberish",
] as const;
export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];

export const FACT_INTENTS = ["add", "correct"] as const;
export type FactIntent = (typeof FACT_INTENTS)[number];

export const FACT_ORIGINS = ["user_stated", "ai_inferred"] as const;
export type FactOrigin = (typeof FACT_ORIGINS)[number];

export const CONFIDENCES = ["low", "medium", "high"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

export const COMMIT_POLICIES = ["auto", "confirm", "suggest_only"] as const;
export type CommitPolicy = (typeof COMMIT_POLICIES)[number];

export interface SuggestedFact {
  temp_id: string;
  intent: FactIntent;
  entity_type: EntityType;
  target_id: string | null;
  parent_id: string | null;
  data: Record<string, any>;
  evidence_quote: string;
  origin: FactOrigin;
  estimated: boolean;
  confidence: Confidence;
}

export interface ResolvedRef {
  kind: "pending" | "committed";
  entity_type: EntityType;
  id: string;
}

export interface KnownEntity extends ResolvedRef {
  label: string;
}

export interface PublicPendingFact {
  id: string;
  temp_id: string;
  intent: FactIntent;
  entity_type: EntityType;
  target_ref: ResolvedRef | null;
  parent_ref: ResolvedRef | null;
  data: Record<string, any>;
  evidence_quote: string;
  origin: FactOrigin;
  estimated: boolean;
  confidence: Confidence;
  commit_policy: CommitPolicy;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  categories?: MessageCategory[];
  facts?: PublicPendingFact[];
  isPending?: boolean;
}

export interface CareerDNA {
  employabilityScore: number;
  careerStrength: number;
  marketPosition: string;
  topStrengths: string[];
  skillsDiscovered: string[];
  recommendedRoles: string[];
  discoveryProgress: number; // 0 - 100
}

export interface CareerProfile {
  id: string;
  userId: string;
  fullName: string;
  targetRole: string;
  careerLevel: 'student' | 'fresher' | 'junior' | 'middle' | 'senior' | 'lead';
  dna: CareerDNA;
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    techStack: string[];
    role: string;
    description: string;
  }>;
  skills: string[];
  updatedAt: string;
}
