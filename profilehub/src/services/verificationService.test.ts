import { describe, it, expect, beforeEach } from 'vitest';
import { verificationService } from './verificationService';

describe('Cổng Tra Cứu Bảo Chứng Đồ Án (Public Verification Gateway Service Seam)', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('TC-VER-01: Tính toán mã băm SHA-256 đồng nhất và có độ dài chuẩn 64 ký tự hex', async () => {
    const payload = {
      projectId: 'proj_ecommerce_redis',
      studentId: 'student_123',
      teacherId: 'teacher_456',
      verifiedAt: '2026-10-18T14:30:00.000Z'
    };

    const hash1 = await verificationService.computeVerificationHash(payload);
    const hash2 = await verificationService.computeVerificationHash(payload);

    expect(hash1).toBeDefined();
    expect(hash1.length).toBe(64);
    expect(hash1).toBe(hash2);
    expect(/^[0-9a-f]{64}$/.test(hash1)).toBe(true);
  });

  it('TC-VER-02: Sinh mã định danh tra cứu định dạng chuẩn Base62 (PH-VER-XXXXXX)', () => {
    const code = verificationService.generateVerificationCode();
    expect(code).toBeDefined();
    expect(/^PH-VER-[A-Z0-9]{6}$/.test(code)).toBe(true);
  });

  it('TC-VER-03: Tra cứu thành công đồ án hợp lệ theo mã (PH-VER-A8B9C2) và không phân biệt hoa thường', async () => {
    const recordUpper = await verificationService.getVerifiedProjectByCode('PH-VER-A8B9C2');
    const recordLower = await verificationService.getVerifiedProjectByCode('ph-ver-a8b9c2');

    expect(recordUpper).not.toBeNull();
    expect(recordUpper?.isValid).toBe(true);
    expect(recordUpper?.project.title).toContain('Thương Mại Điện Tử');
    expect(recordUpper?.student.name).toBe('Phạm Thái Bảo');
    expect(recordUpper?.instructor.name).toContain('Nguyễn Văn Hùng');
    expect(recordLower?.verificationCode).toBe('PH-VER-A8B9C2');
  });

  it('TC-VER-04: Chốt chặn bảo mật Zero Data Leak - Tuyệt đối không rò rỉ GPA, SĐT, Email cá nhân sinh viên', async () => {
    const maliciousPayloadStudent = {
      id: 'student_secret_99',
      name: 'Sinh Viên Bảo Mật',
      university: 'ĐH CNTT',
      phone: '0901234567', // Trường nhạy cảm
      email: 'secret@gmail.com', // Trường nhạy cảm
      gpa: 3.95 // Trường nhạy cảm
    };

    const registered = await verificationService.registerVerifiedProject(
      {
        id: 'proj_test_leak',
        title: 'Đồ án thử nghiệm rò rỉ dữ liệu',
        tags: ['Security']
      },
      maliciousPayloadStudent,
      {
        id: 'teacher_sec',
        name: 'TS. An Ninh Mạng',
        title: 'Giảng viên'
      }
    );

    // Kiểm tra trực tiếp trên đối tượng trả về
    const studentObj = registered.student as any;
    expect(studentObj.name).toBe('Sinh Viên Bảo Mật');
    expect(studentObj.phone).toBeUndefined();
    expect(studentObj.email).toBeUndefined();
    expect(studentObj.gpa).toBeUndefined();
    expect(studentObj.student_id).toBeUndefined();

    // Kiểm tra khi tra cứu lại qua getVerifiedProjectByCode
    const queried = await verificationService.getVerifiedProjectByCode(registered.verificationCode);
    const queriedStudent = queried?.student as any;
    expect(queriedStudent.phone).toBeUndefined();
    expect(queriedStudent.email).toBeUndefined();
    expect(queriedStudent.gpa).toBeUndefined();
  });

  it('TC-VER-05: Xử lý an toàn khi mã tra cứu không tồn tại hoặc rỗng mà không văng lỗi', async () => {
    const emptyResult = await verificationService.getVerifiedProjectByCode('');
    const nullResult = await verificationService.getVerifiedProjectByCode('PH-VER-NONEXISTENT999');

    expect(emptyResult).toBeNull();
    expect(nullResult).toBeNull();
  });

  it('TC-VER-06: Xác thực tính toàn vẹn (Integrity Check) phát hiện chính xác khi dữ liệu bị giả mạo', async () => {
    const project = {
      id: 'proj_ledger',
      title: 'Hệ thống Sổ cái Kỹ thuật số'
    };
    const student = { id: 'std_alpha', name: 'Trần Văn A' };
    const instructor = { id: 'tea_beta', name: 'TS. Lê Minh', title: 'GVHD' };

    const record = await verificationService.registerVerifiedProject(project, student, instructor);

    // Kiểm tra với đúng IDs gốc
    const isIntegrityValid = await verificationService.verifyProjectIntegrity(record, {
      projectId: project.id,
      studentId: student.id,
      teacherId: instructor.id
    });
    expect(isIntegrityValid).toBe(true);

    // Giả mạo đổi người bảo chứng
    const isTampered = await verificationService.verifyProjectIntegrity(record, {
      projectId: project.id,
      studentId: student.id,
      teacherId: 'teacher_impostor_999'
    });
    expect(isTampered).toBe(false);
  });
});
