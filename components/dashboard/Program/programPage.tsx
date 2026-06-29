"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, MapPin, BookOpen, Calendar, DollarSign,
  GraduationCap, ChevronDown, Loader2, X, Check, ExternalLink,
  Award, Clock, Tag, Building2, Briefcase, FileText,
  MapPinCheck, Sparkles, Globe, Shield, TrendingUp,
  IndianRupeeIcon,
  Calendar1,
  Info,
  Trash2
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"
import Link from "next/link"
import { CreateApplicationModal } from "@/components/dashboard/applicationModel"
import { useSearchParams } from 'next/navigation';

import ProgramHeader from "./programHeader"
import ProgramFilters from "./programFilter"
import toast from "react-hot-toast"
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGlobal } from "@/src/statecontext"


// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface Course {
  _id: string
  name: string
  slug: string
  university: {
    _id: string
    name: string
    slug: string
    city: string
    country: string
    uni_logo: string
    intakes?: string[]
  }
  category: {
    _id: string
    name: string
    slug: string
  }
  subject: {
    _id: string
    name: string
    slug: string
  }
  studyMode: string
  shortName: string
  tuitionFee: number
  currency: string
  level: string
  tags: string[]
  applicationFee: number
  duration: string
  status: string
  description: string
  createdAt: string
}

export default function CoursesPage() {
  // State management
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isCleared, setIsCleared] = useState(false);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Filter options state
  const [countries, setCountries] = useState([])
  const [studyModes, setStudyModes] = useState([])
  const [levels, setLevels] = useState([])
  const [categories, setCategories] = useState([])
  const [universities, setUniversities] = useState([])
  const [selectedProgram, setselectedProgram] = useState([])
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showCompare,setshowCompare] = useState(false)

  const searchParams = useSearchParams();
  const university = searchParams.get('university') || ""

  const { profile } = useGlobal()




  // Filters state
  const [filters, setFilters] = useState({
    country: "",
    university: university || "",
    category: "",
    studyMode: "",
    level: "",
    minFee: "",
    maxFee: "",
    sort_by: "name",
    sort_order: "asc"
  })

  console.log(universities)

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [countriesRes, uniRes, catRes] = await Promise.all([
        axiosInstance.get('/countries?limit=300'),
        axiosInstance.get('/universities/flat'),
        axiosInstance.get('/courses/categories?limit=100')
      ])
      const countriesData = countriesRes.data.data
      setCountries(countriesData.map((c: any) => ({ label: c.name, value: c.code })))

      const uniData = uniRes.data.data
      setUniversities(uniData.map((u: any) => ({ label: u.name, value: u._id })))

      const catData = catRes.data.data
      setCategories(catData.map((c: any) => ({ label: c.name, value: c._id })))

      setStudyModes([
        { label: "Full Time", value: "Full-time" },
        { label: "Part Time", value: "Part-time" },
        { label: "Online", value: "Online" },
        { label: "Hybrid", value: "Hybrid" }
      ])
      setLevels([
        {
          label: "High School (11th - 12th)",
          value: "High School (11th - 12th)",
        },
        {
          label: "UG Diploma/ Certificate/ Associate Degree",
          value: "UG Diploma/ Certificate/ Associate Degree",
        },
        {
          label: "UG",
          value: "UG",
        },
        {
          label: "PG Diploma/Certificate",
          value: "PG Diploma/Certificate",
        },
        {
          label: "PG",
          value: "PG",
        },
        {
          label: "UG+PG (Accelerated) Degree",
          value: "UG+PG (Accelerated) Degree",
        },
        {
          label: "PhD",
          value: "PhD",
        },
        {
          label: "Short-term/Summer Programs",
          value: "Short-term/Summer Programs",
        },
        {
          label: "Pathway Programs (UG)",
          value: "Pathway Programs (UG)",
        },
        {
          label: "Pathway Programs (PG)",
          value: "Pathway Programs (PG)",
        },
        {
          label: "Semester Study Abroad",
          value: "Semester Study Abroad",
        },
        {
          label: "Twinning Programmes (UG)",
          value: "Twinning Programmes (UG)",
        },
        {
          label: "Twinning Programmes (PG)",
          value: "Twinning Programmes (PG)",
        },
        {
          label: "English Language Program",
          value: "English Language Program",
        },
        {
          label: "Online Programmes / Distance Learning",
          value: "Online Programmes / Distance Learning",
        },
        {
          label: "Hybrid",
          value: "Hybrid",
        },
        {
          label: "Grades Below 10th",
          value: "Grades Below 10th",
        },
      ]);
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }, [])

  console.log(selectedProgram)

  const downloadPDF = () => {
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


  const downloadExcel = () => {
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

  // Fetch courses with debounced search
  const fetchCourses = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        isExtra: 'false',
        limit: '12',
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(filters.country && { 'university.country': filters.country }),
        ...(filters.university && { university: filters.university }),
        ...(filters.category && { category: filters.category }),
        ...(filters.studyMode && { studyMode: filters.studyMode }),
        ...(filters.level && { level: filters.level }),
        ...(filters.sort_by && { sort_by: filters.sort_by }),
        ...(filters.sort_order && { sort_order: filters.sort_order })
      })

      const response = await axiosInstance.get(`/courses?${params}`)
      const data = response.data.result || response.data.data || []

      if (reset) {
        setCourses(data)
      } else {
        setCourses(prev => [...prev, ...data])
      }

      setHasMore(data.length === 12)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, debouncedSearchQuery, filters])

  // Initial fetch
  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])

  // Fetch on search/filter changes
  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchCourses(true)
  }, [debouncedSearchQuery, filters])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1)
          setLoadingMore(true)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loadingMore, loading])

  useEffect(() => {
    if (page > 1 && !loading) {
      fetchCourses(false)
    }
  }, [page, fetchCourses])

  // Filter handlers
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.country) count++
    if (filters.university) count++
    if (filters.category) count++
    if (filters.studyMode) count++
    if (filters.level) count++
    return count
  }

  const clearFilters = () => {
    setFilters({
      country: "",
      university: "",
      category: "",
      studyMode: "",
      level: "",
      minFee: "",
      maxFee: "",
      sort_by: "name",
      sort_order: "asc"
    })
    setSearchQuery("")
    setPage(1)
    setIsCleared(true)
  }



  const handleCompareSelect = (course) => {
    setselectedProgram((prev) => {
      const exists = prev.some((item) => item._id === course._id);

      if (exists) {
        return prev.filter((item) => item._id !== course._id);
      }

      if (prev.length >= 3) {
        toast.error("You can compare only 3 programs.");
        return prev;
      }

      return [...prev, course];
    });
  };

  


  return (
    <main className="flex-1    relative">



      <div className="space-y-4">

        {/* Hero Section */}

        <ProgramHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} countries={countries} course={courses} levels={levels} categories={categories} />

        {/* Search & Filter Bar */}
        {/* <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 z-1 -translate-y-1/2 w-5 h-5 text-gray-800" />
            <input
              type="text"
              placeholder="Search programs by name, university, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background/50 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

       
        </div> */}

        {/* Results Count */}
        {!loading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <p className="text-base text-gray-800">
              Found <span className="font-semibold text-foreground">{courses.length}</span> programs
            </p>
          </motion.div>
        )}

        {selectedProgram.length > 0 && (
          <div className="fixed bottom-0 left-100 z-50 bg-primary border w-210 p-4 shadow-lg flex items-center justify-between">
            <span className="font-medium text-white">
              {selectedProgram.length} Program(s) Selected
            </span>

            <div className="flex gap-3 text-white">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2 border rounded"
              >
                Compare
              </button>

              <button
                onClick={() => setShowDownloadModal(true)}
                className="px-4 py-2 border rounded"
              >
                Download
              </button>

              <button onClick={() => setselectedProgram([])} className="px-4 py-2 border rounded">
                Clear
              </button>
            </div>
          </div>
        )}


        {showDownloadModal && (
          <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b px-8 py-6">

                <h2 className="text-xl font-bold">
                  Download Selected Programs
                </h2>

                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="text-3xl"
                >
                  ×
                </button>

              </div>

              {/* Program List */}

              <div className="max-h-[420px] overflow-y-auto">

                {selectedProgram.map((program, index) => (
                  <div
                    key={program._id}
                    className="flex items-center justify-between px-8 py-6 border-b"
                  >

                    <div>

                      <h3 className="text-lg font-semibold text-orange-600">

                        {index + 1}. {program.name}

                      </h3>

                      <div className="mt-3 flex gap-8 text-gray-600 text-base">

                        <span>

                          🏫 {program.university.name}

                        </span>

                        <span>

                          📍 {program.university.country}

                        </span>

                      </div>

                    </div>

                    <button
                      onClick={() => {
                        setselectedProgram(prev => prev.filter(item => item._id !== program._id))
                      }}
                      className="text-orange-500 font-medium"
                    >

                      Remove

                    </button>

                  </div>
                ))}

              </div>

              {/* Footer */}

              <div className="flex items-center justify-between p-6">

                <button
                  onClick={() => setselectedProgram([])}
                  className="border text-base px-6 py-3 rounded-xl"
                >
                  Clear All
                </button>

                <div className="flex gap-4">

                  <button
                    onClick={downloadPDF}
                    className="bg-primary text-base px-6 py-3 rounded-xl text-white"
                  >
                    Download as PDF
                  </button>

                  <button
                    onClick={downloadExcel}
                    className="bg-primary text-base px-6 py-3 rounded-xl text-white"
                  >
                    Download as Excel
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}


        {showCompareModal && (
          <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

            <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b px-8 py-6">

                <h2 className="text-3xl font-bold">
                  Please select up to 5 programs to compare
                </h2>

                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-3xl"
                >
                  ×
                </button>

              </div>

              {/* Programs */}

              <div className="max-h-[420px] overflow-y-auto">

                {selectedProgram.map((program, index) => (

                  <div
                    key={program._id}
                    className="flex items-center justify-between px-8 py-6 border-b"
                  >

                    <div>

                      <h3 className="text-xl font-semibold text-primary">

                        {index + 1}. {program.name}

                      </h3>

                      <div className="flex gap-8 mt-3 text-gray-600">

                        <span>
                          🏫 {program.university?.name}
                        </span>

                        <span>
                          📍 {program.university?.country}
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        setselectedProgram((prev) =>
                          prev.filter((x) => x._id !== program._id)
                        )
                      }
                      className="text-red-500 font-medium"
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

              {/* Footer */}

              <div className="p-6">

                <button
                  onClick={()=>setshowCompare(true)}
                  className="w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white"
                >
                  Compare
                </button>

              </div>

            </div>

          </div>
        )}


        {showCompare && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Program Comparison</h2>
        <button
          onClick={() => setShowCompare(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-auto max-h-[calc(90vh-80px)]">
        <table className="w-full">
          <tbody>
            {/* Program Name */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-1/4">
                Program Name:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  <h3 className="text-lg font-semibold text-primary">
                    {program.name}
                  </h3>
                </td>
              ))}
            </tr>

            {/* University Details */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                University Details:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.university?.uni_logo ? (
                    <img
                      src={program.university.uni_logo}
                      alt={program.university.name}
                      className="h-12 mx-auto mb-2 object-contain"
                    />
                  ) : (
                    <div className="h-12 flex items-center justify-center mb-2">
                      <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  <p className="font-semibold text-gray-800">{program.university?.name}</p>
                </td>
              ))}
            </tr>

            {/* Website URL */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Website URL:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.slug ? (
                    <a
                      href={`https://www.example.com/${program.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      View Program Details
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Country */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Country:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{program.university?.city}, {program.university?.country}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Program Level */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Program Level:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.level}
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Duration:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.duration}
                </td>
              ))}
            </tr>

            {/* Intakes */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Intakes:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.metaInfo?.Intakes || program.university?.intakes?.join(', ') || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Standardized Requirements */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 align-top">
                Standardized Requirements:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 border-l border-gray-200 align-top">
                  <div className="text-left space-y-3">
                    {/* IELTS */}
                    {(program.requirements?.Ielts || program.requirements?.IeltsNoBandLessThan) && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">• IELTS</p>
                        <div className="ml-4 text-sm text-gray-600">
                          {program.requirements.IeltsNoBandLessThan && (
                            <p>No band less than {program.requirements.IeltsNoBandLessThan}</p>
                          )}
                          {program.requirements.Ielts && (
                            <p>Overall – {program.requirements.Ielts}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PTE */}
                    {(program.requirements?.PteScore || program.requirements?.PteNoSectionLessThan) && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">• PTE</p>
                        <div className="ml-4 text-sm text-gray-600">
                          {program.requirements.PteNoSectionLessThan && (
                            <p>No section less than {program.requirements.PteNoSectionLessThan}</p>
                          )}
                          {program.requirements.PteScore && (
                            <p>Overall – {program.requirements.PteScore}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TOEFL */}
                    {(program.requirements?.ToeflScore || program.requirements?.ToeflNoSectionLessThan) && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">• TOEFL iBT</p>
                        <div className="ml-4 text-sm text-gray-600">
                          {program.requirements.ToeflNoSectionLessThan && (
                            <p>No section less than {program.requirements.ToeflNoSectionLessThan}</p>
                          )}
                          {program.requirements.ToeflScore && (
                            <p>Overall – {program.requirements.ToeflScore}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DET */}
                    {program.requirements?.DETScore && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">• DET</p>
                        <div className="ml-4 text-sm text-gray-600">
                          <p>Overall – {program.requirements.DETScore}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Application Deadline */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Application Deadline:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.metaInfo?.intakeDeadline || program.metaInfo?.deadline || '-'}
                </td>
              ))}
            </tr>

            {/* Application Fee */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Application Fee:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.applicationFee ? (
                    <span>{program.currency} {program.applicationFee}</span>
                  ) : (
                    <span className="text-green-600 font-semibold">No Application Fee</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Program Tuition Fees */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Program Tuition Fees:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  <span className="font-semibold text-primary">
                    {program.currency} {program.tuitionFee?.toLocaleString()}
                  </span>
                </td>
              ))}
            </tr>

            {/* Study Mode */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Study Mode:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.studyMode}
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Category:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.category?.name || '-'}
                </td>
              ))}
            </tr>

            {/* Campus */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Campus:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.metaInfo?.campus || '-'}
                </td>
              ))}
            </tr>

            {/* Scholarship */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Scholarship:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.metaInfo?.ScholarshipAvailable ? (
                    <span className="text-green-600 font-semibold">✓ Available</span>
                  ) : (
                    <span className="text-gray-400">Not Available</span>
                  )}
                </td>
              ))}
            </tr>

            {/* STEM Course */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                STEM Course:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.metaInfo?.IsStemCourse ? (
                    <span className="text-green-600 font-semibold">✓ Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Backlog Allowed */}
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                Backlog Allowed:
              </td>
              {selectedProgram.map((program, index) => (
                <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
                  {program.metaInfo?.backlog || '0'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => setShowCompare(false)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
        >
          Close
        </button>
        <button
          onClick={() => {
            downloadPDF();
            setShowCompare(false);
          }}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <FileDown className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={() => {
            downloadExcel();
            setShowCompare(false);
          }}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download Excel
        </button>
      </div>
    </div>
  </div>
)}

        {/* Courses Grid */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* ================= LEFT SIDEBAR: FILTERS ================= */}
          <div className="sticky -top-260 self-start">
            <ProgramFilters
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              getActiveFilterCount={getActiveFilterCount}
              countries={countries}
              universities={universities}
              categories={categories}
              studyModes={studyModes}
              levels={levels}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              isCleared={isCleared}
              setIsCleared={setIsCleared}
            />
          </div>
          {/* ================= RIGHT CONTENT: COURSE GRID ================= */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {loading ? (
                // Compact Skeleton Loading
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-28 bg-gray-100 rounded"></div>
                          <div className="h-6 w-20 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 w-full bg-gray-100 rounded"></div>
                        <div className="h-6 w-6/4 bg-gray-100 rounded"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 bg-gray-100 rounded-lg"></div>
                        <div className="h-16 bg-gray-100 rounded-lg"></div>
                        <div className="h-16 bg-gray-100 rounded-lg"></div>
                      </div>
                      <div className="h-9 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                ))
              ) : courses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No programs found</h3>
                  <p className="text-gray-500 text-base">Try adjusting your search or filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 px-5 py-2 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/90 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                courses.map((course, index) => {

                  const metaInfo = course?.metaInfo || {};

                  const intakeDeadline = metaInfo?.intakeDeadline || "";

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const intakeData = intakeDeadline
                    ? intakeDeadline.split(",").map((item) => {
                      const [month, date] = item.split(":");

                      const [day, monthNo, year] = date.split("-");

                      const deadline = new Date(
                        Number(year),
                        Number(monthNo) - 1,
                        Number(day)
                      );

                      return {
                        month,
                        deadline,
                        deadlineText: date,
                        isClosed: deadline < today,
                      };
                    })
                    : [];

                  const openIntakes = intakeData.filter((item) => !item.isClosed);
                  const closedIntakes = intakeData.filter((item) => item.isClosed);

                  const monthOrder = {
                    Jan: 0,
                    Feb: 1,
                    Mar: 2,
                    Apr: 3,
                    May: 4,
                    Jun: 5,
                    Jul: 6,
                    Aug: 7,
                    Sep: 8,
                    Oct: 9,
                    Nov: 10,
                    Dec: 11,
                  };

                  const currentMonth = new Date().getMonth();

                  const upcomingIntakes =
                    course?.metaInfo?.Intakes?.split(",")
                      .map((item) => item.trim())
                      .filter((month) => monthOrder[month] >= currentMonth) || [];


                  const fallbackIntakes =
                    metaInfo?.Intakes?.split(",").map((item) => item.trim()) || [];

                  const fallbackClosed = metaInfo?.IntakesClosed
                    ? metaInfo.IntakesClosed.split(",").map((item) => {
                      const [month, year, open, closed, remark] = item.split(":::");
                      return {
                        month: month.trim(),
                        remark: remark || "Deadline passed.",
                      };
                    })
                    : [];

                  const fallbackClosedMonths = fallbackClosed?.map((item) => item.month);

                  const fallbackOpenMonths = fallbackIntakes.filter(
                    (month) => !fallbackClosedMonths?.includes(month)
                  );

                  const deadlineMap =
                    metaInfo?.deadline && metaInfo.deadline !== "ASAP"
                      ? Object.fromEntries(
                        metaInfo?.deadline?.split(",")?.map((item) => {
                          const [month, deadline] = item.split(":");
                          return [month?.trim(), deadline?.trim()];
                        })
                      )
                      : {};

                  const isAsap = metaInfo?.deadline;

                  return (
                    <div
                      key={course._id}
                      className="fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Compact Card */}
                      <div className={`  rounded-lg p-4 transition-all duration-200  hover:shadow-md hover:scale-101 h-full flex flex-col ${selectedProgram.some((item) => item._id === course._id) ? "border border-orange-500 bg-[#fefaf8]" : "border border-gray-200 bg-white"} `}>

                        {/* Header */}
                        <div className="flex gap-3 mb-3 relative">
                          {/* Logo */}
                          <div className="flex-shrink-0">
                            {course.university?.uni_logo ? (
                              <img
                                src={course.university?.uni_logo || "/images/newlogo3.png"}
                                alt={course.university?.name}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/newlogo3.png";
                                }}
                                className="w-18 h-18 object-contain border border-gray-200 rounded-lg p-1.5 bg-gray-50"
                              />
                            ) : (
                              <div className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Course Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-orange-500 line-clamp-1 text-base leading-tight mb-0.5 w-80">
                              {course.name}
                            </h3>
                            <p className="text-base font-medium text-gray-600 truncate mb-1">
                              {course.university?.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-base text-gray-500 truncate">
                                {course.university?.city}, {course.university?.country}
                              </span>
                            </div>
                          </div>

                          {profile.role === "counsellor" ? (<div className="absolute top-1 -right-1">
                            <input
                              type="checkbox"
                              checked={selectedProgram.some(
                                (item) => item._id === course._id
                              )}
                              onChange={() => handleCompareSelect(course)}
                              className="w-5 h-5 accent-primary cursor-pointer"
                            />
                          </div>) : null}
                        </div>

                        {/* Description */}
                        {/* {course.description && (
                          <div className="mb-3">
                            <div className="w-6 h-0.5 bg-primary rounded-full mb-1.5"></div>
                            <p className="text-base text-gray-600 leading-relaxed line-clamp-2" title={course.description}>
                              {course.description}
                            </p>
                          </div>
                        )} */}

                        {/* Key Details - Compact Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {/* Tuition Fee */}
                          <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                            <div className="flex items-center gap-1 mb-0.5">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[11px] font-medium text-gray-500">Yearly Tuition</span>
                            </div>
                            <p className="font-bold text-gray-900 text-base">
                              {course.tuitionFee || 0 + course.currency} {course?.currency}
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                            <div className="flex items-center gap-1 mb-0.5">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[11px] font-medium text-gray-500">Duration</span>
                            </div>
                            <p className="font-semibold text-gray-800 text-base">
                              {course.duration || 'N/A'}
                            </p>
                          </div>

                          {/* Application Fee */}
                          <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                            <div className="flex items-center gap-1 mb-0.5">
                              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-[11px] font-medium text-gray-500">App. Fee</span>
                            </div>
                            <p className="font-semibold text-gray-800 text-base">
                              {course.applicationFee || 0 + course.currency}
                            </p>
                          </div>
                        </div>

                        {metaInfo?.AverageScholarship && <div className="flex gap-4 items-center">
                          <div><h4 className="text-sm font-bold text-gray-700 mb-2">
                            Average Scholarship
                          </h4></div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-black">
                              {metaInfo?.AverageScholarship || "N/A"} {" "}{course?.currency}
                            </span>

                            {metaInfo?.AverageScholarshipRemarks && (
                              <div className="relative group">
                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

                                <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm leading-5 text-white shadow-lg group-hover:block">
                                  {metaInfo.AverageScholarshipRemarks}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>}

                        {metaInfo?.initialDeposit && <div className="flex gap-4 items-center">
                          <div><h4 className="text-sm font-bold text-gray-700 mb-2">
                            Initial Deposit
                          </h4></div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-black">
                              {metaInfo?.initialDeposit || "N/A"} {" "}{course?.currency}
                            </span>

                            {metaInfo?.initialDeposit && (
                              <div className="relative group">
                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

                                <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm leading-5 text-white shadow-lg group-hover:block">
                                  {metaInfo.initialDeposit}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>}

                        {/* Tags - Compact */}


                        {/* Intakes - Compact */}
                        <div className="mb-3 space-y-2">
                          {/* Open Intakes */}
                          {openIntakes.length > 0 && (
                            <div className="flex items-start gap-3">
                              <span className="min-w-[60px] rounded-full bg-green-100 px-2 py-1 text-center text-sm font-semibold text-green-700">
                                Open
                              </span>

                              <div className="flex flex-wrap gap-2">
                                {openIntakes.map((item) => (
                                  <div key={item.month} className="group relative">
                                    <span className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                      <Calendar1 className="h-4 w-4" />
                                      {item.month}

                                      <Info className="h-3 w-3 text-gray-500" />
                                    </span>

                                    <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                      Deadline: {item.deadlineText}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Closed Intakes */}
                          {closedIntakes.length > 0 && (
                            <div className="flex items-start gap-3">
                              <span className="min-w-[60px] rounded-full bg-red-100 px-2 py-1 text-center text-sm font-semibold text-red-700">
                                Closed
                              </span>

                              <div className="flex flex-wrap gap-2">
                                {closedIntakes.map((item) => (
                                  <div key={item.month} className="group relative">
                                    <span className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                                      <Calendar1 className="h-4 w-4" />
                                      {item.month}

                                      <Info className="h-3 w-3 text-gray-500" />
                                    </span>

                                    <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                      Deadline passed. It will come again soon.
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Fallback */}
                          {/* Fallback */}
                          {openIntakes.length === 0 &&
                            closedIntakes.length === 0 &&
                            fallbackIntakes.length > 0 && (
                              <div className="space-y-2">

                                {/* Open */}
                                {fallbackOpenMonths.length > 0 && (
                                  <div className="flex items-start gap-3">
                                    <span className="min-w-[60px] rounded-full bg-green-100 px-2 py-1 text-center text-sm font-semibold text-green-700">
                                      Open
                                    </span>

                                    <div className="flex flex-wrap gap-2">
                                      {fallbackOpenMonths.map((month) => (
                                        <div key={month} className="group relative">
                                          <span className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                            <Calendar1 className="h-4 w-4" />
                                            {month}

                                            <Info className="h-3 w-3 text-gray-500 cursor-pointer" />
                                          </span>

                                          <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                            {isAsap
                                              ? "Deadline: ASAP"
                                              : `Deadline: ${deadlineMap[month] || "ASAP"}`}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Closed */}
                                {fallbackClosed.length > 0 && (
                                  <div className="flex items-start gap-3">
                                    <span className="min-w-[60px] rounded-full bg-red-100 px-2 py-1 text-center text-sm font-semibold text-red-700">
                                      Closed
                                    </span>

                                    <div className="flex flex-wrap gap-2">
                                      {fallbackClosed.map((item) => (
                                        <div key={item.month} className="group relative">
                                          <span className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                                            <Calendar1 className="h-4 w-4" />
                                            {item.month}
                                            <Info className="h-3 w-3 text-gray-500" />
                                          </span>

                                          <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                            {item.remark}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>


                        {/* Action Buttons - Compact */}
                        <div className="flex items-center gap-2 mt-auto pt-4">
                          <Link
                            href={`/dashboard/programs/${course.slug}`}
                            className="flex-1 text-center px-3 py-1.5 bg-white border border-orange-500 text-orange-500 rounded-md text-base font-medium transition-all duration-200 "
                          >
                            View Details
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsModalOpen(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#f26d44] border border-primary/40 text-white rounded-md text-base font-medium transition-all duration-200 "
                          >
                            Apply
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <style jsx>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(15px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              .fade-in-up {
                opacity: 0;
                animation: fadeInUp 0.4s ease forwards;
              }
            `}</style>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>


        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-3 text-base text-gray-800">Loading more programs...</p>
            </motion.div>
          )}
          {!hasMore && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >

              <p className="text-gray-800">You've explored all programs</p>
              <p className="text-base text-gray-800/70 mt-1">
                Showing {courses.length} programs
              </p>
            </motion.div>
          )}
        </div>

        {/* Application Modal */}
        <CreateApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApplicationCreated={() => {
            // Refresh applications list or show success message
          }}
          program={selectedCourse}
        />
      </div>
    </main>
  )
}