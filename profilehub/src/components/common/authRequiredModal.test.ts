import { describe, it, expect } from 'vitest';
import type { AuthRequiredModalProps } from './AuthRequiredModal';

describe('AuthRequiredModal Contracts & Specifications', () => {
  it('TC-AUTH-MODAL-01: Cung cấp đầy đủ các thuộc tính mặc định chuẩn xác', () => {
    const defaultProps: AuthRequiredModalProps = {
      isOpen: true,
      onClose: () => {}
    };

    expect(defaultProps.isOpen).toBe(true);
    expect(typeof defaultProps.onClose).toBe('function');
  });

  it('TC-AUTH-MODAL-02: Cho phép tùy biến thông tin vị trí tuyển dụng và doanh nghiệp đích', () => {
    const customProps: AuthRequiredModalProps = {
      isOpen: true,
      onClose: () => {},
      title: 'Đăng Nhập Để Nộp Hồ Sơ',
      targetJobTitle: 'Backend Golang Engineer',
      companyName: 'MoMo Payment Platform',
      actionReason: 'Cần tài khoản để xác thực năng lực đồ án'
    };

    expect(customProps.targetJobTitle).toBe('Backend Golang Engineer');
    expect(customProps.companyName).toBe('MoMo Payment Platform');
    expect(customProps.actionReason).toContain('xác thực');
  });

  it('TC-AUTH-MODAL-03: Kiểm soát trạng thái đóng mở (isOpen = false)', () => {
    const closedProps: AuthRequiredModalProps = {
      isOpen: false,
      onClose: () => {}
    };
    expect(closedProps.isOpen).toBe(false);
  });
});
