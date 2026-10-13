import crypto from 'crypto';
import type {
  AiCandidateProfile,
  AiJobDescriptionInput,
  AiMatchResult,
  AiEvidenceLevel,
  AiProjectEvidenceDetail,
  AiGapItem,
  AuditMetadataV61,
  RulebookV61ScoreBreakdown,
  RulebookBreakdown,
  RulebookGapAnalysis,
  RulebookCriticalGap,
  CandidateLevel,
  GateCheckResult,
  FrameworkVariables,
} from '../types/aiMatching.types.js';
import { llm, MODELS } from './llm.service.js';

/* ─────────────────────────────────────────────────────────────────────────────
 * 🚀 AI CV-JD MATCHING FRAMEWORK v2.0 (Skill-Gated Matching Model)
 * Framework 5 Bước:
 * STEP 1: GATE CHECK (Must-Have, Certifications, Language, Min YOE, Domain Mismatch)
 * STEP 2: CRITICAL SKILL SCORE - CSS (Matched Critical / Total Critical & Modifier)
 * STEP 3: CORE VARIABLES (SMS, ERS, IS, CS, GPS, CMS, LS: 0-100 pts)
 * STEP 4: RAW SCORE (Level-dependent weight distributions)
 * STEP 5: FINAL SCORE (Raw Score × Skill Modifier)
 * ────────────────────────────────────────────────────────────────────────────*/

// 4. Ontology Graph DB (Semantic Graph Mappings)
const ONTOLOGY_GRAPH_DB: Record<string, string[]> = {
  'react': ['reactjs', 'react.js', 'nextjs', 'next.js', 'react native', 'jsx', 'tsx'],
  'vue': ['vuejs', 'vue.js', 'nuxt', 'nuxtjs'],
  'angular': ['angularjs', 'angular 2+'],
  'node.js': ['node', 'nodejs', 'express', 'express.js', 'nestjs', 'fastify'],
  'typescript': ['ts'],
  'javascript': ['js', 'es6', 'ecmascript'],
  'python': ['django', 'fastapi', 'flask', 'pytorch', 'tensorflow'],
  'java': ['spring', 'spring boot', 'hibernate', 'jvm'],
  'c#': ['.net', '.net core', 'asp.net', 'csharp', 'entity framework'],
  'sql': ['postgresql', 'postgres', 'mysql', 'sql server', 'sqlite', 'oracle', 'mariadb'],
  'nosql': ['mongodb', 'redis', 'firebase', 'firestore', 'dynamodb', 'cassandra'],
  'docker': ['container', 'docker-compose', 'k8s', 'kubernetes'],
  'cloud': ['aws', 'gcp', 'azure', 'google cloud', 'amazon web services'],
  'ci/cd': ['github actions', 'gitlab ci', 'jenkins'],
  'tailwind': ['tailwindcss', 'tailwind css'],
  'testing': ['jest', 'unit test', 'cypress', 'mocha', 'vitest', 'playwright'],
  'kế toán': ['misa', 'báo cáo tài chính', 'thuế', 'hóa đơn', 'công nợ', 'kiểm toán'],
  'marketing': ['seo', 'sem', 'content', 'google ads', 'facebook ads', 'social media', 'crm'],
};

interface BackendSourceItem {
  sourceId: string;
  sourceType: 'EXPERIENCE' | 'PROJECT' | 'CERTIFICATION' | 'SKILL_SECTION';
  rawText: string;
  title: string;
  isVerified?: boolean;
  startDate?: string;
  endDate?: string;
}

interface AICitation {
  sourceId: string;
  skill: string;
  spanStart: number;
  spanEnd: number;
  quote?: string;
  sourceType?: BackendSourceItem['sourceType'];
  semanticScore?: number;
}

interface Interval {
  start: number; // timestamp in months
  end: number;
}

export class AiMatchingService {
  /**
   * THE CV-JD MATCHING PIPELINE (Theo CV-JD Matching Framework v1.0)
   */
  public async evaluateCompatibility(
    candidate: AiCandidateProfile,
    job: AiJobDescriptionInput
  ): Promise<AiMatchResult> {
    const activeModel = MODELS.extract();
    console.log(`🤖 [AI Matching Server] Đang đánh giá tương thích giữa JD và CV bằng AI Model: "${activeModel}" (CV-JD Matching Framework v2.0)`);
    // [1] CV / JD Normalization & Source Map
    const { sourceMap, normalizedCvText, normalizedJdText, dedupedSkills } = this.step1_normalize(candidate, job);

    // [2] AI Extraction
    let rawAiCitations: AICitation[] = [];
    let needsHumanReview = false;

    try {
      const extraction = await this.step2_aiExtraction(candidate, job, sourceMap);
      rawAiCitations = extraction.citations;
      needsHumanReview = extraction.needsHumanReview;
    } catch {
      // Fallback deterministic extractor khi offline
      rawAiCitations = this.step2_fallbackExtraction(dedupedSkills, job, sourceMap);
    }

    // [3] Payload Validation & [4] Citation Engine (validate_span, min 2 tokens)
    const validCitations = this.step4_validateCitations(rawAiCitations, sourceMap);

    // [5] Ontology Resolver (DB Override Policy)
    const { resolvedSkills, hasUnknown } = this.step5_resolveOntology(validCitations, job);
    if (hasUnknown) needsHumanReview = true;

    // [6] Evidence Engine
    const evidenceScores = this.step6_calculateEvidence(validCitations);

    // [7] Requirement Engine & Coverage
    const reqResult = this.step7_evaluateRequirements(resolvedSkills, evidenceScores, job);

    // [8] YOE Engine
    const yoeFit = this.step8_calculateYOE(candidate, job, validCitations);

    // ─────────────────────────────────────────────────────────────────────────────
    // FRAMEWORK v1.0 IMPLEMENTATION
    // ─────────────────────────────────────────────────────────────────────────────

    // STEP 1: GATE CHECK
    const gateCheck = this.performGateCheck(candidate, job, reqResult, yoeFit);

    // STEP 2: DETECT LEVEL
    const detectedLevel = this.detectCandidateLevel(candidate, job);

    // STEP 3: CORE VARIABLES (SMS, ERS, IS, CS, GPS, CMS, LS: 0-100)
    const frameworkVars = this.calculateFrameworkVariables(
      candidate,
      job,
      reqResult,
      validCitations,
      evidenceScores,
      detectedLevel
    );

    // STEP 4: FINAL FORMULA
    const { finalScore, formulaDescription } = this.calculateFinalFrameworkScore(
      gateCheck,
      detectedLevel,
      frameworkVars
    );
    frameworkVars.applied_formula = formulaDescription;

    // Score Breakdown for legacy compatibility
    const scoreBreakdown: RulebookV61ScoreBreakdown = {
      s_fit: frameworkVars.sms,
      r_fit: reqResult.r_fit,
      p_fit: reqResult.p_fit,
      coverage: reqResult.coverage,
      yoe_fit: frameworkVars.ers,
      core_alignment: frameworkVars.cs,
      raw_score: finalScore,
      final_score: finalScore,
      gates_triggered: gateCheck.passed ? [] : gateCheck.failedReasons,
    };

    // [11] Audit Metadata & [12] Final Output
    return this.step11_buildFinalOutput(
      scoreBreakdown,
      reqResult,
      candidate,
      job,
      sourceMap,
      normalizedCvText,
      normalizedJdText,
      needsHumanReview,
      frameworkVars,
      gateCheck
    );
  }

  /* ────────────────────────── Bước 1: Normalization & Spam Protection ────────────────────────── */

  private step1_normalize(candidate: AiCandidateProfile, job: AiJobDescriptionInput) {
    const sourceMap: Record<string, BackendSourceItem> = {};

    // 6. Skill Spam Protection: normalize & cap same_skill_max_count = 1
    const rawSkills = candidate.skills || [];
    const seenSkills = new Set<string>();
    const dedupedSkills: string[] = [];

    for (const s of rawSkills) {
      if (!s) continue;
      const normalized = s.trim().toUpperCase();
      if (!seenSkills.has(normalized)) {
        seenSkills.add(normalized);
        dedupedSkills.push(s.trim());
      }
    }

    sourceMap['src_skills'] = {
      sourceId: 'src_skills',
      sourceType: 'SKILL_SECTION',
      rawText: dedupedSkills.join(', '),
      title: 'Kỹ năng chuyên môn',
    };

    // 7. Project Clone Protection: hash detection
    const projectHashes = new Set<string>();
    (candidate.projects || []).forEach((p, idx) => {
      const pText = `${p.title}. ${p.description || ''} ${(p.technologies || []).join(' ')} ${(p.metrics || []).join(' ')}`.trim();
      const pHash = crypto.createHash('md5').update(pText.toLowerCase().replace(/\s+/g, '')).digest('hex');

      if (!projectHashes.has(pHash)) {
        projectHashes.add(pHash);
        const srcId = `src_proj_${p.id || idx}`;
        sourceMap[srcId] = {
          sourceId: srcId,
          sourceType: 'PROJECT',
          rawText: pText,
          title: p.title,
          isVerified: !!p.is_verified,
        };
      }
    });

    // Experiences
    (candidate.experiences || []).forEach((exp, idx) => {
      const srcId = `src_exp_${exp.id || idx}`;
      const text = `${exp.company} - ${exp.role}. ${exp.description || ''} ${(exp.technologies || []).join(' ')} ${(exp.metrics || []).join(' ')}`.trim();
      sourceMap[srcId] = {
        sourceId: srcId,
        sourceType: 'EXPERIENCE',
        rawText: text,
        title: `${exp.role} @ ${exp.company}`,
        startDate: exp.start_date,
        endDate: exp.end_date,
      };
    });

    // Certifications
    (candidate.certificates || []).forEach((c, idx) => {
      const srcId = `src_cert_${c.id || idx}`;
      const text = `${c.title} do ${c.issuer} cấp.`.trim();
      sourceMap[srcId] = {
        sourceId: srcId,
        sourceType: 'CERTIFICATION',
        rawText: text,
        title: c.title,
        isVerified: !!c.is_verified,
      };
    });

    const normalizedCvText = Object.values(sourceMap).map((s) => s.rawText).join('\n');
    const normalizedJdText = `${job.title || ''}\n${job.raw_jd_text || ''}`.trim();

    return { sourceMap, normalizedCvText, normalizedJdText, dedupedSkills };
  }

  /* ────────────────────────── Bước 2: AI Extraction ────────────────────────── */

  private async step2_aiExtraction(
    candidate: AiCandidateProfile,
    job: AiJobDescriptionInput,
    sourceMap: Record<string, BackendSourceItem>
  ): Promise<{ citations: AICitation[]; needsHumanReview: boolean }> {
    const sourcesSummary = Object.values(sourceMap)
      .map((s) => `[SourceID: ${s.sourceId}] (${s.sourceType}) Text: "${s.rawText}"`)
      .join('\n');

    const prompt = `Trích xuất tọa độ [spanStart, spanEnd] cho các kỹ năng của ứng viên đối chiếu với JD.
JD Requirements: ${(job.required_skills || []).join(', ')} | Preferred: ${(job.preferred_skills || []).join(', ')}

Candidate Sources:
${sourcesSummary}

Trả về DUY NHẤT đối tượng JSON:
{
  "citations": [
    {
      "sourceId": "src_proj_0",
      "skill": "React",
      "spanStart": 0,
      "spanEnd": 15,
      "semanticScore": 1.0
    }
  ],
  "needsHumanReview": false
}`;

    const res = await llm.complete({
      model: MODELS.extract(),
      system: 'Bạn là Data Extractor không trạng thái theo chuẩn Antigravity Rulebook V6.1. Chỉ trích xuất tọa độ span, không chấm điểm cuối cùng.',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 2048,
      temperature: 0.1,
    });

    let cleaned = res.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const parsed = JSON.parse(cleaned);
    return {
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
      needsHumanReview: !!parsed.needsHumanReview,
    };
  }

  private step2_fallbackExtraction(
    candidateSkills: string[],
    job: AiJobDescriptionInput,
    sourceMap: Record<string, BackendSourceItem>
  ): AICitation[] {
    const citations: AICitation[] = [];
    const targetSkills = Array.from(new Set([
      ...(job.required_skills || []),
      ...(job.preferred_skills || []),
      ...candidateSkills,
    ]));

    for (const [srcId, item] of Object.entries(sourceMap)) {
      const lower = item.rawText.toLowerCase();
      for (const skill of targetSkills) {
        if (!skill) continue;
        const skLower = skill.toLowerCase();
        let pos = 0;
        while ((pos = lower.indexOf(skLower, pos)) !== -1) {
          citations.push({
            sourceId: srcId,
            skill: skill,
            spanStart: pos,
            spanEnd: pos + skLower.length,
            semanticScore: 1.0,
          });
          pos += skLower.length;
        }
      }
    }
    return citations;
  }

  /* ────────────────────────── Bước 3 & 4: Citation Engine (rule.md 3) ────────────────────────── */

  private step4_validateCitations(
    rawCitations: AICitation[],
    sourceMap: Record<string, BackendSourceItem>
  ): AICitation[] {
    const valid: AICitation[] = [];

    for (const cit of rawCitations) {
      const source = sourceMap[cit.sourceId];
      if (!source || !source.rawText) continue;

      // 3. validate_span: 0 <= span_start and span_start < span_end and span_end <= text_length
      const textLen = source.rawText.length;
      if (!(0 <= cit.spanStart && cit.spanStart < cit.spanEnd && cit.spanEnd <= textLen)) {
        continue; // REJECT: Invalid Span
      }

      const extracted = source.rawText.substring(cit.spanStart, cit.spanEnd).trim();

      // Minimum Evidence Span: >= 2 tokens (hoặc >= 1 token kỹ năng hợp lệ > 2 ký tự)
      const tokenCount = extracted.split(/\s+/).filter(Boolean).length;
      if (tokenCount < 1 || extracted.length < 2) {
        continue; // REJECT: Too small span
      }

      valid.push({
        ...cit,
        quote: extracted,
        sourceType: source.sourceType,
      });
    }

    return valid;
  }

  /* ────────────────────────── Bước 5: Ontology Resolver (rule.md 4) ────────────────────────── */

  private step5_resolveOntology(
    validCitations: AICitation[],
    job: AiJobDescriptionInput
  ): { resolvedSkills: Map<string, { score: number; citations: AICitation[]; fromDb: boolean }>; hasUnknown: boolean } {
    const resolved = new Map<string, { score: number; citations: AICitation[]; fromDb: boolean }>();
    let hasUnknown = false;

    const allJdSkills = Array.from(new Set([...(job.required_skills || []), ...(job.preferred_skills || [])]));

    for (const jdSkill of allJdSkills) {
      const normJd = jdSkill.toLowerCase().trim();
      const synonyms = ONTOLOGY_GRAPH_DB[normJd] || [];
      const validTargetNames = [normJd, ...synonyms];

      const matchedCits: AICitation[] = [];
      let matchedInDb = false;
      let finalScore = 0;

      for (const cit of validCitations) {
        const citSkill = cit.skill.toLowerCase().trim();
        const citQuote = (cit.quote || '').toLowerCase().trim();

        if (validTargetNames.some((n) => citSkill === n || citQuote.includes(n))) {
          matchedCits.push(cit);
          matchedInDb = true;
          finalScore = 1.0; // Known mapping in DB = 1.0
        }
      }

      if (!matchedInDb && matchedCits.length === 0) {
        // Unknown mapping: Dùng AI score và bật needsHumanReview
        const semCit = validCitations.find((c) => (c.semanticScore || 0) >= 0.7);
        if (semCit) {
          matchedCits.push(semCit);
          finalScore = semCit.semanticScore || 0.8;
          hasUnknown = true;
        }
      }

      if (matchedCits.length > 0) {
        resolved.set(jdSkill, { score: finalScore, citations: matchedCits, fromDb: matchedInDb });
      }
    }

    return { resolvedSkills: resolved, hasUnknown };
  }

  /* ────────────────────────── Bước 6: Evidence Engine (rule.md 5) ────────────────────────── */

  private step6_calculateEvidence(validCitations: AICitation[]): Map<string, number> {
    // 5. Quantified Metric Regex: (\d+(\.\d+)?%)|(\b\d+x\b)|(\$\d+[KMB]?)|(\b\d+\susers\b)
    const metricPattern = /(\d+(\.\d+)?%)|(\b\d+x\b)|(\$\d+[KMB]?)|(\b\d+\s*(?:users|người dùng|sinh viên|requests|qps|ms|s)\b|\d+\/10)/i;
    const scores = new Map<string, number>();

    for (const cit of validCitations) {
      let baseScore = 0.5; // Skill Section default
      if (cit.sourceType === 'EXPERIENCE') {
        baseScore = 2.0;
      } else if (cit.sourceType === 'PROJECT') {
        let hasValidMetric = false;
        if (cit.quote) {
          const match = cit.quote.match(metricPattern);
          if (match) {
            // Plausibility validation: reject > 999999% or > 1000000000000 users
            const rawVal = parseFloat(match[0]);
            if (rawVal && rawVal < 100000000) {
              hasValidMetric = true;
            }
          }
        }
        baseScore = hasValidMetric ? 3.0 : 1.5;
      } else if (cit.sourceType === 'CERTIFICATION') {
        baseScore = 1.0;
      }

      // Deduplicate Source: score[sourceId] = max(score)
      const prev = scores.get(cit.skill) || 0;
      scores.set(cit.skill, Math.max(prev, baseScore));
    }

    return scores;
  }

  /* ────────────────────────── Bước 7 & 9: Requirement Engine & Coverage (rule.md 8 & 9) ────────────────────────── */

  private step7_evaluateRequirements(
    resolvedSkills: Map<string, { score: number; citations: AICitation[]; fromDb: boolean }>,
    evidenceScores: Map<string, number>,
    job: AiJobDescriptionInput
  ) {
    const reqSkills = job.required_skills || [];
    const prefSkills = job.preferred_skills || [];
    const criticalSkills = job.critical_skills || reqSkills.slice(0, 2);

    const matchedCore: string[] = [];
    const missingCore: string[] = [];
    const semanticScoresRequired: number[] = [];

    for (const req of reqSkills) {
      const entry = resolvedSkills.get(req);
      const ev = evidenceScores.get(req) || 0;
      if (entry && entry.score >= 0.7 && ev >= 0.5) {
        matchedCore.push(req);
        semanticScoresRequired.push(entry.score);
      } else {
        missingCore.push(req);
        semanticScoresRequired.push(0);
      }
    }

    const matchedSecondary: string[] = [];
    const missingSecondary: string[] = [];
    const semanticScoresPreferred: number[] = [];

    for (const pref of prefSkills) {
      const entry = resolvedSkills.get(pref);
      if (entry && entry.score >= 0.7) {
        matchedSecondary.push(pref);
        semanticScoresPreferred.push(entry.score);
      } else {
        missingSecondary.push(pref);
        semanticScoresPreferred.push(0);
      }
    }

    // 11. Skill Fit Math:
    // R_fit = (sum(required semantic scores) / total required skills) * 100
    const r_fit = reqSkills.length > 0
      ? (semanticScoresRequired.reduce((a, b) => a + b, 0) / reqSkills.length) * 100
      : 100;

    // P_fit = (sum(preferred semantic scores) / total preferred skills) * 100
    const p_fit = prefSkills.length > 0
      ? (semanticScoresPreferred.reduce((a, b) => a + b, 0) / prefSkills.length) * 100
      : 100;

    // S_fit: If preferred exists -> 0.8 * R_fit + 0.2 * P_fit; Else S_fit = R_fit
    const s_fit = prefSkills.length > 0
      ? 0.8 * r_fit + 0.2 * p_fit
      : r_fit;

    // 9. Logical Groups Coverage: PassedGroups / TotalGroups * 100
    const totalGroups = Math.max(1, reqSkills.length);
    const passedGroups = matchedCore.length;
    const coverage = (passedGroups / totalGroups) * 100;

    // Critical Passed Count
    const criticalPassed = criticalSkills.filter((cs) => matchedCore.includes(cs)).length;

    return {
      reqSkills,
      prefSkills,
      criticalSkills,
      matchedCore,
      missingCore,
      matchedSecondary,
      missingSecondary,
      r_fit,
      p_fit,
      s_fit,
      coverage,
      criticalPassed,
    };
  }

  /* ────────────────────────── Bước 8: YOE Engine (rule.md 10) ────────────────────────── */

  private step8_calculateYOE(
    candidate: AiCandidateProfile,
    job: AiJobDescriptionInput,
    validCitations: AICitation[]
  ): number {
    const requiredSkills = job.required_skills || [];
    const criticalSkills = job.critical_skills || requiredSkills.slice(0, 2);

    const intervals: Interval[] = [];

    // 10. Relevant Experience: Role matches ontology OR contains 1 Critical Skill OR 2 Required Skills
    (candidate.experiences || []).forEach((exp, idx) => {
      const expCits = validCitations.filter((c) => c.sourceId.includes(exp.id || String(idx)));
      const matchedSkills = expCits.map((c) => c.skill);

      const hasCritical = criticalSkills.some((cs) => matchedSkills.includes(cs));
      const has2Required = requiredSkills.filter((rs) => matchedSkills.includes(rs)).length >= 2;
      const roleMatches = (exp.technologies || []).some((t) => requiredSkills.includes(t));

      if (hasCritical || has2Required || roleMatches) {
        // Convert to months interval
        const start = exp.start_date ? new Date(exp.start_date).getTime() / (1000 * 60 * 60 * 24 * 30) : idx * 12;
        const end = exp.end_date ? new Date(exp.end_date).getTime() / (1000 * 60 * 60 * 24 * 30) : (idx + 1) * 12;
        intervals.push({ start, end });
      }
    });

    // Merge overlapping intervals
    const mergedMonths = this.mergeOverlappingIntervals(intervals);

    let totalRelevantYears = mergedMonths / 12;

    // Dự phòng cho fresher / đồ án sinh viên
    if (totalRelevantYears === 0 && candidate.projects && candidate.projects.length > 0) {
      const verifiedCount = candidate.projects.filter((p) => p.is_verified).length;
      totalRelevantYears = Math.min(1.5, (candidate.projects.length * 0.4) + (verifiedCount * 0.6));
    }

    const reqYears = job.min_years_experience || (job.level === 'mid' ? 3 : job.level === 'junior' ? 1.5 : 0.5);

    // YOE_fit = min(relevant_years / required_years, 1.0) * 100
    const yoe_fit = reqYears > 0
      ? Math.min(totalRelevantYears / reqYears, 1.0) * 100
      : 100;

    return yoe_fit;
  }

  private mergeOverlappingIntervals(intervals: Interval[]): number {
    if (intervals.length === 0) return 0;
    intervals.sort((a, b) => a.start - b.start);

    const merged: Interval[] = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const cur = intervals[i];
      if (cur.start <= last.end) {
        last.end = Math.max(last.end, cur.end);
      } else {
        merged.push(cur);
      }
    }

    return merged.reduce((sum, inv) => sum + Math.max(0, inv.end - inv.start), 0);
  }

  /* ────────────────────────── STEP 1: GATE CHECK ────────────────────────── */
  private performGateCheck(
    candidate: AiCandidateProfile,
    job: AiJobDescriptionInput,
    reqResult: ReturnType<typeof AiMatchingService.prototype.step7_evaluateRequirements>,
    yoeFit: number
  ): GateCheckResult {
    const failedReasons: string[] = [];
    const missingMustHaveSkills: string[] = [];
    const missingCertifications: string[] = [];
    const missingLanguages: string[] = [];
    let experienceGapYears: number | undefined = undefined;

    const fullCvText = `${candidate.target_role || ''} ${candidate.career_summary || ''} ${(candidate.skills || []).join(' ')} ${(candidate.projects || []).map(p => `${p.title} ${p.description || ''}`).join(' ')} ${(candidate.certificates || []).map(c => `${c.title} ${c.issuer}`).join(' ')}`.toLowerCase();
    const fullJdText = `${job.title || ''} ${job.raw_jd_text || ''}`.toLowerCase();

    // 1. Must-Have Skills Check
    let mustHaveSkillsPassed = true;
    const criticalSkills = job.critical_skills || [];
    if (criticalSkills.length > 0) {
      for (const cs of criticalSkills) {
        if (!reqResult.matchedCore.some(m => m.toLowerCase() === cs.toLowerCase())) {
          missingMustHaveSkills.push(cs);
        }
      }
      if (missingMustHaveSkills.length === criticalSkills.length && criticalSkills.length > 0) {
        mustHaveSkillsPassed = false;
        failedReasons.push(`Thiếu tất cả kỹ năng bắt buộc (Must-Have Skills): ${missingMustHaveSkills.join(', ')}`);
      }
    }

    // Domain mismatch is also a Must-Have Gate check failure
    const isDomainMismatched = this.checkDomainMismatch(candidate, job);
    if (isDomainMismatched) {
      mustHaveSkillsPassed = false;
      failedReasons.push('Lệch hoàn toàn lĩnh vực chuyên môn giữa ứng viên và JD (Domain Mismatch)');
    }

    // 2. Required Certifications Check
    let certificationsPassed = true;
    const certKeywords = ['aws certified', 'pmp', 'acca', 'cpa', 'cissp', 'cfa'];
    for (const cert of certKeywords) {
      if (fullJdText.includes(cert) && (fullJdText.includes('bắt buộc') || fullJdText.includes(`yêu cầu chứng chỉ`))) {
        if (!fullCvText.includes(cert)) {
          certificationsPassed = false;
          missingCertifications.push(cert.toUpperCase());
          failedReasons.push(`Thiếu chứng chỉ bắt buộc theo JD: ${cert.toUpperCase()}`);
        }
      }
    }

    // 3. Required Language Check
    let languagePassed = true;
    const langKeywords = [
      { pattern: 'tiếng nhật n2', label: 'Japanese N2' },
      { pattern: 'tiếng nhật n1', label: 'Japanese N1' },
      { pattern: 'ielts 7.', label: 'IELTS 7.0+' },
      { pattern: 'ielts 6.5', label: 'IELTS 6.5+' },
      { pattern: 'english b2', label: 'English B2' },
      { pattern: 'tiếng anh b2', label: 'English B2' },
    ];
    for (const lang of langKeywords) {
      if (fullJdText.includes(lang.pattern) && (fullJdText.includes('bắt buộc') || fullJdText.includes('yêu cầu'))) {
        if (!fullCvText.includes(lang.pattern)) {
          languagePassed = false;
          missingLanguages.push(lang.label);
          failedReasons.push(`Không đáp ứng yêu cầu ngoại ngữ bắt buộc: ${lang.label}`);
        }
      }
    }

    // 4. Minimum Experience Check
    let minExperiencePassed = true;
    if (job.min_years_experience && job.min_years_experience > 0) {
      const candidateYoe = candidate.years_of_experience ?? (
        candidate.experience_level === 'senior' ? 6 :
        candidate.experience_level === 'mid' ? 3.5 :
        candidate.experience_level === 'junior' ? 1.5 :
        candidate.experience_level === 'fresher' ? 0.5 : 0
      );
      if (candidateYoe < job.min_years_experience && (job.min_years_experience - candidateYoe >= 2)) {
        minExperiencePassed = false;
        experienceGapYears = job.min_years_experience - candidateYoe;
        failedReasons.push(`Kinh nghiệm tối thiểu không đạt: Yêu cầu ${job.min_years_experience} năm, ứng viên có ~${candidateYoe} năm`);
      }
    }

    // 5. Work Authorization Check
    const workAuthorizationPassed = true;

    const passed = mustHaveSkillsPassed && certificationsPassed && languagePassed && minExperiencePassed && workAuthorizationPassed;

    return {
      passed,
      status: passed ? 'Pass' : 'Reject',
      failedReasons,
      mustHaveSkillsPassed,
      certificationsPassed,
      languagePassed,
      minExperiencePassed,
      workAuthorizationPassed,
      details: {
        missingMustHaveSkills,
        missingCertifications,
        missingLanguages,
        experienceGapYears,
      },
    };
  }

  /* ────────────────────────── STEP 2: DETECT LEVEL ────────────────────────── */
  private detectCandidateLevel(candidate: AiCandidateProfile, job: AiJobDescriptionInput): CandidateLevel {
    const fullText = `${candidate.target_role || ''} ${candidate.career_summary || ''} ${(candidate.projects || []).map(p => `${p.title} ${p.role || ''}`).join(' ')}`.toLowerCase();

    // Check for leadership responsibility
    const isLeadOrManager = ['team lead', 'tech lead', 'engineering manager', 'quản lý', 'trưởng nhóm', 'project manager', 'scrum master', 'lead developer', 'head of'].some(k => fullText.includes(k));
    if (isLeadOrManager && (candidate.experience_level === 'mid' || candidate.experience_level === 'senior' || (candidate.years_of_experience || 0) >= 4)) {
      return 'lead';
    }

    if (candidate.experience_level) {
      if (candidate.experience_level === 'senior') return 'senior';
      if (candidate.experience_level === 'mid') return 'mid';
      if (candidate.experience_level === 'junior') return 'junior';
      if (candidate.experience_level === 'fresher') return 'fresher';
      if (candidate.experience_level === 'intern') return 'intern';
    }

    const yoe = candidate.years_of_experience ?? 0;
    if (yoe === 0 && (candidate.projects || []).length <= 2) return 'intern';
    if (yoe < 1) return 'fresher';
    if (yoe < 3) return 'junior';
    if (yoe < 6) return 'mid';
    return 'senior';
  }

  /* ────────────────────────── STEP 2 & 3: CRITICAL SKILL SCORE (CSS) & CORE VARIABLES ────────────────────────── */
  private calculateFrameworkVariables(
    candidate: AiCandidateProfile,
    job: AiJobDescriptionInput,
    reqResult: ReturnType<typeof AiMatchingService.prototype.step7_evaluateRequirements>,
    validCitations: AICitation[],
    evidenceScores: Map<string, number>,
    detectedLevel: CandidateLevel
  ): FrameworkVariables {
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: CRITICAL SKILL SCORE (CSS)
    // CSS = (Số Critical Skills Khớp ÷ Tổng Critical Skills) × 100
    // ─────────────────────────────────────────────────────────────────────────
    const criticalSkills = (job.critical_skills && job.critical_skills.length > 0)
      ? job.critical_skills
      : (job.required_skills && job.required_skills.length > 0)
        ? job.required_skills.slice(0, 5)
        : [];

    let matchedCriticalCount = 0;
    if (criticalSkills.length > 0) {
      for (const cs of criticalSkills) {
        const csLower = cs.toLowerCase();
        const isMatched = reqResult.matchedCore.some(m => m.toLowerCase() === csLower) ||
          (candidate.skills || []).some(s => s.toLowerCase() === csLower || (ONTOLOGY_GRAPH_DB[csLower] && ONTOLOGY_GRAPH_DB[csLower].includes(s.toLowerCase()))) ||
          (candidate.projects || []).some(p => `${p.title} ${p.description || ''} ${(p.technologies || []).join(' ')}`.toLowerCase().includes(csLower));
        if (isMatched) {
          matchedCriticalCount++;
        }
      }
    } else {
      matchedCriticalCount = reqResult.matchedCore.length;
    }

    const totalCritical = criticalSkills.length > 0 ? criticalSkills.length : Math.max(1, reqResult.reqSkills.length);
    const css = Math.min(100, Math.round((matchedCriticalCount / totalCritical) * 100));

    // CSS Threshold & Skill Modifier:
    // Dưới 20%: Reject (Modifier = 0.00)
    // 20% - 39%: Critical Gap (Modifier = 0.30)
    // 40% - 59%: Partial Match (Modifier = 0.60)
    // 60% - 79%: Strong Match (Modifier = 0.85)
    // Trên 80%: Excellent Match (Modifier = 1.00)
    let cssStatus: 'Reject' | 'Critical Gap' | 'Partial Match' | 'Strong Match' | 'Excellent Match' = 'Reject';
    let skillModifier = 0.0;

    if (css < 20) {
      cssStatus = 'Reject';
      skillModifier = 0.0;
    } else if (css < 40) {
      cssStatus = 'Critical Gap';
      skillModifier = 0.30;
    } else if (css < 60) {
      cssStatus = 'Partial Match';
      skillModifier = 0.60;
    } else if (css < 80) {
      cssStatus = 'Strong Match';
      skillModifier = 0.85;
    } else {
      cssStatus = 'Excellent Match';
      skillModifier = 1.00;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: CORE VARIABLES (0 - 100)
    // ─────────────────────────────────────────────────────────────────────────

    // 1. SKILL MATCH SCORE (SMS) = (Matched Skills / Total Required Skills) * 100
    const totalReq = Math.max(1, reqResult.reqSkills.length);
    const sms = Math.min(100, Math.round((reqResult.matchedCore.length / totalReq) * 100));

    // 2. EXPERIENCE RELEVANCE SCORE (ERS) = (Industry Match × 40%) + (Role Match × 40%) + (Domain Match × 20%)
    const isDomainMismatched = this.checkDomainMismatch(candidate, job);
    const industryMatch = isDomainMismatched ? 0 : 90;
    
    // Role Match
    const targetRole = (candidate.target_role || '').toLowerCase();
    const jdTitle = (job.title || '').toLowerCase();
    let roleMatch = 50;
    if (targetRole && jdTitle) {
      if (targetRole === jdTitle || targetRole.includes(jdTitle) || jdTitle.includes(targetRole)) {
        roleMatch = 100;
      } else if (['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'tester'].some(k => targetRole.includes(k) && jdTitle.includes(k))) {
        roleMatch = 90;
      }
    } else if (sms > 50) {
      roleMatch = 80;
    }

    const domainMatch = isDomainMismatched ? 0 : 85;
    const ers = isDomainMismatched ? 0 : Math.round((industryMatch * 0.40) + (roleMatch * 0.40) + (domainMatch * 0.20));

    // 3. IMPACT SCORE (IS)
    // Dạng impact: Revenue Increase, Cost Reduction, Efficiency Improvement, Automation, Process Optimization
    const allMetrics: string[] = [
      ...(candidate.projects || []).flatMap(p => p.metrics || []),
      ...(candidate.experiences || []).flatMap(e => e.metrics || []),
    ];
    
    const textCorpus = (candidate.projects || []).map(p => `${p.description || ''}`).join(' ');
    const hasPercentages = /([0-9]{1,3}%)/.test(textCorpus) || allMetrics.some(m => m.includes('%'));
    const hasScaleNumbers = /([0-9]+(\+)?\s*(users|người dùng|sinh viên|requests|khách hàng|orders))/i.test(textCorpus);
    const hasTimeOrCostSaving = /(tiết kiệm|giảm|tăng|tối ưu|cắt giảm|doanh thu|time saving|revenue|cost)/i.test(textCorpus);

    let isScore = 25; // Base for weak claim
    if (allMetrics.length >= 2 || (hasPercentages && (hasScaleNumbers || hasTimeOrCostSaving))) {
      isScore = 90;
    } else if (allMetrics.length === 1 || hasPercentages || hasScaleNumbers) {
      isScore = 70;
    } else if (hasTimeOrCostSaving) {
      isScore = 50;
    }

    // 4. CREDIBILITY SCORE (CS)
    // Level 1: Claim Only (20)
    // Level 2: Claim + Context (40)
    // Level 3: Claim + Scale (60)
    // Level 4: Claim + Metrics (80)
    // Level 5: Verified Evidence (95-100)
    let csLevel: 1 | 2 | 3 | 4 | 5 = 1;
    let cs = 20;

    const hasVerifiedProjects = (candidate.projects || []).some(p => p.is_verified);
    const hasLiveLinks = (candidate.projects || []).some(p => p.github_url || p.demo_url);
    const hasContext = (candidate.projects || []).some(p => (p.description || '').length > 30);
    const hasScale = hasScaleNumbers || (candidate.projects || []).some(p => (p.description || '').length > 60);

    if (hasVerifiedProjects || (hasLiveLinks && hasPercentages)) {
      csLevel = 5;
      cs = hasVerifiedProjects ? 98 : 95;
    } else if (hasPercentages && hasScale) {
      csLevel = 4;
      cs = 80;
    } else if (hasScale) {
      csLevel = 3;
      cs = 60;
    } else if (hasContext) {
      csLevel = 2;
      cs = 40;
    } else {
      csLevel = 1;
      cs = 20;
    }

    // 5. GROWTH POTENTIAL SCORE (GPS)
    // Tiềm năng phát triển: Self Learning, Projects, Certifications, Career Progression
    let gps = 50;
    const certCount = (candidate.certificates || []).length;
    const projectCount = (candidate.projects || []).length;
    gps += Math.min(25, certCount * 12);
    gps += Math.min(25, projectCount * 8);
    if (textCorpus.toLowerCase().includes('hackathon') || textCorpus.toLowerCase().includes('nghiên cứu') || textCorpus.toLowerCase().includes('contest') || textCorpus.toLowerCase().includes('giải')) {
      gps += 10;
    }
    gps = Math.min(100, gps);

    // 6. COMPLEXITY SCORE (CMS)
    // Độ khó công việc đã thực hiện: Scale, Stakeholders, Technical & Business Complexity
    let cms = 40;
    const highComplexityKeywords = ['microservices', 'distributed', 'high concurrency', 'kubernetes', 'k8s', 'kafka', 'ci/cd', 'multi-tenant', 'global', '5+ quốc gia', '20+ stakeholders', 'tối ưu hoá'];
    const medComplexityKeywords = ['state management', 'redux', 'zustand', 'docker', 'postgresql', 'redis', 'rest api', 'graphql', 'auth', 'jwt'];
    
    const highMatches = highComplexityKeywords.filter(k => textCorpus.toLowerCase().includes(k) || (candidate.skills || []).some(s => s.toLowerCase().includes(k)));
    const medMatches = medComplexityKeywords.filter(k => textCorpus.toLowerCase().includes(k) || (candidate.skills || []).some(s => s.toLowerCase().includes(k)));

    if (highMatches.length >= 2 || (detectedLevel === 'senior' && medMatches.length >= 3)) {
      cms = 85;
    } else if (medMatches.length >= 2 || highMatches.length === 1) {
      cms = 65;
    } else {
      cms = 30;
    }

    // 7. LEADERSHIP SCORE (LS)
    let ls: number | undefined = undefined;
    if (detectedLevel === 'lead') {
      let leadPts = 40;
      if (textCorpus.includes('team size') || textCorpus.includes('quản lý') || textCorpus.includes('mentoring')) leadPts += 25;
      if (textCorpus.includes('hiring') || textCorpus.includes('tuyển dụng')) leadPts += 15;
      if (textCorpus.includes('ownership') || textCorpus.includes('chiến lược')) leadPts += 20;
      ls = Math.min(100, leadPts);
    }

    return {
      css,
      css_status: cssStatus,
      skill_modifier: skillModifier,
      raw_score: 0, // Will be computed in Step 4
      sms,
      ers,
      ers_breakdown: {
        industry_match: industryMatch,
        role_match: roleMatch,
        domain_match: domainMatch,
      },
      is: isScore,
      cs,
      cs_level: csLevel,
      gps,
      cms,
      ls,
      detected_level: detectedLevel,
      applied_formula: '',
    };
  }

  /* ────────────────────────── STEP 4 & 5: RAW SCORE & SKILL MODIFIER ────────────────────────── */
  private calculateFinalFrameworkScore(
    gateCheck: GateCheckResult,
    level: CandidateLevel,
    vars: FrameworkVariables
  ): { finalScore: number; rawScore: number; formulaDescription: string } {
    // Step 1: Gate Check Failure
    if (!gateCheck.passed) {
      return {
        finalScore: 0,
        rawScore: 0,
        formulaDescription: `Gate Check FAILED (${gateCheck.failedReasons.join('; ')}) ➔ Final Score = 0 (Status = Reject)`,
      };
    }

    // Step 4: Calculate Raw Score by Detected Level
    let rawScore = 0;
    let rawDesc = '';

    switch (level) {
      case 'intern':
      case 'fresher':
        // Fresher: (SMS × 0.30) + (GPS × 0.30) + (CS × 0.20) + (ERS × 0.10) + (IS × 0.10)
        rawScore = (vars.sms * 0.30) + (vars.gps * 0.30) + (vars.cs * 0.20) + (vars.ers * 0.10) + (vars.is * 0.10);
        rawDesc = `Fresher Raw: (${vars.sms}×0.3 + ${vars.gps}×0.3 + ${vars.cs}×0.2 + ${vars.ers}×0.1 + ${vars.is}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;

      case 'junior':
        // Junior: (SMS × 0.30) + (ERS × 0.25) + (IS × 0.20) + (CS × 0.15) + (GPS × 0.10)
        rawScore = (vars.sms * 0.30) + (vars.ers * 0.25) + (vars.is * 0.20) + (vars.cs * 0.15) + (vars.gps * 0.10);
        rawDesc = `Junior Raw: (${vars.sms}×0.3 + ${vars.ers}×0.25 + ${vars.is}×0.2 + ${vars.cs}×0.15 + ${vars.gps}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;

      case 'mid':
        // Mid: (SMS × 0.25) + (ERS × 0.25) + (IS × 0.25) + (CS × 0.15) + (CMS × 0.10)
        rawScore = (vars.sms * 0.25) + (vars.ers * 0.25) + (vars.is * 0.25) + (vars.cs * 0.15) + (vars.cms * 0.10);
        rawDesc = `Mid-Level Raw: (${vars.sms}×0.25 + ${vars.ers}×0.25 + ${vars.is}×0.25 + ${vars.cs}×0.15 + ${vars.cms}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;

      case 'senior':
        // Senior: (ERS × 0.30) + (IS × 0.30) + (CMS × 0.20) + (CS × 0.10) + (SMS × 0.10)
        rawScore = (vars.ers * 0.30) + (vars.is * 0.30) + (vars.cms * 0.20) + (vars.cs * 0.10) + (vars.sms * 0.10);
        rawDesc = `Senior Raw: (${vars.ers}×0.3 + ${vars.is}×0.3 + ${vars.cms}×0.2 + ${vars.cs}×0.1 + ${vars.sms}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;

      case 'lead':
        const ls = vars.ls ?? 70;
        rawScore = (vars.is * 0.30) + (ls * 0.25) + (vars.ers * 0.20) + (vars.cms * 0.15) + (vars.cs * 0.10);
        rawDesc = `Lead/Manager Raw: (${vars.is}×0.3 + ${ls}×0.25 + ${vars.ers}×0.2 + ${vars.cms}×0.15 + ${vars.cs}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;
    }

    rawScore = Math.round(rawScore * 10) / 10;
    vars.raw_score = rawScore;

    // Step 5: Skill Modifier & Final Formula
    // Final Score = Raw Score × Modifier
    if (vars.css < 20) {
      return {
        finalScore: 0,
        rawScore,
        formulaDescription: `${rawDesc} ➔ CSS (${vars.css}%) < 20% ➔ Modifier = 0 ➔ Final Score = 0 (Status = Reject)`,
      };
    }

    const finalScore = Math.min(100, Math.round(rawScore * vars.skill_modifier * 10) / 10);
    const formulaDescription = `${rawDesc} ➔ Final Score = ${rawScore} × ${vars.skill_modifier} (CSS: ${vars.css}% - ${vars.css_status}) = ${finalScore}`;

    return { finalScore, rawScore, formulaDescription };
  }

  /* ────────────────────────── Bước 11 & 12: Audit Metadata & Output ────────────────────────── */

  private step11_buildFinalOutput(
    scoreBreakdown: RulebookV61ScoreBreakdown,
    reqResult: ReturnType<typeof AiMatchingService.prototype.step7_evaluateRequirements>,
    candidate: AiCandidateProfile,
    job: AiJobDescriptionInput,
    sourceMap: Record<string, BackendSourceItem>,
    normalizedCvText: string,
    normalizedJdText: string,
    needsHumanReview: boolean,
    frameworkVars?: FrameworkVariables,
    gateCheck?: GateCheckResult
  ): AiMatchResult {
    const finalScore = scoreBreakdown.final_score;

    // Hashes
    const cvHash = crypto.createHash('sha256').update(normalizedCvText).digest('hex').slice(0, 16);
    const jdHash = crypto.createHash('sha256').update(normalizedJdText).digest('hex').slice(0, 16);

    const audit_metadata: AuditMetadataV61 = {
      version: '6.1',
      cvHash,
      jdHash,
      ontologyVersion: '2.4.1',
      rulebookVersion: '1.0',
      scoringVersion: '1.0.0',
      llmSnapshotId: 'gemini-3.5-flash-framework-v1',
      needsHumanReview,
    };

    // Trust Index
    const verifiedProjects = (candidate.projects || []).filter((p) => p.is_verified);
    const totalProjects = candidate.projects ? candidate.projects.length : 0;
    const trustTier = verifiedProjects.length >= 2 ? 'VERIFIED_ELITE' : verifiedProjects.length === 1 ? 'HIGH_TRUST' : 'UNVERIFIED';

    // Match Level according to Framework v2.0:
    // 90-100: Excellent Match; 80-89: Strong Match; 70-79: Qualified Match; 60-69: Potential Match; 40-59: Weak Match; <40: Poor Match
    let matchRating: AiMatchResult['match_rating'] = 'NEEDS_DEVELOPMENT';
    if (finalScore >= 85) matchRating = 'STANDOUT_MATCH';
    else if (finalScore >= 70) matchRating = 'STRONG_FIT';
    else if (finalScore >= 50) matchRating = 'POTENTIAL_FIT';

    let rulebookLevel: AiMatchResult['rulebook_level'] = 'Poor Match';
    if (gateCheck && !gateCheck.passed) {
      rulebookLevel = 'Reject';
    } else if (frameworkVars && frameworkVars.css < 20) {
      rulebookLevel = 'Reject';
    } else if (finalScore >= 90) {
      rulebookLevel = 'Excellent Match';
    } else if (finalScore >= 80) {
      rulebookLevel = 'Strong Match';
    } else if (finalScore >= 70) {
      rulebookLevel = 'Qualified Match';
    } else if (finalScore >= 60) {
      rulebookLevel = 'Potential Match';
    } else if (finalScore >= 40) {
      rulebookLevel = 'Weak Match';
    } else {
      rulebookLevel = 'Poor Match';
    }

    // Project Details
    const reqSkills = job.required_skills || [];
    const allCandidateProjects = candidate.projects || [];
    const projectDetails: AiProjectEvidenceDetail[] = allCandidateProjects.map((p) => {
      const pText = `${p.title} ${p.description || ''} ${(p.technologies || []).join(' ')}`.toLowerCase();
      const matched = reqSkills.filter((rs) => pText.includes(rs.toLowerCase()) || (p.technologies || []).some(t => t.toLowerCase() === rs.toLowerCase()));
      const isRelevant = finalScore > 0 && (matched.length > 0 || (reqSkills.length === 0 && (p.technologies || []).length > 0));

      return {
        id: p.id,
        title: p.title,
        evidence_level: p.is_verified ? 'institutional_verified' : (p.demo_url || p.github_url) ? 'live_artifact' : 'self_documented',
        evidence_weight: p.is_verified ? 3.0 : 1.5,
        matched_jd_requirements: matched,
        relevance_score: isRelevant ? (p.is_verified ? 95 : 60) : 0,
        has_metrics: (p.metrics && p.metrics.length > 0) || false,
        is_verified: !!p.is_verified,
        is_relevant: isRelevant,
      };
    });

    const relevantProjects = projectDetails.filter((p) => p.is_relevant);

    const gap_analysis: AiGapItem[] = reqResult.missingCore.map((m) => ({
      skill_or_topic: m,
      importance: 'CRITICAL',
      current_evidence_level: 'unverified_claim',
      gap_description: `Yêu cầu '${m}' chưa có minh chứng đạt chuẩn theo CV-JD Matching Framework v1.0.`,
      remediation_roadmap: {
        suggested_project_title: `Dự án thực chiến với ${m}`,
        project_objective: `Xây dựng module ứng dụng áp dụng ${m} có mã nguồn và chỉ số đo lường thực tế.`,
        recommended_tech_stack: [m, 'TypeScript'],
        target_metrics: 'Hoàn thành và đo lường kết quả thực tế trong 1-2 tuần.',
        estimated_effort_weeks: 1,
      },
    }));

    const cv_coaching_tips: string[] = [];
    if (gateCheck && !gateCheck.passed) {
      cv_coaching_tips.push(`🚨 Gate Check không đạt (${gateCheck.failedReasons.join('; ')}). Trạng thái: Reject (Điểm = 0).`);
    } else if (finalScore < 60) {
      cv_coaching_tips.push('⚠️ Điểm tương thích ở mức Weak Match (<60%). Cần bổ sung thêm dự án thực tế và kỹ năng còn thiếu.');
    } else {
      if (verifiedProjects.length === 0) {
        cv_coaching_tips.push('Đề xuất gửi đồ án cho Giảng viên / Mentor thẩm định để nhận Verified Badge (tối ưu hóa Credibility Score L5).');
      }
      if (gap_analysis.length > 0) {
        cv_coaching_tips.push(`Bổ sung minh chứng cho kỹ năng còn thiếu: ${gap_analysis.map((g) => g.skill_or_topic).join(', ')}.`);
      }
    }

    return {
      overall_score: finalScore,
      match_rating: matchRating,
      rulebook_level: rulebookLevel,
      v61_breakdown: scoreBreakdown,
      framework_variables: frameworkVars,
      gate_check: gateCheck,
      audit_metadata,
      rulebook_breakdown: {
        skills: Math.round(frameworkVars?.sms ?? scoreBreakdown.s_fit),
        experience: Math.round(frameworkVars?.ers ?? scoreBreakdown.yoe_fit),
        requirements: Math.round(scoreBreakdown.coverage),
        projects: Math.round(frameworkVars?.cs ?? scoreBreakdown.s_fit),
        keywords: Math.round(frameworkVars?.gps ?? scoreBreakdown.core_alignment),
        education: 85,
      },
      rulebook_gap_analysis: {
        matchedSkills: reqResult.matchedCore,
        missingSkills: reqResult.missingCore,
        criticalGaps: reqResult.missingCore.map((m) => ({
          requirement: `Thành thạo ${m}`,
          candidateValue: 'Chưa đủ minh chứng',
          severity: 'high',
        })),
      },
      trust_index: {
        verified_project_count: verifiedProjects.length,
        total_project_count: totalProjects,
        verification_ratio: totalProjects > 0 ? verifiedProjects.length / totalProjects : 0,
        trust_tier: trustTier,
        multiplier: verifiedProjects.length >= 2 ? 1.05 : 1.0,
      },
      pillars: {
        skill_fit: {
          score: Math.round(frameworkVars?.sms ?? scoreBreakdown.s_fit),
          r_fit: Math.round(scoreBreakdown.r_fit),
          p_fit: Math.round(scoreBreakdown.p_fit),
          matched_core: reqResult.matchedCore,
          missing_core: reqResult.missingCore,
          matched_secondary: reqResult.matchedSecondary,
          missing_secondary: reqResult.missingSecondary,
          semantic_matches: [],
        },
        evidence_depth: {
          score: Math.round(frameworkVars?.cs ?? (scoreBreakdown.s_fit * 0.9)),
          top_contributing_projects: relevantProjects.slice(0, 3),
          total_evidence_mass: verifiedProjects.length * 3.0 + totalProjects * 1.5,
          relevant_project_count: relevantProjects.length,
          verified_relevant_count: verifiedProjects.length,
          total_candidate_projects: allCandidateProjects.length,
        },
        impact_complexity: {
          score: Math.round(frameworkVars?.is ?? ((candidate.projects || []).some((p) => p.metrics && p.metrics.length > 0) ? 85 : 40)),
          detected_metrics_count: (candidate.projects || []).flatMap((p) => p.metrics || []).length,
          metric_examples: (candidate.projects || []).flatMap((p) => p.metrics || []).slice(0, 3),
          feedback: `Impact Score: ${frameworkVars?.is ?? 40}đ (Định lượng kết quả) | Complexity Score: ${frameworkVars?.cms ?? 40}đ (Độ phức tạp quy mô).`,
        },
        alignment_level: {
          score: Math.round(frameworkVars?.ers ?? (finalScore < 20 ? 0 : 85)),
          level_match: finalScore >= 60,
          target_role_match: (frameworkVars?.ers_breakdown.role_match ?? 0) >= 60,
          note: gateCheck && !gateCheck.passed ? `Gate Check Reject: ${gateCheck.failedReasons[0]}` : `Cấp độ: ${(frameworkVars?.detected_level || 'fresher').toUpperCase()} (${frameworkVars?.applied_formula || ''})`,
        },
      },
      gap_analysis,
      cv_coaching_tips,
      executive_summary: gateCheck && !gateCheck.passed
        ? `Hồ sơ bị từ chối tại Gate Check (0 điểm): ${gateCheck.failedReasons.join('; ')}.`
        : `Độ tương thích đạt ${finalScore}% (${rulebookLevel}) theo CV-JD Matching Framework v2.0 [Cấp độ: ${(frameworkVars?.detected_level || 'fresher').toUpperCase()}, CSS: ${frameworkVars?.css}% (Mod: x${frameworkVars?.skill_modifier}), SMS: ${frameworkVars?.sms}%, ERS: ${frameworkVars?.ers}%, IS: ${frameworkVars?.is}%, CS: ${frameworkVars?.cs}% (L${frameworkVars?.cs_level}), GPS: ${frameworkVars?.gps}%, CMS: ${frameworkVars?.cms}%].`,
    };
  }

  private checkDomainMismatch(candidate: AiCandidateProfile, job: AiJobDescriptionInput): boolean {
    const c = `${candidate.target_role || ''} ${(candidate.skills || []).join(' ')} ${(candidate.projects || []).map((p) => p.title).join(' ')}`.toLowerCase();
    const j = `${job.title || ''} ${job.raw_jd_text || ''}`.toLowerCase();

    const techSignals = ['react', 'node', 'frontend', 'backend', 'fullstack', 'developer', 'lập trình', 'typescript', 'python', 'java', 'golang', 'next.js'];
    const nonTechSignals = ['kế toán', 'kiểm toán', 'misa', 'thuế', 'báo cáo tài chính', 'telesales', 'marketing'];

    const cIsTech = techSignals.some((s) => c.includes(s));
    const cIsNonTech = nonTechSignals.some((s) => c.includes(s));

    const jIsTech = techSignals.some((s) => j.includes(s));
    const jIsNonTech = nonTechSignals.some((s) => j.includes(s));

    if (cIsTech && !cIsNonTech && jIsNonTech && !jIsTech) return true;
    if (cIsNonTech && !cIsTech && jIsTech && !jIsNonTech) return true;
    return false;
  }
}

export const aiMatchingService = new AiMatchingService();
export const jevMatchingService = aiMatchingService;

