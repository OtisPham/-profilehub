import { describe, it, expect, beforeEach, vi } from 'vitest';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
vi.stubGlobal('localStorage', mockStorage);

const eventTarget = new EventTarget();
vi.stubGlobal('window', {
  addEventListener: eventTarget.addEventListener.bind(eventTarget),
  removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
  dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
});

// Import sau khi mock globals
import { socialFeedService } from './socialFeedService';

describe('socialFeedService - Mạng Xã Hội Việc Làm', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
  });

  it('TC-FEED-01: Tự động khởi tạo dữ liệu hạt giống ban đầu khi storage rỗng', () => {
    const posts = socialFeedService.getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(4);
    expect(posts.some(p => p.post_type === 'job_hiring')).toBe(true);
    expect(posts.some(p => p.post_type === 'project_showcase')).toBe(true);
  });

  it('TC-FEED-02: Lọc bài viết chính xác theo danh mục feed (job_hiring, project_showcase)', () => {
    const jobPosts = socialFeedService.getPosts('job_hiring');
    expect(jobPosts.length).toBeGreaterThan(0);
    expect(jobPosts.every(p => p.post_type === 'job_hiring')).toBe(true);

    const projectPosts = socialFeedService.getPosts('project_showcase');
    expect(projectPosts.length).toBeGreaterThan(0);
    expect(projectPosts.every(p => p.post_type === 'project_showcase')).toBe(true);
  });

  it('TC-FEED-03: Thả tim (Toggle Like) tăng/giảm số đếm chính xác', () => {
    const posts = socialFeedService.getAllPosts();
    const targetPost = posts[0];
    const initialLikes = targetPost.likes_count;

    // Lần 1: Like
    const res1 = socialFeedService.toggleLikePost(targetPost.id);
    expect(res1.success).toBe(true);
    expect(res1.isLiked).toBe(true);
    expect(res1.likesCount).toBe(initialLikes + 1);

    // Lần 2: Unlike
    const res2 = socialFeedService.toggleLikePost(targetPost.id);
    expect(res2.success).toBe(true);
    expect(res2.isLiked).toBe(false);
    expect(res2.likesCount).toBe(initialLikes);
  });

  it('TC-FEED-04: Thêm bình luận vào bài viết thành công', () => {
    const posts = socialFeedService.getAllPosts();
    const targetPost = posts[0];

    const comment = socialFeedService.addComment(targetPost.id, {
      authorId: 'stu_099',
      authorName: 'Hoàng Minh Tuấn',
      content: 'Công ty mình có tuyển thực tập sinh part-time không ạ?'
    });

    expect(comment).not.toBeNull();
    expect(comment?.content).toContain('part-time');

    const updated = socialFeedService.getAllPosts().find(p => p.id === targetPost.id);
    expect(updated?.comments_count).toBe((targetPost.comments?.length || 0) + 1);
  });

  it('TC-FEED-05: Ứng tuyển nhanh 1-click từ bài đăng tuyển dụng đẩy vào Pipeline', () => {
    const jobPosts = socialFeedService.getPosts('job_hiring');
    const targetJob = jobPosts[0];

    const result = socialFeedService.quickApplyJobFromPost(targetJob.id, {
      studentId: 'stu_apply_test',
      studentName: 'Đặng Tuấn Anh',
      major: 'Công nghệ thông tin'
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('Ứng tuyển thành công');
  });
});
