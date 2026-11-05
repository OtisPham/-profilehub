/**
 * Type definitions for Smart CV Parser & Master Profile Auto-Populate Engine
 * File: src/types/cvParser.types.ts
 */

export interface ParsedPersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  targetRole?: string;
  bio?: string;
}

export interface ParsedEducation {
  university?: string;
  major?: string;
  gpa?: string;
  graduationYear?: string;
}

export interface ParsedProject {
  title: string;
  role?: string;
  description?: string;
  tags?: string[];
  github_url?: string;
  demo_url?: string;
}

export interface ParsedCertificate {
  title: string;
  issuer?: string;
  year?: string;
}

export interface ParsedCvData {
  personalInfo: ParsedPersonalInfo;
  education: ParsedEducation;
  skills: string[];
  projects: ParsedProject[];
  certificates: ParsedCertificate[];
  rawTextLength: number;
  confidenceScore: number; // 0 - 100%
}

export interface ProfileAutoPopulateOptions {
  mode: 'overwrite' | 'merge'; // 'overwrite': Ghi đè toàn bộ, 'merge': Chỉ điền vào ô trống
  includeProjects: boolean;
  includeCertificates: boolean;
}

export interface ProfilePopulateResult {
  success: boolean;
  updatedProfileFields: string[];
  createdProjectsCount: number;
  createdCertificatesCount: number;
  message: string;
}
