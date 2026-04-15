// src/components/doctor/do_co_components/courseHeaderData.js
// ──────────────────────────────────────────────────────────
// Mock data that simulates a future API response.
// Replace the body of `fetchCourseHeaderData()` with a real
// API call when ready — the shape stays the same.
// ──────────────────────────────────────────────────────────

/**
 * List of available courses (dropdown options).
 * In production, this would come from GET /api/doctor/courses.
 */
export const MOCK_COURSES = [
  {
    id: "cs305",
    semester: "2025/2026",
    name: "Advanced Algorithms & Data Structures",
    department: "Department of Computer Science",
    code: "CS305",
    creditHours: 3,
    sections: 2,
    enrolled: 124,
    capacity: 150,
    avgAttendance: 85,
    academicProgram: "B.Sc. in Computer Science",
    description:
      "This course covers advanced data structures and algorithms analysis. Topics include amortized analysis, graph algorithms, network flow, string matching, multithreaded algorithms, and NP-completeness. Emphasis is placed on theoretical understanding and practical implementation.",
    prerequisites: ["CS201 - Data Structures", "MATH205 - Discrete Math"],
    coordinator: { name: "Dr. Mohamed Gaber", initials: "MG", color: "#c0d8f6ff" },
    instructor: { name: "Dr. Manal Shaban", initials: "MS", color: "#F0FDF4" },
  },
  {
    id: "cs201",
    semester: "2025/2026",
    name: "Data Structures",
    department: "Department of Computer Science",
    code: "CS201",
    creditHours: 3,
    sections: 3,
    enrolled: 200,
    capacity: 220,
    avgAttendance: 79,
    academicProgram: "B.Sc. in Computer Science",
    description:
      "Introduction to fundamental data structures including arrays, linked lists, stacks, queues, trees, and hash tables.",
    prerequisites: ["CS101 - Intro to CS"],
    coordinator: { name: "Dr. Ahmed Ali", initials: "AA", color: "#F59E0B" },
    instructor: { name: "Dr. Salma Fawzy", initials: "SF", color: "#EF4444" },
  },
];

/**
 * Mock sections data per course.
 * In production, replace with GET /api/courses/{id}/sections.
 */
export const MOCK_SECTIONS = {
  cs305: [
    {
      id: "cs305-s001",
      title: "Section 001",
      branchId: "fayoum",
      instructor: "Dr. Manal Shaban",
      location: "Alfayoum — Floor 5, Room 302",
      days: "Mon, Wed",
      time: "10:00 AM – 11:30 AM",
    },
    {
      id: "cs305-s002",
      title: "Section 002",
      branchId: "fayoum",
      instructor: "Dr. Khalid Al-Mansour",
      location: "Alfayoum — Floor 3, Room 115",
      days: "Tue, Thu",
      time: "12:00 PM – 1:30 PM",
    },
  ],
  cs201: [
    {
      id: "cs201-s001",
      title: "Section 001",
      branchId: "cairo",
      instructor: "Dr. Salma Fawzy",
      location: "Cairo — Building B, Room 201",
      days: "Sun, Tue",
      time: "9:00 AM – 10:30 AM",
    },
    {
      id: "cs201-s002",
      title: "Section 002",
      branchId: "cairo",
      instructor: "Dr. Omar Hassan",
      location: "Cairo — Building A, Room 104",
      days: "Mon, Wed",
      time: "1:00 PM – 2:30 PM",
    },
    {
      id: "cs201-s003",
      title: "Section 003",
      branchId: "giza",
      instructor: "Dr. Nadia Yousef",
      location: "Giza — Hall 2, Room 310",
      days: "Sat, Mon",
      time: "11:00 AM – 12:30 PM",
    },
  ],
};

/**
 * Mock branch options per course.
 * In production, replace with GET /api/courses/{id}/branches.
 */
export const MOCK_BRANCHES = {
  cs305: [{ id: "fayoum", label: "Alfayoum Branch" }],
  cs201: [
    { id: "cairo", label: "Cairo Branch" },
    { id: "giza", label: "Giza Branch" },
  ],
};

/**
 * Builds the `courseHeaderData` object consumed by CourseHeader
 * and CourseStats. Shape matches the future API contract.
 *
 * @param {object} course      – selected course from MOCK_COURSES
 * @param {object} themeColors – colors object from useThemeContext() (optional)
 */
export function buildCourseHeaderData(course, themeColors) {
  const isDark = themeColors?.mode === "dark";

  return {
    semester: `Full Semester ${course?.semester ?? ""}`,
    semesterLabel: "Full Semester",
    semesterYear: course?.semester ?? "",
    title: course?.name ?? "",
    department: course?.department ?? "",

    stats: {
      creditHours: course?.creditHours != null ? `${course.creditHours}.0` : "—",
      sections: course?.sections ?? "—",
      enrolled: course ? `${course.enrolled} / ${course.capacity}` : "—",
      attendance: course?.avgAttendance ? `${course.avgAttendance}%` : "—",
    },

    colors: {
      // ── Header section (Figma-exact for light, theme-aware for dark) ──
      containerBg: themeColors?.box ?? "#FFFFFF",
      semesterText: themeColors?.secondary ?? "#000000ff",
      title: themeColors?.text ?? "#000000",
      departmentText: themeColors?.secondary ?? "#475569",
      departmentDot: themeColors?.primary ?? "#3B82F6",
      divider: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",

      // ── Dropdown ──
      dropdownBg: themeColors?.background ?? "#F8F8F8",
      dropdownText: themeColors?.secondary ?? "#71717A",
      dropdownBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",

      // ── Stat cards (theme-aware for dark/light) ──
      cardBg: themeColors?.background ?? "#F8F8F8",
      cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      statLabel: themeColors?.secondary ?? "rgba(0,0,0,0.5)",
      statValue: themeColors?.text ?? "rgba(0,0,0,0.7)",
      statHighlight: "#1D4ED9",
    },
  };
}
