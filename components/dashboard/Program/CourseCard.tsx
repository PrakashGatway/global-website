import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";


export const downloadPDF = (selectedProgram) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Theme colors
    const colors = {
        primary: [51, 51, 51],
        accent: [242, 109, 68],
        textDark: [34, 34, 34],
        textMedium: [100, 100, 100],
        textLight: [150, 150, 150],
        bgLight: [245, 245, 245],
        bgWhite: [255, 255, 255],
        divider: [230, 230, 230],
        white: [255, 255, 255],
    };

    if (!selectedProgram || selectedProgram.length === 0) {
        alert('No program selected to generate PDF');
        return;
    }

    // ===== HELPER FUNCTIONS =====

    const addPageWithHeader = (pageNumber) => {
        if (pageNumber > 1) {
            doc.addPage();
        }

        // Header bar
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 12, 'F');

        // Accent line
        doc.setFillColor(...colors.accent);
        doc.rect(0, 12, pageWidth, 2, 'F');

        // Brand
        doc.setFontSize(10);
        doc.setTextColor(...colors.white);
        doc.setFont('helvetica', 'bold');
        doc.text('Ooshas Global', margin, 8);

        return 20;
    };

    const drawSectionTitle = (title, yPos) => {
        doc.setFontSize(14);
        doc.setTextColor(...colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin, yPos);

        // Underline
        doc.setDrawColor(...colors.accent);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos + 2, margin + 35, yPos + 2);

        return yPos + 8;
    };

    const drawDivider = (yPos) => {
        doc.setDrawColor(...colors.divider);
        doc.setLineWidth(0.3);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        return yPos + 5;
    };

    const drawKeyValue = (label, value, x, y, labelWidth) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.textMedium);
        doc.text(String(label), x, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.textDark);
        doc.text(String(value || 'N/A'), x + labelWidth, y);
    };

    const drawCard = (x, y, width, height, fill = true) => {
        if (fill) {
            doc.setFillColor(...colors.bgLight);
            doc.roundedRect(x, y, width, height, 2, 2, 'F');
        }
        doc.setDrawColor(...colors.divider);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, width, height, 2, 2);
    };

    // ===== COVER PAGE =====
    let yPos = addPageWithHeader(1);

    // Title section
    doc.setFillColor(...colors.bgLight);
    doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');

    doc.setFontSize(24);
    doc.setTextColor(...colors.textDark);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Shortlisted Programs', margin + 10, yPos + 15);

    doc.setFontSize(11);
    doc.setTextColor(...colors.textMedium);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Programs: ${selectedProgram.length}`, margin + 10, yPos + 25);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin + 10, yPos + 32);

    yPos += 55;

    // Program list summary
    doc.setFontSize(13);
    doc.setTextColor(...colors.textDark);
    doc.setFont('helvetica', 'bold');
    doc.text('Programs Overview', margin, yPos);
    yPos += 8;

    selectedProgram.forEach((prog, idx) => {
        // Check if we need a new page
        if (yPos > pageHeight - 30) {
            yPos = addPageWithHeader(2);
        }

        // Program card
        const cardHeight = 22;
        drawCard(margin, yPos, contentWidth, cardHeight, true);

        // Number badge
        doc.setFillColor(...colors.accent);
        doc.circle(margin + 6, yPos + 11, 5, 'F');

        doc.setFontSize(10);
        doc.setTextColor(...colors.white);
        doc.setFont('helvetica', 'bold');
        doc.text(String(idx + 1), margin + 6, yPos + 12, { align: 'center' });

        // Program name
        doc.setFontSize(11);
        doc.setTextColor(...colors.textDark);
        doc.setFont('helvetica', 'bold');
        const progName = String(prog.name || 'Program');
        doc.text(progName, margin + 18, yPos + 9);

        // University
        doc.setFontSize(9);
        doc.setTextColor(...colors.textMedium);
        doc.setFont('helvetica', 'normal');
        const uniName = String(prog.university?.name || 'University');
        doc.text(uniName, margin + 18, yPos + 15);

        // Location
        const location = `${String(prog.university?.city || '')}, ${String(prog.university?.country || '')}`;
        doc.text(location, margin + 18, yPos + 19);

        yPos += cardHeight + 5;
    });

    yPos += 5;

    // Instruction
    doc.setFontSize(10);
    doc.setTextColor(...colors.textMedium);
    doc.setFont('helvetica', 'italic');
    doc.text('Detailed information for each program follows on the next pages...', margin, yPos);

    // ===== DETAILED PAGES FOR EACH PROGRAM =====
    selectedProgram.forEach((program, progIndex) => {
        yPos = addPageWithHeader(progIndex + 2);

        // Program header card
        doc.setFillColor(...colors.primary);
        doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');

        doc.setFontSize(18);
        doc.setTextColor(...colors.white);
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(String(program.name || 'Program Name'), contentWidth - 10);
        doc.text(titleLines, margin + 8, yPos + 12);

        const headerBottomY = yPos + 12 + (titleLines.length * 6);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 220, 220);
        doc.text(`${String(program.university?.name || 'University')}`, margin + 8, headerBottomY + 5);

        doc.setTextColor(...colors.accent);
        doc.text(`${String(program.university?.city || '')}, ${String(program.university?.country || '')}`, margin + 8, headerBottomY + 10);

        yPos = headerBottomY + 25; // Increased from 18 to 25 for more spacing

        // Quick Info Grid
        yPos = drawSectionTitle('Quick Information', yPos);

        const quickInfo = [
            ['Study Mode', program.studyMode],
            ['Duration', program.duration],
            ['Level', program.level],
            ['Status', program.status],
            ['Category', program.category?.name],
            ['Currency', program.currency],
        ];

        const colWidth = contentWidth / 3;
        quickInfo.forEach((item, idx) => {
            if (idx % 3 === 0 && idx > 0) {
                yPos += 8;
            }
            const col = idx % 3;
            drawKeyValue(
                item[0] + ':',
                item[1],
                margin + (col * colWidth),
                yPos,
                25
            );
        });
        yPos += 12;

        // Financial Details
        yPos = drawDivider(yPos);
        yPos = drawSectionTitle('Financial Details', yPos);

        const financialInfo = [
            ['Tuition Fee', `${program.currency} ${program.tuitionFee?.toLocaleString() || 'N/A'}`],
            ['Application Fee', program.applicationFee ? `${program.currency} ${program.applicationFee}` : 'Waived'],
            ['Initial Deposit', program.metaInfo?.initialDeposit ? `${program.currency} ${program.metaInfo.initialDeposit}` : 'N/A'],
            ['Scholarship', program.metaInfo?.ScholarshipAvailable ? 'Available' : 'Not Available'],
        ];

        financialInfo.forEach((item, idx) => {
            const rowY = yPos + (idx * 7);
            if (idx % 2 === 0) {
                doc.setFillColor(...colors.bgLight);
                doc.roundedRect(margin, rowY - 4, contentWidth / 2 - 2, 7, 1, 1, 'F');
            }
            drawKeyValue(item[0], item[1], margin + 3, rowY, 30);
        });

        yPos += financialInfo.length * 7 + 5;

        // ===== PROGRAM DETAILS SECTION (Previous section) =====
        yPos = drawDivider(yPos);
        yPos = drawSectionTitle('Program Details', yPos);
        yPos += 5; // Spacing after title

        const details = [
            ['Campus', program.metaInfo?.campus],
            ['Open Intakes', program.metaInfo?.Intakes || program.university?.intakes?.join(', ')],
            ['Deadline', program.metaInfo?.intakeDeadline || program.metaInfo?.deadline || 'ASAP'],
            ['Backlog Allowed', program.metaInfo?.backlog || '0'],
            ['STEM Course', program.metaInfo?.IsStemCourse ? 'Yes' : 'No'],
            ['Internship', program.metaInfo?.InternshipAvailable ? 'Available' : 'Not Available'],
        ];

        details.forEach((item, idx) => {
            const rowY = yPos + (idx * 7);
            if (idx % 2 === 0) {
                doc.setFillColor(...colors.bgLight);
                doc.roundedRect(margin, rowY - 4, contentWidth / 2 - 2, 7, 1, 1, 'F');
            }
            drawKeyValue(item[0], item[1], margin + 3, rowY, 30);

            // Second column
            if (idx + 3 < details.length) {
                const item2 = details[idx + 3];
                if (idx % 2 === 1) {
                    doc.setFillColor(...colors.bgLight);
                    doc.roundedRect(margin + contentWidth / 2, rowY - 4, contentWidth / 2 - 4, 7, 1, 1, 'F');
                }
                drawKeyValue(item2[0], item2[1], margin + contentWidth / 2 + 3, rowY, 30);
            }
        });

        yPos += Math.ceil(details.length / 2) * 7 + 15; // Increased from 5 to 15 for proper spacing

        // ===== ENGLISH REQUIREMENTS SECTION =====
        yPos = drawDivider(yPos);
        yPos += 5; // Space after divider
        yPos = drawSectionTitle('English Requirements', yPos);
        yPos += 8; // Space after title

        const engReqs = [
            ['IELTS', `${program.requirements?.Ielts || 'N/A'} (No band < ${program.requirements?.IeltsNoBandLessThan || 'N/A'})`],
            ['PTE', `${program.requirements?.PteScore || 'N/A'} (No section < ${program.requirements?.PteNoSectionLessThan || 'N/A'})`],
            ['TOEFL', `${program.requirements?.ToeflScore || 'N/A'} (No section < ${program.requirements?.ToeflNoSectionLessThan || 'N/A'})`],
            ['DET', program.requirements?.DETScore || 'N/A'],
        ];

        engReqs.forEach((item, idx) => {
            const rowY = yPos + (idx * 9);

            // Draw card background for alternating rows
            if (idx % 2 === 0) {
                doc.setFillColor(...colors.bgLight);
                doc.roundedRect(margin, rowY - 3, contentWidth, 8, 1.5, 1.5, 'F');
            }

            // Label
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.textMedium);
            doc.text(String(item[0]), margin + 5, rowY + 3);

            // Value
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.textDark);
            doc.text(String(item[1]), margin + 35, rowY + 3);
        });

        yPos += engReqs.length * 9 + 10; // Space after English Requirements

        // ===== CHECK FOR PAGE BREAK BEFORE ENTRY REQUIREMENTS =====
        if (yPos > pageHeight - 50) {
            yPos = addPageWithHeader(progIndex + 2);
        }

        // ===== ENTRY REQUIREMENTS SECTION =====
        yPos = drawDivider(yPos);
        yPos += 5; // Space after divider
        yPos = drawSectionTitle('Entry Requirements', yPos);
        yPos += 8; // Space after title

        const entryReqs = [
            ['12th Grade', `${program.requirements?.EntryRequirementTwelfth || 'N/A'}%`],
            ['Work Exp', `${program.requirements?.WorkExp || '0'} years`],
            ['Without Maths', program.metaInfo?.WithoutMaths ? 'Allowed' : 'Required'],
            ['MOI Waiver', program.metaInfo?.IsMOIWaiver ? 'Available' : 'Not Available'],
        ];

        entryReqs.forEach((item, idx) => {
            const rowY = yPos + (idx * 7);

            // Alternate background
            if (idx % 2 === 0) {
                doc.setFillColor(...colors.bgLight);
                doc.roundedRect(margin, rowY - 3, contentWidth / 2 - 2, 7, 1, 1, 'F');
            }

            drawKeyValue(item[0], item[1], margin + 3, rowY, 25);
        });

        yPos += entryReqs.length * 7 + 10;





        // Documents Required
        if (program.docsRequired && program.docsRequired.length > 0) {
            yPos = drawDivider(yPos);
            yPos = drawSectionTitle('Required Documents', yPos);

            program.docsRequired.forEach((docItem, idx) => {
                const y = yPos + (idx * 5);
                doc.setFillColor(...colors.accent);
                doc.circle(margin + 2, y - 1, 1.5, 'F');

                doc.setFontSize(9);
                doc.setTextColor(...colors.textDark);
                doc.setFont('helvetica', 'normal');
                doc.text(String(docItem), margin + 7, y);
            });
        }
    });

    // ===== FOOTER ON ALL PAGES =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(...colors.divider);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        // Footer text
        doc.setFontSize(7);
        doc.setTextColor(...colors.textLight);
        doc.setFont('helvetica', 'normal');
        doc.text('Ooshas Global', margin, pageHeight - 7);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
    }

    // Save
    const fileName = selectedProgram.length > 1
        ? `Shortlisted_Programs_${selectedProgram.length}.pdf`
        : `${selectedProgram[0].university?.name || 'Program'}-Details.pdf`;

    doc.save(fileName.replace(/[^a-z0-9]/gi, '_'));
};


export const downloadExcel = (selectedProgram) => {
    if (!selectedProgram || selectedProgram.length === 0) {
      alert('No program selected to generate Excel');
      return;
    }

    const rows = selectedProgram.map((item, index) => ({
      // ===== BASIC INFO =====
      'S.No': index + 1,
      'Program Name': item.name || '',
      'Short Name': item.shortName || '',
      'Status': item.status || '',
      'Study Mode': item.studyMode || '',
      'Duration': item.duration || '',
      'Level': item.level || '',
      'Category': item.category?.name || '',

      // ===== UNIVERSITY INFO =====
      'University': item.university?.name || '',
      'City': item.university?.city || '',
      'Country': item.university?.country || '',
      'University Type': item.university?.uni_type || '',
      'Acceptance Rate (%)': item.university?.acceptanceRate || '',
      'Address': item.university?.address || '',

      // ===== FINANCIAL DETAILS =====
      'Currency': item.currency || '',
      'Tuition Fee': item.tuitionFee || '',
      'Application Fee': item.applicationFee || 0,
      'Initial Deposit': item.metaInfo?.initialDeposit || '',
      'Scholarship Available': item.metaInfo?.ScholarshipAvailable ? 'Yes' : 'No',
      'Avg Scholarship': item.metaInfo?.AverageScholarship || 'N/A',
      'Application Fee Waiver': item.metaInfo?.applicationFeeWaiver ? 'Yes' : 'No',

      // ===== INTAKE & DEADLINE =====
      'Open Intakes': item.metaInfo?.Intakes || item.university?.intakes?.join(', ') || '',
      'Application Deadline': item.metaInfo?.intakeDeadline || item.metaInfo?.deadline || 'ASAP',
      'Closed Intakes': item.metaInfo?.IntakesClosed || 'None',
      'Campus': item.metaInfo?.campus || '',

      // ===== ENGLISH REQUIREMENTS =====
      'IELTS Overall': item.requirements?.Ielts || 'N/A',
      'IELTS No Band Less Than': item.requirements?.IeltsNoBandLessThan || 'N/A',
      'PTE Overall': item.requirements?.PteScore || 'N/A',
      'PTE No Section Less Than': item.requirements?.PteNoSectionLessThan || 'N/A',
      'TOEFL iBT Overall': item.requirements?.ToeflScore || 'N/A',
      'TOEFL iBT No Section Less Than': item.requirements?.ToeflNoSectionLessThan || 'N/A',
      'DET Score': item.requirements?.DETScore || 'N/A',
      'English Marks (12th)': item.metaInfo?.EnglishMarks12Score || 'N/A',
      'Without English Proficiency': item.metaInfo?.WithoutEnglishProficiency ? 'Allowed' : 'Not Allowed',

      // ===== ENTRY REQUIREMENTS =====
      '12th Grade Requirement (%)': item.requirements?.EntryRequirementTwelfth || 'N/A',
      'Work Experience (Years)': item.requirements?.WorkExp || '0',
      'Backlog Allowed': item.metaInfo?.backlog || '0',
      'Without Maths': item.metaInfo?.WithoutMaths ? 'Allowed' : 'Required',
      'MOI Waiver': item.metaInfo?.IsMOIWaiver ? 'Available' : 'Not Available',
      'Detailed Entry Requirement': item.metaInfo?.EntryRequirement || '',

      // ===== PROGRAM FEATURES =====
      'STEM Course': item.metaInfo?.IsStemCourse ? 'Yes' : 'No',
      'Internship Available': item.metaInfo?.InternshipAvailable ? 'Yes' : 'No',
      'Documents Required': item.docsRequired?.join(', ') || '',


    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // ===== COLUMN WIDTHS =====
    const colWidths = [
      { wch: 6 },   // S.No
      { wch: 35 },  // Program Name
      { wch: 15 },  // Short Name
      { wch: 10 },  // Status
      { wch: 12 },  // Study Mode
      { wch: 12 },  // Duration
      { wch: 20 },  // Level
      { wch: 30 },  // Category
      { wch: 35 },  // University
      { wch: 15 },  // City
      { wch: 10 },  // Country
      { wch: 12 },  // University Type
      { wch: 12 },  // Acceptance Rate
      { wch: 40 },  // Address
      { wch: 10 },  // Currency
      { wch: 12 },  // Tuition Fee
      { wch: 12 },  // Application Fee
      { wch: 12 },  // Initial Deposit
      { wch: 15 },  // Scholarship
      { wch: 15 },  // Avg Scholarship
      { wch: 15 },  // Fee Waiver
      { wch: 15 },  // Open Intakes
      { wch: 15 },  // Deadline
      { wch: 20 },  // Closed Intakes
      { wch: 15 },  // Campus
      { wch: 12 },  // IELTS
      { wch: 15 },  // IELTS Band
      { wch: 12 },  // PTE
      { wch: 15 },  // PTE Section
      { wch: 12 },  // TOEFL
      { wch: 15 },  // TOEFL Section
      { wch: 12 },  // DET
      { wch: 15 },  // English Marks
      { wch: 18 },  // Without English
      { wch: 18 },  // 12th Grade
      { wch: 15 },  // Work Exp
      { wch: 12 },  // Backlog
      { wch: 15 },  // Without Maths
      { wch: 15 },  // MOI Waiver
      { wch: 50 },  // Detailed Entry Req
      { wch: 12 },  // STEM
      { wch: 15 },  // Internship
      { wch: 40 },  // Documents

    ];

    ws['!cols'] = colWidths;

    // ===== STYLING (Header Row) =====
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '333333' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        };
      }
    }

    // ===== FREEZE HEADER ROW =====
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Programs');

    // ===== SECOND SHEET: SUMMARY =====
    const summaryRows = selectedProgram.map((item, index) => ({
      'S.No': index + 1,
      'Program': item.name || '',
      'University': item.university?.name || '',
      'Location': `${item.university?.city || ''}, ${item.university?.country || ''}`,
      'Tuition Fee': `${item.currency || ''} ${item.tuitionFee?.toLocaleString() || ''}`,
      'Duration': item.duration || '',
      'Intakes': item.metaInfo?.Intakes || '',
      'Deadline': item.metaInfo?.intakeDeadline || item.metaInfo?.deadline || 'ASAP',
      'Scholarship': item.metaInfo?.ScholarshipAvailable ? 'Yes' : 'No',
      'STEM': item.metaInfo?.IsStemCourse ? 'Yes' : 'No',
    }));

    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    wsSummary['!cols'] = [
      { wch: 6 }, { wch: 35 }, { wch: 35 }, { wch: 20 },
      { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 12 }, { wch: 8 },
    ];

    // Style summary header
    const summaryRange = XLSX.utils.decode_range(wsSummary['!ref']);
    for (let C = summaryRange.s.c; C <= summaryRange.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (wsSummary[cellAddress]) {
        wsSummary[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: 'F26D44' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    XLSX.writeFile(wb, 'SelectedPrograms.xlsx');
  };