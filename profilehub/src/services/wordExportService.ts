import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  convertInchesToTwip,
  Header,
  Footer,
  PageNumber
} from 'docx';
import type { GeneratedCoverLetter } from './aiCoverLetterService';
import type { GeneratedOfferLetter } from './aiOfferLetterService';

export interface ExportCoverLetterWordOptions {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateLocation?: string;
  targetRole: string;
  letter: GeneratedCoverLetter;
  fileName?: string;
}

export interface ExportOfferLetterWordOptions {
  candidateName: string;
  companyName: string;
  jobTitle: string;
  letter: GeneratedOfferLetter;
  fileName?: string;
}

/**
 * Generates and triggers download of a standardized Microsoft Word (.docx) Cover Letter
 * formatted according to standard Vietnamese & International Business Correspondence.
 */
export async function downloadCoverLetterDocx(options: ExportCoverLetterWordOptions): Promise<void> {
  const {
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateLocation,
    targetRole,
    letter,
    fileName
  } = options;

  const contactItems: string[] = [];
  if (candidateEmail) contactItems.push(candidateEmail);
  if (candidatePhone) contactItems.push(candidatePhone);
  if (candidateLocation) contactItems.push(candidateLocation);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1), // 1 inch = 2.54 cm standard MS Word
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1)
            }
          }
        },
        children: [
          // Candidate Name (Bold, 20pt)
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: candidateName.toUpperCase(),
                bold: true,
                size: 32, // 16pt (half-points in docx)
                font: 'Times New Roman',
                color: '1E3A8A' // Deep Blue
              })
            ]
          }),

          // Target Role
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: targetRole,
                bold: true,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '2563EB' // Blue 600
              })
            ]
          }),

          // Contact line (Email | Phone | Location)
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            border: {
              bottom: {
                color: '2563EB',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 12
              }
            },
            children: [
              new TextRun({
                text: contactItems.join('  •  '),
                size: 20, // 10pt
                font: 'Times New Roman',
                color: '475569'
              })
            ]
          }),

          // Date line
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Ngày ${new Date().toLocaleDateString('vi-VN')}`,
                italics: true,
                size: 22, // 11pt
                font: 'Times New Roman',
                color: '64748B'
              })
            ]
          }),

          // Salutation
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: letter.salutation || 'Kính gửi Quý Nhà Tuyển Dụng / Ban Tuyển Dụng Công Ty,',
                bold: true,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '0F172A'
              })
            ]
          }),

          // Opening Paragraph
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 }, // 1.5 line height (360/240)
            children: [
              new TextRun({
                text: letter.opening,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Body Paragraph 1 (Evidence)
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: letter.bodyParagraph1,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Body Paragraph 2 (Value Proposition)
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: letter.bodyParagraph2,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Closing Paragraph
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 280, line: 360 },
            children: [
              new TextRun({
                text: letter.closing,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Signoff
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'Trân trọng cảm ơn,',
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '334155'
              })
            ]
          }),

          // Candidate signature name
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 160 },
            children: [
              new TextRun({
                text: candidateName,
                bold: true,
                size: 26, // 13pt
                font: 'Times New Roman',
                color: '0F172A'
              })
            ]
          })
        ]
      }
    ]
  });

  // Pack document to blob and trigger download
  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  
  const sanitizedName = candidateName.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  anchor.download = fileName || `Thu_Ung_Tuyen_${sanitizedName}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Generates and triggers download of a standardized Microsoft Word (.docx) Job Offer Letter
 */
export async function downloadOfferLetterDocx(options: ExportOfferLetterWordOptions): Promise<void> {
  const {
    candidateName,
    companyName,
    jobTitle,
    letter,
    fileName
  } = options;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1)
            }
          }
        },
        children: [
          // Company Title Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: companyName.toUpperCase(),
                bold: true,
                size: 26, // 13pt
                font: 'Times New Roman',
                color: '1E3A8A'
              })
            ]
          }),

          // Document Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'THƯ MỜI NHẬN VIỆC (JOB OFFER LETTER)',
                bold: true,
                size: 32, // 16pt
                font: 'Times New Roman',
                color: '0F172A'
              })
            ]
          }),

          // Date Line
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: letter.dateStr || `Ngày ${new Date().toLocaleDateString('vi-VN')}`,
                italics: true,
                size: 22,
                font: 'Times New Roman',
                color: '64748B'
              })
            ]
          }),

          // Salutation
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: letter.salutation,
                bold: true,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '0F172A'
              })
            ]
          }),

          // Opening
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 360 },
            children: [
              new TextRun({
                text: letter.opening,
                size: 24, // 12pt
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Section 1: Position Details
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 180, line: 340 },
            children: [
              new TextRun({
                text: letter.positionDetailsText,
                size: 24,
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Section 2: Compensation
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 180, line: 340 },
            children: [
              new TextRun({
                text: letter.compensationText,
                size: 24,
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Section 3: Benefits
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 180, line: 340 },
            children: [
              new TextRun({
                text: letter.benefitsText,
                size: 24,
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Section 4: Confidentiality
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 180, line: 340 },
            children: [
              new TextRun({
                text: letter.confidentialityText,
                size: 24,
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Section 5: Acceptance Deadline
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 340 },
            children: [
              new TextRun({
                text: letter.acceptanceDeadlineText,
                size: 24,
                font: 'Times New Roman',
                color: '1E293B'
              })
            ]
          }),

          // Closing
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: letter.closing,
                bold: true,
                size: 24,
                font: 'Times New Roman',
                color: '1E3A8A'
              })
            ]
          }),

          // Employer Sign-off
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'ĐẠI DIỆN CÔNG TY / BAN GIÁM ĐỐC NHÂN SỰ:',
                bold: true,
                size: 22,
                font: 'Times New Roman',
                color: '334155'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: letter.employerSignOffName,
                bold: true,
                size: 26,
                font: 'Times New Roman',
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: letter.employerSignOffTitle,
                italics: true,
                size: 22,
                font: 'Times New Roman',
                color: '64748B'
              })
            ]
          }),

          // Candidate Acceptance Section
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 120 },
            border: {
              top: {
                color: 'CBD5E1',
                space: 6,
                style: BorderStyle.SINGLE,
                size: 8
              }
            },
            children: [
              new TextRun({
                text: letter.candidateSignOffPrompt,
                size: 22,
                font: 'Times New Roman',
                color: '475569'
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;

  const sanitizedName = candidateName.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  anchor.download = fileName || `Thu_Moi_Nhan_Viec_${sanitizedName}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

