import type { SocialPost, CreatePostParams, FeedFilter, PostComment } from '../types/database';
import { DEFAULT_SOCIAL_POSTS } from './socialSeedData';
import { addToSharedPipeline } from '../utils/pipelineSync';

const SOCIAL_STORAGE_KEY = 'profilehub_social_feed_store';

export const socialFeedService = {
  // Lấy danh sách toàn bộ bài viết từ Storage, nếu chưa có thì khởi tạo từ hạt giống
  getAllPosts(): SocialPost[] {
    try {
      const stored = localStorage.getItem(SOCIAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(DEFAULT_SOCIAL_POSTS));
        return DEFAULT_SOCIAL_POSTS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SOCIAL_POSTS;
    } catch (err) {
      console.error('Lỗi khi đọc Social Posts:', err);
      return DEFAULT_SOCIAL_POSTS;
    }
  },

  // Lưu danh sách bài viết và bắn event cập nhật
  saveAllPosts(posts: SocialPost[]): void {
    try {
      localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(posts));
      window.dispatchEvent(new CustomEvent('profilehub_social_feed_updated', { detail: { count: posts.length } }));
    } catch (err) {
      console.error('Lỗi khi lưu Social Posts:', err);
    }
  },

  // Lọc bài viết theo danh mục (Filter)
  getPosts(filter: FeedFilter = 'all'): SocialPost[] {
    const all = this.getAllPosts();
    if (filter === 'all') return all;
    if (filter === 'saved') return all.filter(p => p.is_saved);
    return all.filter(p => p.post_type === filter);
  },

  // Đăng bài viết mới
  createPost(params: CreatePostParams): SocialPost {
    const all = this.getAllPosts();
    const newPost: SocialPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author_id: params.authorId,
      author_name: params.authorName,
      author_avatar: params.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      author_role: params.authorRole,
      author_headline: params.authorHeadline || 'Thành Viên Cộng Đồng ProfileHub',
      is_author_verified: params.isAuthorVerified ?? false,
      post_type: params.postType,
      title: params.title.trim(),
      content: params.content.trim(),
      tags: params.tags || [],
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      is_saved: false,
      comments: [],
      job_salary_range: params.jobSalaryRange,
      job_location: params.jobLocation,
      job_id: params.jobId,
      company_name: params.companyName,
      project_demo_url: params.projectDemoUrl,
      project_github_url: params.projectGithubUrl,
      project_score: params.projectScore,
      offer_company_name: params.offerCompanyName,
      offer_position: params.offerPosition
    };

    all.unshift(newPost);
    this.saveAllPosts(all);
    return newPost;
  },

  // Thả tim / Thích bài viết (Toggle Like)
  toggleLikePost(postId: string): { success: boolean; likesCount: number; isLiked: boolean } {
    const all = this.getAllPosts();
    const index = all.findIndex(p => p.id === postId);
    if (index === -1) return { success: false, likesCount: 0, isLiked: false };

    const post = all[index];
    const currentlyLiked = Boolean(post.is_liked);
    post.is_liked = !currentlyLiked;
    post.likes_count = currentlyLiked ? Math.max(0, post.likes_count - 1) : post.likes_count + 1;

    all[index] = post;
    this.saveAllPosts(all);

    return { success: true, likesCount: post.likes_count, isLiked: post.is_liked };
  },

  // Lưu / Bỏ lưu bài viết (Bookmark)
  toggleBookmarkPost(postId: string): { success: boolean; isSaved: boolean } {
    const all = this.getAllPosts();
    const index = all.findIndex(p => p.id === postId);
    if (index === -1) return { success: false, isSaved: false };

    const post = all[index];
    post.is_saved = !post.is_saved;

    all[index] = post;
    this.saveAllPosts(all);

    return { success: true, isSaved: Boolean(post.is_saved) };
  },

  // Bình luận vào bài viết
  addComment(postId: string, commentData: { authorId: string; authorName: string; authorAvatar?: string; authorRole?: string; content: string }): PostComment | null {
    if (!commentData.content.trim()) return null;

    const all = this.getAllPosts();
    const index = all.findIndex(p => p.id === postId);
    if (index === -1) return null;

    const post = all[index];
    const newComment: PostComment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author_id: commentData.authorId,
      author_name: commentData.authorName,
      author_avatar: commentData.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
      author_role: commentData.authorRole || 'student',
      content: commentData.content.trim(),
      created_at: new Date().toISOString()
    };

    if (!Array.isArray(post.comments)) post.comments = [];
    post.comments.push(newComment);
    post.comments_count = post.comments.length;

    all[index] = post;
    this.saveAllPosts(all);

    return newComment;
  },

  // Ứng tuyển nhanh 1-click từ bài đăng tuyển dụng (Đẩy vào Pipeline NTD)
  quickApplyJobFromPost(
    postId: string, 
    applicant: { 
      studentId: string; 
      studentName: string; 
      major?: string; 
      gpa?: string; 
      verifiedProjectsCount?: number 
    }
  ): { success: boolean; message: string } {
    const all = this.getAllPosts();
    const post = all.find(p => p.id === postId);
    if (!post || post.post_type !== 'job_hiring') {
      return { success: false, message: 'Bài viết không phải là tin tuyển dụng hoặc không tồn tại.' };
    }

    try {
      const candidateId = `cand_pipe_${applicant.studentId || Date.now()}`;
      addToSharedPipeline({
        id: candidateId,
        recruiter_id: post.author_id,
        student_id: applicant.studentId || `stu_${Date.now()}`,
        stage: 'shortlisted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        private_notes: `[Ứng Tuyển Nhanh 1-Click Từ Mạng Xã Hội Career Feed]\nBài viết: ${post.title}\nThời gian: ${new Date().toLocaleString('vi-VN')}`,
        student: {
          id: applicant.studentId || `stu_${Date.now()}`,
          full_name: applicant.studentName,
          major: applicant.major || 'Kỹ thuật Phần mềm',
          gpa: applicant.gpa || '3.6/4.0',
        } as any,
        job: {
          id: post.job_id || `job_${Date.now()}`,
          recruiter_id: post.author_id,
          title: post.title.replace(/^🚀 Tuyển Dụng \d+ Vị Trí /i, ''),
          company_name: post.company_name || post.author_name
        }
      });

      return {
        success: true,
        message: `🎉 Ứng tuyển thành công vị trí "${post.title}"! Hồ sơ và đồ án của bạn đã được chuyển đến bộ phận tuyển dụng ${post.company_name || post.author_name}.`
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Có lỗi khi đồng bộ hồ sơ ứng tuyển.' };
    }
  }
};
