import crypto from 'crypto';

export interface VerificationData {
  verificationCode: string;
  verificationHash: string;
  verifiedAt: string;
  teacherId: string;
  teacherName: string;
  score: number;
  feedback: string;
}

export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PH-VER-${result}`;
}

export function calculateVerificationHash(payload: {
  projectId: string;
  studentId: string;
  teacherId: string;
  score: number;
  verifiedAt: string;
}): string {
  const message = `${payload.projectId}:${payload.studentId}:${payload.teacherId}:${payload.score}:${payload.verifiedAt}`;
  return crypto.createHash('sha256').update(message).digest('hex');
}

export async function createVerificationRecord(params: {
  projectId: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  score: number;
  feedback: string;
}): Promise<VerificationData> {
  const verifiedAt = new Date().toISOString();
  const verificationCode = generateVerificationCode();
  const verificationHash = calculateVerificationHash({
    projectId: params.projectId,
    studentId: params.studentId,
    teacherId: params.teacherId,
    score: params.score,
    verifiedAt,
  });

  return {
    verificationCode,
    verificationHash,
    verifiedAt,
    teacherId: params.teacherId,
    teacherName: params.teacherName,
    score: params.score,
    feedback: params.feedback,
  };
}
