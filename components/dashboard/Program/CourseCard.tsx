import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

// ─── EXACT FIELD MAP: UI Label → API Response Path ────────────────────────────────
const FIELD_MAP: Record<string, string> = {
    University: "university.name",
    "Website URL": "university.website",
    "Study Level": "level",
    "Entry Requirements": "metaInfo.EntryRequirement",
    "TOEFL Score": "requirements.ToeflScore",
    "PTE No Band Less Than": "requirements.PteNoSectionLessThan",
    "GRE Score": "requirements.GreScore",
    "Application Fee": "applicationFee",
    "Scholarship Detail": "metaInfo.ScholarshipDeatil",
    "ESL/ELP Detail": "metaInfo.EnglishMarks12Score",
    "Program Name": "name",
    Campus: "metaInfo.campus",
    Duration: "duration",
    "IELTS Score": "requirements.Ielts",
    "TOEFL No Band Less Than": "requirements.ToeflNoSectionLessThan",
    "SAT Score": "requirements.SatScore",
    "GMAT Score": "requirements.GmatScore",
    "Yearly Tuition Fee": "tuitionFee",
    Deposit: "metaInfo.initialDeposit",
    "Backlog Range": "metaInfo.backlog",
    Concentration: "subject.name",
    Country: "country.name",
    "Open Intakes": "metaInfo.Intakes",
    "Intake Year": "intakeYear",
    "IELTS No Band Less Than": "requirements.IeltsNoBandLessThan",
    "PTE Score": "requirements.PteScore",
    "DET Score": "requirements.DETScore",
    "ACT Score": "requirements.ActScore",
    "Application Deadline": "metaInfo.deadline",
    "Scholarship Available": "metaInfo.ScholarshipAvailable",
    "Average Scholarship": "metaInfo.AverageScholarship",
    Remarks: "metaInfo.Remarks",
    "Application Mode": "studyMode",
    "English Proficiency Exam Waiver": "metaInfo.WithoutEnglishProficiency",
    "University Ranking": "university.ranking",
};

/**
 * Safely resolves a dot-notation path against a course object.
 * Returns BLANK STRING if data is missing (per requirement).
 */
function resolveField(course: any, path: string): string {
    const keys = path.split(".");
    let current: any = course;

    for (const key of keys) {
        if (current == null || typeof current !== "object") return "";
        current = current[key];
    }

    if (current == null || current === "" || current === undefined) return "";
    if (typeof current === "boolean") return current ? "Yes" : "No";
    if (typeof current === "number") return current.toLocaleString();
    return String(current);
}

export const downloadPDF = (selectedProgram: any[], selectedFields: string[] = []) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    const colors = {
        primary: [51, 51, 51], accent: [242, 109, 68], textDark: [34, 34, 34],
        textMedium: [100, 100, 100], textLight: [150, 150, 150], bgLight: [255, 255, 255],
        white: [255, 255, 255], divider: [230, 230, 230],
    };

    if (!selectedProgram?.length) { alert("No program selected to generate PDF"); return; }

    const activeFields = selectedFields.filter((f) => FIELD_MAP[f]);
    if (!activeFields.length) { alert("Please select at least one field to download"); return; }

    const addPageWithHeader = (pageNumber: number) => {
        if (pageNumber > 1) doc.addPage();
        doc.setFillColor(...colors.primary); doc.rect(0, 0, pageWidth, 12, "F");
        doc.setFillColor(...colors.accent); doc.rect(0, 12, pageWidth, 2, "F");
        doc.setFontSize(10); doc.setTextColor(...colors.white); doc.setFont("helvetica", "bold");
        doc.text("Ooshas Global", margin, 8);
        return 20;
    };

    // ===== COVER PAGE =====
    let yPos = addPageWithHeader(1);
    doc.setFillColor(...colors.bgLight); doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, "F");
    doc.setFontSize(24); doc.setTextColor(...colors.textDark); doc.setFont("helvetica", "bold");
    doc.text("Your Shortlisted Programs", margin + 10, yPos + 15);
    doc.setFontSize(11); doc.setTextColor(...colors.textMedium); doc.setFont("helvetica", "normal");
    doc.text(`Total Programs: ${selectedProgram.length}`, margin + 10, yPos + 25);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin + 10, yPos + 32);
    yPos += 55;

    doc.setFontSize(13); doc.setTextColor(...colors.textDark); doc.setFont("helvetica", "bold");
    doc.text("Programs Overview", margin, yPos); yPos += 8;

    selectedProgram.forEach((prog, idx) => {
        if (yPos > pageHeight - 30) yPos = addPageWithHeader(2);
        const cardHeight = 22;
        doc.setFillColor(...colors.bgLight); doc.roundedRect(margin, yPos, contentWidth, cardHeight, 2, 2, "F");
        doc.setDrawColor(...colors.divider); doc.setLineWidth(0.3); doc.roundedRect(margin, yPos, contentWidth, cardHeight, 2, 2);
        doc.setFillColor(...colors.accent); doc.circle(margin + 6, yPos + 11, 5, "F");
        doc.setFontSize(10); doc.setTextColor(...colors.white); doc.setFont("helvetica", "bold");
        doc.text(String(idx + 1), margin + 6, yPos + 12, { align: "center" });
        doc.setFontSize(11); doc.setTextColor(...colors.textDark); doc.setFont("helvetica", "bold");
        doc.text(String(prog.name || ""), margin + 18, yPos + 9);
        doc.setFontSize(9); doc.setTextColor(...colors.textMedium); doc.setFont("helvetica", "normal");
        doc.text(String(prog.university?.name || ""), margin + 18, yPos + 15);
        doc.text(`${String(prog.university?.city || "")}, ${String(prog.university?.country || "")}`, margin + 18, yPos + 19);
        yPos += cardHeight + 5;
    });

    // ===== DETAILED PAGES - PROPER 2-COLUMN GRID =====
    selectedProgram.forEach((program, progIndex) => {
        yPos = addPageWithHeader(progIndex + 2);

        // Program header
        // ===== Program Header =====
        const headerHeight = 32;
        const headerPadding = 12;

        doc.setFillColor(...colors.primary);
        doc.roundedRect(
            margin,
            yPos,
            contentWidth,
            headerHeight,
            3,
            3,
            "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(...colors.white);

        // Equal left & right padding
        const titleWidth = contentWidth - (headerPadding * 2);

        const titleLines = doc.splitTextToSize(
            String(program.name || ""),
            titleWidth
        );

        const lineHeight = 6;
        const textHeight = titleLines.length * lineHeight;
        const textY = yPos + (headerHeight - textHeight) / 2 + 5;

        doc.text(
            titleLines,
            margin + headerPadding,
            textY
        );

        yPos += headerHeight + 8;

        // Grid Configuration
        const colGap = 8; // Gap between columns
        const colWidth = (contentWidth - colGap) / 2; // Two equal columns
        const labelWidth = 40; // Width for label
        const valueWidth = colWidth - labelWidth - 5; // Remaining width for value
        const rowHeight = 8; // Height of each row
        const rowSpacing = -2; // Space between rows

        let currentCol = 0;
        let currentRowY = yPos;

        activeFields.forEach((fieldLabel, index) => {
            // Calculate position
            const xPos = margin + (currentCol * (colWidth + colGap));

            // Check page break
            if (currentRowY + rowHeight > pageHeight - 20) {
                yPos = addPageWithHeader(progIndex + 2);
                currentRowY = yPos;
                currentCol = 0;
            }

            // Get value
            const value = resolveField(program, FIELD_MAP[fieldLabel]);

            // Draw background for even rows
            if (index % 2 === 0) {
                doc.setFillColor(...colors.bgLight);
                doc.roundedRect(xPos, currentRowY - 3, colWidth, rowHeight + 2, 1, 1, "F");
            }

            // Draw Label (Bold)
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...colors.textMedium);
            const truncatedLabel = fieldLabel.length > 25 ? fieldLabel.substring(0, 25) + "..." : fieldLabel;
            doc.text(truncatedLabel + ":", xPos + 2, currentRowY);

            // Draw Value (Normal) - with text wrapping if needed
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...colors.textDark);

            if (value && value.length > 0) {
                // Split long text to fit in available width
                const valueLines = doc.splitTextToSize(value, valueWidth);
                doc.text(valueLines, xPos + labelWidth, currentRowY);

                // Adjust row height if text wraps
                const actualRowHeight = Math.max(rowHeight, valueLines.length * 4);
                currentRowY += actualRowHeight + rowSpacing;
            } else {
                currentRowY += rowHeight + rowSpacing;
            }

            // Switch column
            currentCol++;
            if (currentCol >= 2) {
                currentCol = 0;
                // Only move to next row if we just finished column 1 (index 1, 3, 5...)
                // Y position already updated above
            }
        });

        yPos = currentRowY + 10;
    });

    // ===== FOOTER =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(...colors.divider); doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
        doc.setFontSize(7); doc.setTextColor(...colors.textLight); doc.setFont("helvetica", "normal");
        doc.text("Ooshas Global", margin, pageHeight - 7);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: "right" });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 7, { align: "center" });
    }

    const fileName = selectedProgram.length > 1
        ? `Shortlisted_Programs_${selectedProgram.length}.pdf`
        : `${String(selectedProgram[0].university?.name || "Program").replace(/[^a-z0-9]/gi, "_")}-Details.pdf`;
    doc.save(fileName);
};

export const downloadExcel = (selectedProgram: any[], selectedFields: string[] = []) => {
    if (!selectedProgram?.length) { 
        alert("No program selected to generate Excel"); 
        return; 
    }

    const activeFields = selectedFields.filter((f) => FIELD_MAP[f]);
    if (!activeFields.length) { 
        alert("Please select at least one field to download"); 
        return; 
    }

    // Prepare data rows
    const rows = selectedProgram.map((item, index) => {
        const row: Record<string, string | number> = { "S.No": index + 1 };
        activeFields.forEach((fieldLabel) => {
            row[fieldLabel] = resolveField(item, FIELD_MAP[fieldLabel]);
        });
        return row;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    const colWidths = [{ wch: 6 }]; // S.No column
    activeFields.forEach(() => colWidths.push({ wch: 30 })); // Data columns
    ws["!cols"] = colWidths;

    // Apply styling to header row
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    
    // Style all header cells
    for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (ws[cellAddress]) {
            ws[cellAddress].s = {
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
                fill: { fgColor: { rgb: "2F4F4F" } },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
    }

    // Style data cells
    for (let R = range.s.r + 1; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: { sz: 10 },
                    alignment: { horizontal: "left", vertical: "center", wrapText: true },
                    border: {
                        top: { style: "thin", color: { rgb: "CCCCCC" } },
                        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                        left: { style: "thin", color: { rgb: "CCCCCC" } },
                        right: { style: "thin", color: { rgb: "CCCCCC" } }
                    }
                };
            }
        }
    }

    // Freeze header row
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };

    // Auto-fit rows
    ws["!rows"] = [];
    for (let R = 0; R <= range.e.r; R++) {
        ws["!rows"][R] = { hpt: 20 }; // Row height
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Programs");

    // Generate file with proper MIME type
    const fileName = `SelectedPrograms_${new Date().getTime()}.xlsx`;
    
    // Write file with proper options
    XLSX.writeFile(wb, fileName, { 
        bookType: "xlsx", 
        bookSST: false, 
        type: "binary" 
    });
};