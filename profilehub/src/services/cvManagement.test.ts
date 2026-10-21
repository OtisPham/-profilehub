import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cvService, type SavedCVData } from './cvService';

// Mock supabase calls để test chạy hoàn toàn độc lập và thuần khiết ở tầng Service
vi.mock('./supabase', () => {
  const queryBuilder: any = {
    select: vi.fn(() => queryBuilder),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => queryBuilder),
    delete: vi.fn(() => queryBuilder),
    eq: vi.fn(() => queryBuilder),
    order: vi.fn(() => queryBuilder),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    then: vi.fn((resolve) => Promise.resolve({ data: null, error: null }).then(resolve)),
    catch: vi.fn((reject) => Promise.resolve({ data: null, error: null }).catch(reject))
  };
  return {
    supabase: {
      from: vi.fn(() => queryBuilder)
    }
  };
});

// Mock localStorage cho Node/Vitest test environment
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
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

describe('Tầng 2 (CV Management Service Seam): Lifecycle & Invariants', () => {
  const testUserId = 'test-student-123';

  const mockCvData: SavedCVData = {
    personalInfo: {
      fullName: 'Nguyễn Văn A',
      jobTitle: 'Frontend Engineer',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      location: 'Hồ Chí Minh',
      visibleFields: {
        phone: true,
        email: true,
        facebook: false,
        linkedin: true,
        website: true,
        location: true,
        avatarUrl: false
      }
    },
    sections: [
      {
        id: 'sec_skills',
        type: 'skills',
        title: 'Kỹ Năng',
        order_index: 0,
        is_visible: true,
        settings: {
          showTitle: true,
          showDivider: true,
          spacing: 'normal',
          titleStyle: 'bold',
          titleCase: 'uppercase'
        },
        items: []
      }
    ],
    selectedTemplate: 'tech',
    primaryColor: '#2563eb',
    selectedFontId: 'inter',
    spacingDensity: 'standard',
    fontSizeLevel: 'medium',
    savedAt: new Date().toISOString()
  };

  beforeEach(() => {
    // Đảm bảo môi trường storage được reset sạch sẽ trước mỗi ca kiểm thử
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('TC-CVM-01: Tạo mới CV thành công, cập nhật danh sách và gán làm Active CV', () => {
    const newCv = cvService.createNewCV({
      title: 'CV Frontend 2026',
      targetRole: 'Frontend Developer',
      data: mockCvData,
      userId: testUserId,
      isDefault: true
    });

    expect(newCv.id).toBeDefined();
    expect(newCv.title).toBe('CV Frontend 2026');
    expect(newCv.targetRole).toBe('Frontend Developer');
    expect(newCv.isDefault).toBe(true);

    const allCvs = cvService.getAllCVs(testUserId);
    expect(allCvs.length).toBe(1);
    expect(allCvs[0].id).toBe(newCv.id);

    // Active CV phải tự động trỏ đến CV vừa tạo
    const activeId = cvService.getActiveCVId(testUserId);
    expect(activeId).toBe(newCv.id);
  });

  it('TC-CVM-02: Nhân bản CV (Deep Clone) độc lập, thay đổi bản clone không làm hỏng bản gốc', () => {
    const original = cvService.createNewCV({
      title: 'CV Gốc',
      targetRole: 'Full-stack Engineer',
      data: mockCvData,
      userId: testUserId
    });

    const cloned = cvService.duplicateCV(original.id, 'CV Bản Sao Mục Tiêu', testUserId);
    expect(cloned).not.toBeNull();
    expect(cloned?.id).not.toBe(original.id);
    expect(cloned?.title).toBe('CV Bản Sao Mục Tiêu');
    expect(cloned?.isDefault).toBe(false);

    // Kiểm tra tính độc lập dữ liệu (Deep Copy)
    if (cloned) {
      cloned.data.personalInfo.fullName = 'Tên Đã Đổi Trong Bản Sao';
      cvService.saveManagedCV(cloned, testUserId);
    }

    const fetchedOriginal = cvService.getCVById(original.id, testUserId);
    expect(fetchedOriginal?.data.personalInfo.fullName).toBe('Nguyễn Văn A');
  });

  it('TC-CVM-03: Đổi tên và vị trí mục tiêu (renameCV) cập nhật chính xác', () => {
    const cv = cvService.createNewCV({
      title: 'Tên Ban Đầu',
      targetRole: 'Junior Dev',
      data: mockCvData,
      userId: testUserId
    });

    const success = cvService.renameCV(cv.id, 'Tên Sau Khi Sửa', 'Senior Dev', testUserId);
    expect(success).toBe(true);

    const updated = cvService.getCVById(cv.id, testUserId);
    expect(updated?.title).toBe('Tên Sau Khi Sửa');
    expect(updated?.targetRole).toBe('Senior Dev');
  });

  it('TC-CVM-04: Thiết lập Default CV đảm bảo tính bất biến (Chỉ duy nhất 1 CV là Default)', () => {
    const cv1 = cvService.createNewCV({ title: 'CV 1', targetRole: 'Dev 1', data: mockCvData, userId: testUserId, isDefault: true });
    const cv2 = cvService.createNewCV({ title: 'CV 2', targetRole: 'Dev 2', data: mockCvData, userId: testUserId, isDefault: false });
    const cv3 = cvService.createNewCV({ title: 'CV 3', targetRole: 'Dev 3', data: mockCvData, userId: testUserId, isDefault: false });

    // Ban đầu cv1 là default (hoặc cv tạo sau với isDefault=true)
    cvService.setDefaultCV(cv3.id, testUserId);

    const list = cvService.getAllCVs(testUserId);
    const defaultList = list.filter(c => c.isDefault);

    expect(defaultList.length).toBe(1);
    expect(defaultList[0].id).toBe(cv3.id);

    const fetchedCv1 = cvService.getCVById(cv1.id, testUserId);
    const fetchedCv2 = cvService.getCVById(cv2.id, testUserId);
    expect(fetchedCv1?.isDefault).toBe(false);
    expect(fetchedCv2?.isDefault).toBe(false);
  });

  it('TC-CVM-05: Xóa CV đang Active tự động điều phối Active sang CV đầu tiên còn lại', () => {
    const cv1 = cvService.createNewCV({ title: 'CV 1', targetRole: 'Dev 1', data: mockCvData, userId: testUserId });
    const cv2 = cvService.createNewCV({ title: 'CV 2', targetRole: 'Dev 2', data: mockCvData, userId: testUserId });

    // Gán cv2 làm active
    cvService.setActiveCVId(cv2.id, testUserId);
    expect(cvService.getActiveCVId(testUserId)).toBe(cv2.id);

    // Xóa cv2 đang active
    const deleteSuccess = cvService.deleteCV(cv2.id, testUserId);
    expect(deleteSuccess).toBe(true);

    // Active CV phải tự động fallback sang cv1 còn lại
    const remainingActiveId = cvService.getActiveCVId(testUserId);
    expect(remainingActiveId).toBe(cv1.id);

    // Xóa nốt cv1
    cvService.deleteCV(cv1.id, testUserId);
    expect(cvService.getAllCVs(testUserId).length).toBe(0);
    expect(cvService.getActiveCVId(testUserId)).toBeNull();
  });
});
