/**
 * ImportCvToProfileModal
 * Modal thông minh tiếp nhận CV (Tải file hoặc Dán văn bản thô),
 * bóc tách dữ liệu tức thì, cung cấp bảng đối soát 2 cột
 * và tự động điền vào Hồ Sơ Cá Nhân (Master Profile).
 * File: src/components/student/ImportCvToProfileModal.tsx
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import {
  parseCvText,
  parseCvFile,
  populateProfileWithParsedData
} from '../../services/cvParserService';
import type {
  ParsedCvData,
  ParsedProject,
  ParsedCertificate,
  ProfileAutoPopulateOptions
} from '../../types/cvParser.types';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Github,
  Globe,
  Trash2,
  Plus,
  RefreshCw,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  Sliders,
  Check
} from 'lucide-react';

export interface ImportCvToProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const SAMPLE_CV_TEXT = `CURRICULUM VITAE
NGUYỄN VĂN AN
Vị trí ứng tuyển: Frontend Developer
Email: an.nguyen.dev@gmail.com | Phone: 0908 123 456
Địa chỉ: TP. Hồ Chí Minh

GIỚI THIỆU BẢN THÂN
Lập trình viên Frontend với nền tảng vững chắc về React, TypeScript và tư duy thiết kế hệ thống hướng người dùng.

HỌC VẤN
Trường Đại học Bách Khoa - ĐHQG TP.HCM
Chuyên ngành: Kỹ thuật phần mềm
GPA: 3.65/4.0
Niên khóa: 2021 - 2025

KỸ NĂNG CHUYÊN MÔN
- Frontend: ReactJS, TypeScript, Tailwind CSS, Next.js, Redux
- Backend & Cloud: Node.js, PostgreSQL, Docker, Supabase, Git
- Công cụ: Figma, Postman, Vitest

DỰ ÁN TIÊU BIỂU
1. ProfileHub - Nền Tảng Bằng Chứng Năng Lực
Vai trò: Tech Lead / Frontend Engineer
Mô tả: Nền tảng tuyển dụng sinh viên IT dựa trên bằng chứng và bảo chứng năng lực thực chiến.
Mã nguồn: https://github.com/profilehub/frontend
Sản phẩm thực tế: https://profilehub-demo.vercel.app

2. E-Commerce Platform
Vai trò: Fullstack Developer
Mô tả: Hệ thống thương mại điện tử với tính năng thanh toán VNPay và giỏ hàng thời gian thực.
Mã nguồn: https://github.com/annguyen/shop-online
Live Demo: https://shop-online.netlify.app

CHỨNG CHỈ & GIẢI THƯỞNG
- AWS Certified Cloud Practitioner (2024)
- IELTS 7.0 (2023)
- Giải Nhì Cuộc Thi Lập Trình Hackathon Sinh Viên 2024`;

export default function ImportCvToProfileModal({
  isOpen,
  onClose,
  onProfileUpdated
}: ImportCvToProfileModalProps) {
  const { user } = useAuth();

  // Navigation steps: 'input' -> 'review' -> 'success'
  const [step, setStep] = useState<'input' | 'review' | 'success'>('input');
  const [inputTab, setInputTab] = useState<'file' | 'paste'>('file');

  // Input states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Review states (Editable parsed data)
  const [parsedData, setParsedData] = useState<ParsedCvData | null>(null);
  const [editablePersonalInfo, setEditablePersonalInfo] = useState<any>({});
  const [editableEducation, setEditableEducation] = useState<any>({});
  const [editableSkills, setEditableSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [editableProjects, setEditableProjects] = useState<ParsedProject[]>([]);
  const [editableCertificates, setEditableCertificates] = useState<ParsedCertificate[]>([]);

  // Population options
  const [populateMode, setPopulateMode] = useState<'merge' | 'overwrite'>('merge');
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeCertificates, setIncludeCertificates] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset modal on open
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setInputTab('file');
      setSelectedFile(null);
      setRawText('');
      setParseError(null);
      setIsParsing(false);
      setIsSubmitting(false);
      setSubmitResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // File drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setParseError(null);
  };

  // Trigger parsing engine
  const handleStartParsing = async () => {
    setParseError(null);
    setIsParsing(true);

    try {
      let data: ParsedCvData;
      if (inputTab === 'file') {
        if (!selectedFile) {
          throw new Error('Vui lòng chọn hoặc kéo thả tệp CV của bạn.');
        }
        data = await parseCvFile(selectedFile);
      } else {
        if (!rawText.trim()) {
          throw new Error('Vui lòng dán nội dung văn bản CV vào ô bên dưới.');
        }
        data = parseCvText(rawText);
      }

      setParsedData(data);
      setEditablePersonalInfo({ ...data.personalInfo });
      setEditableEducation({ ...data.education });
      setEditableSkills([...data.skills]);
      setEditableProjects([...data.projects]);
      setEditableCertificates([...data.certificates]);
      setStep('review');
    } catch (err) {
      setParseError((err as Error).message);
    } finally {
      setIsParsing(false);
    }
  };

  // Quick fill with Sample CV
  const handleUseSampleCv = () => {
    setInputTab('paste');
    setRawText(SAMPLE_CV_TEXT);
    setParseError(null);
  };

  // Skill management in review board
  const handleRemoveSkill = (skillToRemove: string) => {
    setEditableSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !editableSkills.includes(clean)) {
      setEditableSkills(prev => [...prev, clean]);
      setNewSkillInput('');
    }
  };

  // Project management in review board
  const handleRemoveProject = (index: number) => {
    setEditableProjects(prev => prev.filter((_, i) => i !== index));
  };

  // Certificate management
  const handleRemoveCertificate = (index: number) => {
    setEditableCertificates(prev => prev.filter((_, i) => i !== index));
  };

  // Final confirmation: Populate Profile
  const handleConfirmPopulate = async () => {
    if (!user?.id) {
      setParseError('Bạn cần đăng nhập để lưu thông tin vào hồ sơ cá nhân.');
      return;
    }

    setIsSubmitting(true);
    setParseError(null);

    try {
      const finalParsedData: ParsedCvData = {
        personalInfo: editablePersonalInfo,
        education: editableEducation,
        skills: editableSkills,
        projects: editableProjects,
        certificates: editableCertificates,
        rawTextLength: parsedData?.rawTextLength || 0,
        confidenceScore: parsedData?.confidenceScore || 0
      };

      const options: ProfileAutoPopulateOptions = {
        mode: populateMode,
        includeProjects,
        includeCertificates
      };

      const result = await populateProfileWithParsedData(finalParsedData, options, user.id);

      if (result.success) {
        setSubmitResult(result);
        setStep('success');
        if (onProfileUpdated) {
          onProfileUpdated();
        }
      } else {
        setParseError(result.message);
      }
    } catch (err) {
      setParseError('Lỗi cập nhật hồ sơ: ' + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-[#111726] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/50 dark:from-purple-950/20 dark:via-[#111726] dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles size={20} className="text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Quét CV Tự Động Điền Hồ Sơ
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ⚡ 3 Giây Bóc Tách
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trích xuất thông tin cá nhân, học vấn, kỹ năng và đồ án có liên kết Demo/GitHub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: INPUT CV (FILE UPLOAD OR RAW PASTE) */}
          {step === 'input' && (
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center justify-between">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setInputTab('file')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                      inputTab === 'file'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Upload size={14} />
                    <span>Tải Lên Tệp CV (.pdf, .docx, .txt)</span>
                  </button>
                  <button
                    onClick={() => setInputTab('paste')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                      inputTab === 'paste'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FileText size={14} />
                    <span>Dán Nội Dung Văn Bản (Raw Paste)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleUseSampleCv}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Dùng CV mẫu để kiểm tra thử</span>
                </button>
              </div>

              {/* Tab 1: File Upload */}
              {inputTab === 'file' ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : selectedFile
                      ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.json,.md"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Kích thước: {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Chọn tệp tin khác
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Upload size={28} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Kéo & thả tệp tin CV vào đây, hoặc{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            Duyệt file từ máy tính
                          </button>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Hỗ trợ: PDF, DOCX, TXT, Markdown (Tối đa 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 2: Raw Text Paste */
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Nội dung văn bản CV (Copy từ PDF/Notion/Word):</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {rawText.length} ký tự
                    </span>
                  </label>
                  <textarea
                    rows={12}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Dán toàn bộ nội dung CV của bạn vào đây (Bao gồm Họ tên, Học vấn, Kỹ năng, Đồ án, Link GitHub...)"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none"
                  />
                </div>
              )}

              {/* Error Banner */}
              {parseError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleStartParsing}
                  disabled={isParsing || (inputTab === 'file' ? !selectedFile : !rawText.trim())}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isParsing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Đang bóc tách thông minh...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-300" />
                      <span>Bắt Đầu Quét CV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW BOARD (2-COLUMN COMPARISON & EDITING) */}
          {step === 'review' && (
            <div className="space-y-6">
              {/* Confidence Score Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {parsedData?.confidenceScore || 0}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Độ Hoàn Thiện Bóc Tách: {parsedData?.confidenceScore || 0}% -{' '}
                      {(parsedData?.confidenceScore || 0) >= 80
                        ? 'Rất Xuất Sắc!'
                        : 'Đầy đủ thông tin cơ bản'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Hãy kiểm tra và chỉnh sửa nhanh các ô bên dưới trước khi đồng bộ vào hồ sơ.
                    </p>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="populateMode"
                      value="merge"
                      checked={populateMode === 'merge'}
                      onChange={() => setPopulateMode('merge')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>Hợp nhất (Bảo vệ thông tin cũ)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="populateMode"
                      value="overwrite"
                      checked={populateMode === 'overwrite'}
                      onChange={() => setPopulateMode('overwrite')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>Ghi đè toàn bộ</span>
                  </label>
                </div>
              </div>

              {/* 2-Column Review Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Thông tin cá nhân & Học vấn */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <GraduationCap size={16} className="text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      1. Thông Tin Cá Nhân & Học Vấn
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={editablePersonalInfo.fullName || ''}
                        onChange={(e) =>
                          setEditablePersonalInfo({ ...editablePersonalInfo, fullName: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editablePersonalInfo.email || ''}
                          onChange={(e) =>
                            setEditablePersonalInfo({ ...editablePersonalInfo, email: e.target.value })
                          }
                          placeholder="example@gmail.com"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          value={editablePersonalInfo.phone || ''}
                          onChange={(e) =>
                            setEditablePersonalInfo({ ...editablePersonalInfo, phone: e.target.value })
                          }
                          placeholder="0901234567"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Vị trí ứng tuyển
                        </label>
                        <input
                          type="text"
                          value={editablePersonalInfo.targetRole || ''}
                          onChange={(e) =>
                            setEditablePersonalInfo({
                              ...editablePersonalInfo,
                              targetRole: e.target.value
                            })
                          }
                          placeholder="Frontend Developer"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Địa điểm / Nơi ở
                        </label>
                        <input
                          type="text"
                          value={editablePersonalInfo.location || ''}
                          onChange={(e) =>
                            setEditablePersonalInfo({
                              ...editablePersonalInfo,
                              location: e.target.value
                            })
                          }
                          placeholder="TP. Hồ Chí Minh"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Trường Đại học
                      </label>
                      <input
                        type="text"
                        value={editableEducation.university || ''}
                        onChange={(e) =>
                          setEditableEducation({ ...editableEducation, university: e.target.value })
                        }
                        placeholder="Đại học Bách Khoa"
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Chuyên ngành
                        </label>
                        <input
                          type="text"
                          value={editableEducation.major || ''}
                          onChange={(e) =>
                            setEditableEducation({ ...editableEducation, major: e.target.value })
                          }
                          placeholder="Kỹ thuật phần mềm"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Điểm GPA
                        </label>
                        <input
                          type="text"
                          value={editableEducation.gpa || ''}
                          onChange={(e) =>
                            setEditableEducation({ ...editableEducation, gpa: e.target.value })
                          }
                          placeholder="3.65/4.0"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        rows={2}
                        value={editablePersonalInfo.bio || ''}
                        onChange={(e) =>
                          setEditablePersonalInfo({ ...editablePersonalInfo, bio: e.target.value })
                        }
                        placeholder="Mục tiêu và tóm tắt nghề nghiệp..."
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Kỹ năng, Đồ án & Chứng chỉ */}
                <div className="space-y-4">
                  {/* Skills Section */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          2. Kỹ Năng ({editableSkills.length})
                        </h3>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-h-32 overflow-y-auto p-1">
                      {editableSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-purple-900 dark:hover:text-purple-100 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add new skill */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Thêm kỹ năng khác (Enter để thêm)..."
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          3. Đồ Án Thực Tế ({editableProjects.length})
                        </h3>
                      </div>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeProjects}
                          onChange={(e) => setIncludeProjects(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>Đồng bộ vào kho đồ án</span>
                      </label>
                    </div>

                    <div className="space-y-2 mt-2.5 max-h-44 overflow-y-auto pr-1">
                      {editableProjects.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Không tìm thấy đồ án trong CV.</p>
                      ) : (
                        editableProjects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {proj.title}
                              </h5>
                              <button
                                type="button"
                                onClick={() => handleRemoveProject(idx)}
                                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Xóa đồ án này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Vai trò: <span className="font-semibold">{proj.role}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {proj.github_url && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                  <Github size={10} />
                                  <span className="truncate max-w-[150px]">{proj.github_url}</span>
                                </span>
                              )}
                              {proj.demo_url && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                  <Globe size={10} />
                                  <span>Demo Ready</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-amber-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          4. Chứng Chỉ ({editableCertificates.length})
                        </h3>
                      </div>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeCertificates}
                          onChange={(e) => setIncludeCertificates(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>Lưu vào chứng chỉ</span>
                      </label>
                    </div>

                    <div className="space-y-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
                      {editableCertificates.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Không tìm thấy chứng chỉ trong CV.</p>
                      ) : (
                        editableCertificates.map((cert, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {cert.title} ({cert.issuer})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCertificate(idx)}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Step Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  ← Quét lại CV khác
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPopulate}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Đang cập nhật hồ sơ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-300" />
                      <span>✨ Cập Nhật Vào Hồ Sơ Cá Nhân</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CELEBRATION / SUCCESS */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Đã Điền Thành Công Vào Hồ Sơ Cá Nhân!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {submitResult?.message ||
                    'Dữ liệu từ CV đã được tự động chuẩn hóa và cập nhật vào trang Hồ Sơ Cá Nhân.'}
                </p>
              </div>

              {/* Summary Stats Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
                  <Check size={14} />
                  <span>{submitResult?.updatedProfileFields?.length || 0} Trường hồ sơ cá nhân</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <Check size={14} />
                  <span>{submitResult?.createdProjectsCount || 0} Đồ án (Demo Ready)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                  <Check size={14} />
                  <span>{submitResult?.createdCertificatesCount || 0} Chứng chỉ</span>
                </span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Đóng & Xem Hồ Sơ Ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
