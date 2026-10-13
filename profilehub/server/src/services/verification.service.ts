import { supabase } from '../config/supabase.js';
import { generateVerificationCode, calculateVerificationHash, createVerificationRecord } from '../utils/verificationCrypto.js';

export interface PublicVerificationRecord {
  verification_code: string;
  verification_hash: string;
  verified_at: string;
  project: {
    id: string;
    title: string;
    description?: string;
    project_type?: string;
    demo_url?: string;
    github_url?: string;
    figma_url?: string;
    doc_url?: string;
    tags?: string[];
    thumbnail_url?: string;
    teacher_feedback?: string;
    score?: string;
  };
  student: {
    full_name: string;
    university: string;
    major: string;
    avatar_url?: string;
  };
  teacher: {
    full_name: string;
    email: string;
    bio?: string;
  };
}

export const verificationService = {
  async getTeacherInbox(teacherId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, student_profiles!student_id(full_name, university, major, avatar_url)')
      .or(`verified_by.eq.${teacherId},verification_status.eq.pending`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async approveProject(projectId: string, teacherId: string, teacherName: string, score: number, feedback: string) {
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('student_id')
      .eq('id', projectId)
      .single();

    if (projError || !project) throw new Error('Project not found');

    const meta = await createVerificationRecord({
      projectId,
      studentId: project.student_id,
      teacherId,
      teacherName,
      score,
      feedback,
    });

    const { data, error } = await supabase
      .from('projects')
      .update({
        is_verified: true,
        verification_status: 'verified',
        verified_by: teacherId,
        instructor: teacherName,
        score: score.toString(),
        teacher_feedback: feedback,
        verified_at: meta.verifiedAt,
        verification_code: meta.verificationCode,
        verification_hash: meta.verificationHash,
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rejectProject(projectId: string, teacherId: string, feedback: string) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        is_verified: false,
        verification_status: 'rejected',
        verified_by: teacherId,
        teacher_feedback: feedback,
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPublicVerificationRecord(verificationCode: string): Promise<PublicVerificationRecord | null> {
    if (!verificationCode || verificationCode.trim() === '') return null;

    const codeClean = verificationCode.trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(codeClean);

    let query = supabase.from('projects').select('*');
    if (isUuid) {
      query = query.or(`verification_code.eq.${codeClean},id.eq.${codeClean}`);
    } else {
      query = query.eq('verification_code', codeClean);
    }

    const { data: project, error: projError } = await query.maybeSingle();

    if (projError || !project) return null;

    const isVerified = project.verification_status === 'verified' || project.is_verified === true;
    if (!isVerified) return null;

    const [{ data: studentProfile }, { data: studentUser }] = await Promise.all([
      supabase.from('student_profiles').select('full_name, university, major, avatar_url').eq('id', project.student_id).maybeSingle(),
      supabase.from('users').select('full_name, email, avatar_url').eq('id', project.student_id).maybeSingle(),
    ]);

    let teacherUser: { full_name?: string; email?: string; bio?: string } | null = null;
    if (project.verified_by) {
      const { data: teacherData } = await supabase
        .from('users')
        .select('full_name, email, bio')
        .eq('id', project.verified_by)
        .maybeSingle();
      teacherUser = teacherData;
    }

    const studentName = studentProfile?.full_name || studentUser?.full_name || 'Sinh viên ProfileHub';
    const university = studentProfile?.university || 'Đại học';
    const major = studentProfile?.major || 'Công nghệ thông tin';

    const teacherName = teacherUser?.full_name || project.instructor || 'Giảng viên Hướng dẫn';
    const teacherEmail = teacherUser?.email || 'teacher@profilehub.edu.vn';

    const verCode = project.verification_code || codeClean;
    const verifiedAt = project.verified_at || project.created_at || new Date().toISOString();
    const verHash = project.verification_hash || calculateVerificationHash({
      projectId: project.id,
      studentId: project.student_id,
      teacherId: project.verified_by || 'teacher',
      score: project.score || 0,
      verifiedAt,
    });

    return {
      verification_code: verCode,
      verification_hash: verHash,
      verified_at: verifiedAt,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        project_type: project.project_type,
        demo_url: project.demo_url,
        github_url: project.github_url,
        figma_url: project.figma_url,
        doc_url: project.doc_url,
        tags: project.tags,
        thumbnail_url: project.thumbnail_url || project.image_url,
        teacher_feedback: project.teacher_feedback,
        score: project.score,
      },
      student: {
        full_name: studentName,
        university,
        major,
        avatar_url: studentProfile?.avatar_url || studentUser?.avatar_url,
      },
      teacher: {
        full_name: teacherName,
        email: teacherEmail,
        bio: teacherUser?.bio,
      },
    };
  },
};
