/**
 * Smart CV Parser & Master Profile Auto-Population Engine
 * Bóc tách nội dung CV ngoại tuyến, trích xuất thực thể cấu trúc
 * và tự động điền vào Hồ Sơ Cá Nhân (Master Profile).
 * File: src/services/cvParserService.ts
 */

import type {
  ParsedPersonalInfo,
  ParsedEducation,
  ParsedProject,
  ParsedCertificate,
  ParsedCvData,
  ProfileAutoPopulateOptions,
  ProfilePopulateResult
} from '../types/cvParser.types';
import { jobStudioService, TECH_DICTIONARY } from './jobStudioService';
import { supabase } from './supabase';

/**
 * Danh mục các trường Đại học phổ biến tại Việt Nam để nhận diện nhanh
 */
const KNOWN_UNIVERSITIES = [
  'Đại học Bách Khoa',
  'Trường Đại học Bách Khoa',
  'Đại học Bách Khoa Hà Nội',
  'Đại học Bách Khoa - ĐHQG TP.HCM',
  'Đại học Bách Khoa TP.HCM',
  'Trường Đại học Khoa học Tự nhiên',
  'Đại học Khoa học Tự nhiên',
  'Trường Đại học Công nghệ Thông tin',
  'Đại học Công nghệ Thông tin',
  'Trường Đại học Sư phạm Kỹ thuật',
  'Đại học Sư phạm Kỹ thuật TP.HCM',
  'Đại học FPT',
  'Trường Đại học FPT',
  'Đại học Quốc gia Hà Nội',
  'Đại học Quốc gia TP.HCM',
  'Học viện Công nghệ Bưu chính Viễn thông',
  'Học viện Bưu chính Viễn thông',
  'Trường Đại học Ngoại thương',
  'Đại học Ngoại thương',
  'Trường Đại học Kinh tế Quốc dân',
  'Đại học Kinh tế Quốc dân',
  'Trường Đại học Kinh tế TP.HCM',
  'Đại học Kinh tế TP.HCM',
  'Trường Đại học Cần Thơ',
  'Đại học Cần Thơ',
  'Trường Đại học Đà Nẵng',
  'Đại học Đà Nẵng',
  'RMIT University',
  'Đại học RMIT',
  'Đại học Tôn Đức Thắng',
  'Đại học Hoa Sen',
  'Đại học Giao thông Vận tải',
  'Trường Đại học Công nghiệp TP.HCM'
];

/**
 * Danh mục chuyên ngành phổ biến trong lĩnh vực CNTT & Kỹ thuật
 */
const KNOWN_MAJORS = [
  'Công nghệ thông tin',
  'Kỹ thuật phần mềm',
  'Khoa học máy tính',
  'Hệ thống thông tin',
  'Kỹ thuật máy tính',
  'An toàn thông tin',
  'Mạng máy tính và Truyền thông dữ liệu',
  'Khoa học dữ liệu',
  'Trí tuệ nhân tạo',
  'Thương mại điện tử',
  'Công nghệ kỹ thuật điện tử - viễn thông',
  'Kỹ thuật điều khiển và tự động hóa',
  'Information Technology',
  'Software Engineering',
  'Computer Science',
  'Information Systems',
  'Data Science',
  'Artificial Intelligence'
];

/**
 * Bóc tách thông tin liên hệ và học vấn từ văn bản CV
 */
export function parseContactAndEducation(text: string): {
  personalInfo: ParsedPersonalInfo;
  education: ParsedEducation;
} {
  const personalInfo: ParsedPersonalInfo = {};
  const education: ParsedEducation = {};

  if (!text || typeof text !== 'string') {
    return { personalInfo, education };
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. Email (RFC 5322 regex đơn giản)
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    personalInfo.email = emailMatch[1].trim();
  }

  // 2. Số điện thoại (VN + Quốc tế: 09x, 03x, 07x, 08x, 05x, +84x)
  const phoneRegex = /(?:(?:\+84|84|0)[3|5|7|8|9])[0-9\s.-]{8,11}\b/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    personalInfo.phone = phoneMatch[0].replace(/[\s.-]/g, '').trim();
  }

  // 3. Họ và tên
  // Ưu tiên dòng có từ khóa "Họ và tên", "Full name", "Họ tên"
  const nameLabelRegex = /(?:Họ\s*(?:và|&)?\s*tên|Full\s*name|Họ\s*tên|Tên)\s*[:\-]\s*([^\n\r,;|]+)/i;
  const nameLabelMatch = text.match(nameLabelRegex);
  if (nameLabelMatch && nameLabelMatch[1].trim()) {
    personalInfo.fullName = nameLabelMatch[1].trim();
  } else {
    // Nếu không có nhãn, tìm ở 5 dòng đầu tiên bỏ qua tiêu đề CV
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();
      // Bỏ qua các tiêu đề thông dụng
      if (
        lineLower.includes('curriculum vitae') ||
        lineLower.includes('resume') ||
        lineLower.includes('cv') ||
        lineLower.includes('thông tin cá nhân') ||
        lineLower.includes('contact') ||
        lineLower.includes('profile') ||
        emailRegex.test(line) ||
        phoneRegex.test(line)
      ) {
        continue;
      }

      // Kiểm tra xem dòng này có dạng Tên người (2 đến 5 từ, không chứa số hoặc ký tự đặc biệt)
      const words = line.split(/\s+/);
      const isNameLike = words.length >= 2 && words.length <= 5 &&
        !/\d/.test(line) &&
        !/[@#$%^&*()_+={}[\]:;"'<>/?\\]/.test(line);

      if (isNameLike) {
        personalInfo.fullName = line.trim();
        break;
      }
    }
  }

  // 4. Vị trí ứng tuyển / Mục tiêu nghề nghiệp
  const roleLabelRegex = /(?:Vị trí ứng tuyển|Vị trí|Mục tiêu nghề nghiệp|Role|Target Role|Objective|Chức danh)\s*[:\-]\s*([^\n\r]+)/i;
  const roleMatch = text.match(roleLabelRegex);
  if (roleMatch && roleMatch[1].trim()) {
    personalInfo.targetRole = roleMatch[1].trim();
  } else {
    // Tìm các vị trí phổ biến
    const commonRoles = [
      'Frontend Developer', 'Front-end Developer', 'Backend Developer', 'Fullstack Developer',
      'Mobile Developer', 'React Developer', 'Node.js Developer', 'Software Engineer',
      'Data Engineer', 'DevOps Engineer', 'UI/UX Designer', 'QA/QC Engineer', 'Lập trình viên'
    ];
    for (const r of commonRoles) {
      if (new RegExp(`\\b${r}\\b`, 'i').test(text)) {
        personalInfo.targetRole = r;
        break;
      }
    }
  }

  // 5. Địa chỉ / Nơi ở
  const locationRegex = /(?:Địa chỉ|Address|Nơi ở|Location|Thành phố|Tỉnh\/Thành phố)\s*[:\-]\s*([^\n\r]+)/i;
  const locationMatch = text.match(locationRegex);
  if (locationMatch && locationMatch[1].trim()) {
    personalInfo.location = locationMatch[1].trim();
  } else {
    // Nhận diện TP lớn
    const cities = ['TP. Hồ Chí Minh', 'TP.HCM', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Bình Dương'];
    for (const c of cities) {
      if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
        personalInfo.location = c === 'Hồ Chí Minh' || c === 'TP.HCM' ? 'TP. Hồ Chí Minh' : c;
        break;
      }
    }
  }

  // 6. Bio / Giới thiệu bản thân
  const bioRegex = /(?:Giới thiệu|Tóm tắt|Summary|About me|Profile|Mục tiêu bản thân)\s*[:\-]?\s*([^\n\r]+(?:\n[^\n\r]+){0,2})/i;
  const bioMatch = text.match(bioRegex);
  if (bioMatch && bioMatch[1].trim()) {
    personalInfo.bio = bioMatch[1].trim();
  }

  // 7. Trường Đại học
  const uniLabelRegex = /(?:Trường\s*(?:Đại học)?|Đại học|University|Học viện|College)\s*[:\-]\s*([^\n\r]+)/i;
  const uniMatch = text.match(uniLabelRegex);
  if (uniMatch && uniMatch[1].trim() && uniMatch[1].trim().length > 3) {
    education.university = uniMatch[1].trim();
  } else {
    for (const uni of KNOWN_UNIVERSITIES) {
      if (text.toLowerCase().includes(uni.toLowerCase())) {
        education.university = uni;
        break;
      }
    }
  }

  // 8. Chuyên ngành
  // Tránh bắt nhầm "Bách Khoa" bằng cách yêu cầu ở đầu dòng hoặc có từ khóa cụ thể
  const majorLabelRegex = /(?:^|[\n\r])\s*(?:Chuyên\s*ngành|Ngành|Major|Faculty|Khoa)\s*[:\-]\s*([^\n\r]+)/im;
  const majorMatch = text.match(majorLabelRegex);
  if (majorMatch && majorMatch[1].trim()) {
    education.major = majorMatch[1].trim();
  } else {
    for (const major of KNOWN_MAJORS) {
      if (text.toLowerCase().includes(major.toLowerCase())) {
        education.major = major;
        break;
      }
    }
  }

  // 9. Điểm GPA (thang 4 hoặc thang 10)
  // Các mẫu: "GPA: 3.6/4.0", "GPA 3.8", "Điểm trung bình: 8.5/10", "CPA: 3.4"
  const gpaRegex = /(?:GPA|CPA|Điểm\s*(?:trung\s*bình|tích\s*lũy)?)\s*[:\-]?\s*([0-4](?:\.\d{1,2})?|[0-9](?:\.\d{1,2})?|10(?:\.0{1,2})?)(?:\s*\/\s*(4(?:\.0)?|10(?:\.0)?))?/i;
  const gpaMatch = text.match(gpaRegex);
  if (gpaMatch) {
    const rawVal = gpaMatch[1];
    const scale = gpaMatch[2];
    if (scale) {
      education.gpa = `${rawVal}/${scale}`;
    } else {
      const num = parseFloat(rawVal);
      education.gpa = num <= 4.0 ? `${rawVal}/4.0` : `${rawVal}/10`;
    }
  }

  // 10. Năm tốt nghiệp / Niên khóa
  const gradYearRegex = /(?:Tốt nghiệp|Năm tốt nghiệp|Graduation|Niên khóa|Khóa học)\s*[:\-]?\s*(?:20\d{2}\s*-\s*)?(20\d{2})/i;
  const gradYearMatch = text.match(gradYearRegex);
  if (gradYearMatch) {
    education.graduationYear = gradYearMatch[1];
  }

  return { personalInfo, education };
}

/**
 * Bóc tách kỹ năng chuẩn hóa kế thừa từ điển 120+ công nghệ của jobStudioService
 */
export function parseSkills(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  // Trích xuất qua jobStudioService
  const result = jobStudioService.extractSkillsFromText(text);
  const foundSkills = new Set<string>(result.allSkills);

  // Bổ sung quét thêm các từ khóa trong vùng "Kỹ năng" nếu có
  const skillsSectionRegex = /(?:KỸ NĂNG|SKILLS|CHUYÊN MÔN|TECHNICAL SKILLS)[\s\S]*?(?=(?:DỰ ÁN|PROJECTS|KINH NGHIỆM|EXPERIENCE|HỌC VẤN|EDUCATION|CHỨNG CHỈ|CERTIFICATES|$))/i;
  const sectionMatch = text.match(skillsSectionRegex);
  if (sectionMatch) {
    const sectionText = sectionMatch[0];
    const sectionSkills = jobStudioService.extractSkillsFromText(sectionText);
    sectionSkills.allSkills.forEach(s => foundSkills.add(s));
  }

  return Array.from(foundSkills);
}

/**
 * Trích xuất link GitHub và Live Demo
 */
export function extractUrls(text: string): { github_url?: string; demo_url?: string } {
  let github_url: string | undefined;
  let demo_url: string | undefined;

  // GitHub regex: github.com/username/repo
  const githubRegex = /(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/)?)/i;
  const ghMatch = text.match(githubRegex);
  if (ghMatch) {
    github_url = ghMatch[1].replace(/\/$/, '');
  }

  // Live Demo regex: hỗ trợ vercel, netlify, github.io, render, surge, firebase, hoặc tên miền thông thường
  const demoRegex = /(https?:\/\/(?:[a-zA-Z0-9-]+\.)+(?:vercel\.app|netlify\.app|github\.io|render\.com|herokuapp\.com|surge\.sh|firebaseapp\.com|web\.app|com|vn|dev|io)(?:\/[^\s)\]]*)?)/i;
  const allUrls = text.match(new RegExp(demoRegex, 'gi')) || [];
  
  for (const url of allUrls) {
    const clean = url.trim().replace(/[.,;)]+$/, '');
    // Loại trừ GitHub repo link và các trang mạng xã hội
    if (
      !clean.includes('github.com') &&
      !clean.includes('linkedin.com') &&
      !clean.includes('facebook.com') &&
      !clean.includes('twitter.com')
    ) {
      demo_url = clean;
      break;
    }
  }

  return { github_url, demo_url };
}

/**
 * Bóc tách danh sách đồ án thực tế kèm link GitHub và Live Demo
 */
export function parseProjects(text: string): ParsedProject[] {
  if (!text || typeof text !== 'string') return [];

  const projects: ParsedProject[] = [];

  // 1. Tìm phân vùng dự án
  const projectSectionRegex = /(?:DỰ ÁN|PROJECTS|KINH NGHIỆM DỰ ÁN|PERSONAL PROJECTS|CÁC DỰ ÁN ĐÃ THỰC HIỆN)[\s\S]*?(?=(?:CHỨNG CHỈ|CERTIFICATES|HOẠT ĐỘNG|ACTIVITIES|GIẢI THƯỞNG|AWARDS|HỌC VẤN|EDUCATION|$))/i;
  const sectionMatch = text.match(projectSectionRegex);
  const targetText = sectionMatch ? sectionMatch[0] : text;

  // 2. Chia thành các khối dự án bằng các ký hiệu phân cách phổ biến (Dự án 1, Project 1, ##, •, - )
  // Tách theo dòng bắt đầu bằng Tên dự án hoặc gạch đầu dòng lớn
  const rawBlocks = targetText.split(/(?=(?:Dự án|Project|\d+\.|\u2022|\u25CF|\#\#)\s+[A-ZÀ-Ỹ0-9])/i);

  for (const block of rawBlocks) {
    const trimmed = block.trim();
    if (trimmed.length < 25) continue; // Bỏ qua đoạn quá ngắn hoặc tiêu đề chung

    // Bóc tách tiêu đề: Dòng đầu tiên
    const blockLines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (blockLines.length === 0) continue;

    let titleLine = blockLines[0]
      .replace(/^(?:Dự án|Project|\d+\.|\u2022|\u25CF|\#\#|[\-*])\s*[:\-]?\s*/i, '')
      .trim();

    // Nếu tiêu đề chính là từ "Dự án" chung chung thì lấy dòng kế tiếp
    if (/^(?:Dự án|Projects|Kinh nghiệm dự án)$/i.test(titleLine) && blockLines.length > 1) {
      titleLine = blockLines[1]
        .replace(/^(?:Dự án|Project|\d+\.|\u2022|\u25CF|\#\#|[\-*])\s*[:\-]?\s*/i, '')
        .trim();
    }

    if (!titleLine || titleLine.length < 3) continue;

    // Vai trò
    let role: string | undefined;
    const roleRegex = /(?:Vai trò|Role|Vị trí)\s*[:\-]\s*([^\n\r]+)/i;
    const roleMatch = trimmed.match(roleRegex);
    if (roleMatch) {
      role = roleMatch[1].trim();
    } else {
      const commonRoles = ['Frontend Developer', 'Front-end Developer', 'Backend Developer', 'Fullstack Developer', 'Mobile Developer', 'Tech Lead', 'Solo Developer', 'Lập trình viên'];
      for (const r of commonRoles) {
        if (new RegExp(`\\b${r}\\b`, 'i').test(trimmed)) {
          role = r;
          break;
        }
      }
    }

    // Links
    const { github_url, demo_url } = extractUrls(trimmed);

    // Tags công nghệ dùng trong dự án
    const projectSkills = jobStudioService.extractSkillsFromText(trimmed);

    // Mô tả
    const descriptionLines = blockLines.slice(1).filter(l => {
      // Loại trừ các dòng chỉ chứa URL đã bóc tách
      if (github_url && l.includes(github_url)) return false;
      if (demo_url && l.includes(demo_url)) return false;
      return true;
    });

    const description = descriptionLines.join('\n').trim();

    projects.push({
      title: titleLine,
      role: role || 'Lập trình viên',
      description: description || titleLine,
      tags: projectSkills.allSkills.slice(0, 8),
      github_url,
      demo_url
    });
  }

  // Fallback nếu không tách được khối nhưng có link GitHub hoặc Demo trong bài
  if (projects.length === 0) {
    const { github_url, demo_url } = extractUrls(text);
    if (github_url || demo_url) {
      projects.push({
        title: 'Dự án thực tế (Từ CV)',
        role: 'Lập trình viên',
        description: 'Đồ án được trích xuất tự động từ CV với liên kết mã nguồn và sản phẩm thực tế.',
        tags: parseSkills(text).slice(0, 5),
        github_url,
        demo_url
      });
    }
  }

  return projects;
}

/**
 * Bóc tách chứng chỉ và giải thưởng
 */
export function parseCertificates(text: string): ParsedCertificate[] {
  if (!text || typeof text !== 'string') return [];

  const certs: ParsedCertificate[] = [];
  const certSectionRegex = /(?:CHỨNG CHỈ|CERTIFICATES|GIẢI THƯỞNG|AWARDS)[\s\S]*?(?=(?:KỸ NĂNG|SKILLS|HỌC VẤN|EDUCATION|DỰ ÁN|PROJECTS|$))/i;
  const sectionMatch = text.match(certSectionRegex);

  const targetText = sectionMatch ? sectionMatch[0] : text;
  const lines = targetText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Danh mục tổ chức cấp chứng chỉ phổ biến
  const issuers = ['AWS', 'Coursera', 'Udemy', 'Google', 'Microsoft', 'Oracle', 'IELTS', 'TOEIC', 'HackerRank', 'freeCodeCamp', 'Scrum.org'];

  for (const line of lines) {
    // Bỏ qua tiêu đề section
    if (/^(?:CHỨNG CHỈ|CERTIFICATES|GIẢI THƯỞNG|AWARDS)$/i.test(line)) continue;

    // Tìm xem dòng có chứa tên chứng chỉ hoặc issuer
    let matchedIssuer: string | undefined;
    for (const issuer of issuers) {
      if (new RegExp(`\\b${issuer}\\b`, 'i').test(line)) {
        matchedIssuer = issuer;
        break;
      }
    }

    // Năm cấp
    const yearMatch = line.match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : undefined;

    // Nếu dòng có độ dài hợp lý và có cấu trúc chứng chỉ
    if (line.length >= 5 && (matchedIssuer || /chứng chỉ|certificate|giải|award/i.test(line))) {
      const cleanTitle = line
        .replace(/^[\-*•\d.]\s*/, '')
        .replace(/\s*\(?(?:20\d{2})\)?\s*$/, '')
        .trim();

      if (cleanTitle) {
        certs.push({
          title: cleanTitle,
          issuer: matchedIssuer || 'Tổ chức cấp',
          year
        });
      }
    }
  }

  return certs;
}

/**
 * Tính điểm độ tin cậy bóc tách (Confidence Score: 0 - 100%)
 */
export function calculateConfidenceScore(
  personalInfo: ParsedPersonalInfo,
  education: ParsedEducation,
  skills: string[],
  projects: ParsedProject[]
): number {
  let score = 0;
  if (personalInfo.fullName) score += 20;
  if (personalInfo.email) score += 15;
  if (personalInfo.phone) score += 10;
  if (education.university) score += 15;
  if (education.major) score += 10;
  if (education.gpa) score += 10;
  if (skills.length > 0) score += 10;
  if (projects.length > 0) score += 10;
  return Math.min(score, 100);
}

/**
 * Bóc tách toàn diện chuỗi văn bản CV thô
 */
export function parseCvText(text: string): ParsedCvData {
  if (!text || typeof text !== 'string') {
    return {
      personalInfo: {},
      education: {},
      skills: [],
      projects: [],
      certificates: [],
      rawTextLength: 0,
      confidenceScore: 0
    };
  }

  const { personalInfo, education } = parseContactAndEducation(text);
  const skills = parseSkills(text);
  const projects = parseProjects(text);
  const certificates = parseCertificates(text);
  const confidenceScore = calculateConfidenceScore(personalInfo, education, skills, projects);

  return {
    personalInfo,
    education,
    skills,
    projects,
    certificates,
    rawTextLength: text.length,
    confidenceScore
  };
}

/**
 * Đọc và bóc tách từ File CV tải lên (.txt, .docx, .pdf, .json)
 */
export async function parseCvFile(file: File): Promise<ParsedCvData> {
  if (!file) {
    throw new Error('Vui lòng chọn một tệp CV hợp lệ.');
  }

  let textContent = '';
  if (typeof file.text === 'function') {
    textContent = await file.text();
  } else if (typeof FileReader !== 'undefined') {
    textContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error('Lỗi khi đọc tệp tin từ thiết bị.'));
      reader.readAsText(file);
    });
  } else if (typeof (file as any).arrayBuffer === 'function') {
    const arrayBuffer = await (file as any).arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    textContent = decoder.decode(arrayBuffer);
  }

  // Làm sạch các ký tự nhị phân nếu có (đặc biệt khi đọc stream pdf/docx thô)
  const cleanedText = textContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
  return parseCvText(cleanedText);
}

/**
 * Tự động điền dữ liệu bóc tách vào Hồ Sơ Cá Nhân (student_profiles, projects, certificates)
 */
export async function populateProfileWithParsedData(
  parsedData: ParsedCvData,
  options: ProfileAutoPopulateOptions,
  userId?: string
): Promise<ProfilePopulateResult> {
  const result: ProfilePopulateResult = {
    success: false,
    updatedProfileFields: [],
    createdProjectsCount: 0,
    createdCertificatesCount: 0,
    message: ''
  };

  if (!userId) {
    result.message = 'Không tìm thấy ID người dùng đăng nhập.';
    return result;
  }

  try {
    // 1. Lấy dữ liệu hồ sơ hiện tại từ DB
    const { data: currentProfile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const isOverwrite = options.mode === 'overwrite';
    const profileUpdates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    // Helper kiểm tra ghi đè hoặc chỉ điền khi ô trống
    const shouldUpdateField = (currentVal: any, newVal: any) => {
      if (!newVal) return false;
      if (isOverwrite) return true;
      return currentVal === undefined || currentVal === null || currentVal === '';
    };

    // Cập nhật Full Name
    if (shouldUpdateField(currentProfile?.full_name, parsedData.personalInfo.fullName)) {
      profileUpdates.full_name = parsedData.personalInfo.fullName;
      result.updatedProfileFields.push('Họ và tên');
    }

    // Cập nhật Trường ĐH
    if (shouldUpdateField(currentProfile?.university, parsedData.education.university)) {
      profileUpdates.university = parsedData.education.university;
      result.updatedProfileFields.push('Trường Đại học');
    }

    // Cập nhật Chuyên ngành
    if (shouldUpdateField(currentProfile?.major, parsedData.education.major)) {
      profileUpdates.major = parsedData.education.major;
      result.updatedProfileFields.push('Chuyên ngành');
    }

    // Cập nhật Điểm GPA
    if (shouldUpdateField(currentProfile?.gpa, parsedData.education.gpa)) {
      profileUpdates.gpa = parsedData.education.gpa;
      result.updatedProfileFields.push('Điểm GPA');
    }

    // Cập nhật Bio
    if (shouldUpdateField(currentProfile?.bio, parsedData.personalInfo.bio)) {
      profileUpdates.bio = parsedData.personalInfo.bio;
      result.updatedProfileFields.push('Giới thiệu bản thân');
    }

    // Cập nhật Kỹ năng (Merge hoặc Overwrite)
    if (parsedData.skills && parsedData.skills.length > 0) {
      if (isOverwrite) {
        profileUpdates.skills = parsedData.skills;
        result.updatedProfileFields.push('Kỹ năng');
      } else {
        const existingSkills: string[] = currentProfile?.skills || [];
        const mergedSkills = Array.from(new Set([...existingSkills, ...parsedData.skills]));
        if (mergedSkills.length > existingSkills.length) {
          profileUpdates.skills = mergedSkills;
          result.updatedProfileFields.push('Kỹ năng');
        }
      }
    }

    // Lưu vào student_profiles
    if (Object.keys(profileUpdates).length > 1) { // Lớn hơn 1 vì có updated_at
      if (currentProfile) {
        await supabase
          .from('student_profiles')
          .update(profileUpdates)
          .eq('id', userId);
      } else {
        await supabase
          .from('student_profiles')
          .insert([{ id: userId, ...profileUpdates }]);
      }
    }

    // 2. Tạo Đồ Án mới nếu được chọn
    if (options.includeProjects && parsedData.projects && parsedData.projects.length > 0) {
      // Lấy danh sách đồ án hiện có để tránh trùng tên
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('title')
        .eq('student_id', userId);

      const existingTitles = new Set((existingProjects || []).map((p: any) => p.title.toLowerCase().trim()));

      for (const proj of parsedData.projects) {
        if (!isOverwrite && existingTitles.has(proj.title.toLowerCase().trim())) {
          continue; // Bỏ qua nếu đã tồn tại và đang ở chế độ merge
        }

        const projectPayload = {
          student_id: userId,
          title: proj.title,
          project_type: 'Dự án thực tế (Từ CV)',
          description: proj.description || proj.title,
          role: proj.role || 'Lập trình viên',
          team_size: '1 thành viên',
          tags: proj.tags && proj.tags.length > 0 ? proj.tags : ['Fullstack'],
          image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=60',
          demo_url: proj.demo_url || null,
          github_url: proj.github_url || null,
          is_verified: true,
          verification_status: 'verified'
        };

        const { error: projError } = await supabase.from('projects').insert([projectPayload]);
        if (!projError) {
          result.createdProjectsCount++;
          existingTitles.add(proj.title.toLowerCase().trim());
        }
      }
    }

    // 3. Tạo Chứng chỉ mới nếu được chọn
    if (options.includeCertificates && parsedData.certificates && parsedData.certificates.length > 0) {
      const { data: existingCerts } = await supabase
        .from('certificates')
        .select('title')
        .eq('user_id', userId);

      const existingCertTitles = new Set((existingCerts || []).map((c: any) => c.title.toLowerCase().trim()));

      for (const cert of parsedData.certificates) {
        if (!isOverwrite && existingCertTitles.has(cert.title.toLowerCase().trim())) {
          continue;
        }

        const certPayload = {
          user_id: userId,
          title: cert.title,
          issuer: cert.issuer || 'Tổ chức cấp',
          category: 'Kỹ năng & Chuyên môn',
          date_awarded: cert.year ? `${cert.year}-01-01` : new Date().toISOString().split('T')[0],
          rank: 'Đạt chuẩn',
          description: `Chứng chỉ ${cert.title} được trích xuất từ CV.`,
          is_featured: false
        };

        const { error: certError } = await supabase.from('certificates').insert([certPayload]);
        if (!certError) {
          result.createdCertificatesCount++;
          existingCertTitles.add(cert.title.toLowerCase().trim());
        }
      }
    }

    // 4. Phát sự kiện cập nhật để các component lắng nghe và re-render tức thì 0ms
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('profilehub_profile_updated', {
        detail: { userId, result }
      }));
      window.dispatchEvent(new Event('storage'));
    }

    result.success = true;
    result.message = `Đã cập nhật thành công ${result.updatedProfileFields.length} thông tin cá nhân, thêm ${result.createdProjectsCount} đồ án và ${result.createdCertificatesCount} chứng chỉ!`;
    return result;
  } catch (error) {
    result.message = 'Lỗi trong quá trình cập nhật hồ sơ: ' + (error as Error).message;
    return result;
  }
}

export const cvParserService = {
  parseContactAndEducation,
  parseSkills,
  extractUrls,
  parseProjects,
  parseCertificates,
  calculateConfidenceScore,
  parseCvText,
  parseCvFile,
  populateProfileWithParsedData
};
