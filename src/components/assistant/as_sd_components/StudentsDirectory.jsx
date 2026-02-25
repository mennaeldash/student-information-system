// src/components/assistant/as_sd_components/StudentsDirectory.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Box, Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

import StudentsFilterBar from "./StudentsFilterBar";
import StudentsGrid from "./StudentsGrid";

// Mock data - replace with API call later
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Asmaa Ahmed",
    fullName: "Asmaa Ahmed Salah",
    studentId: "22007256",
    email: "2200123@student.eelu.edu.eg",
    personalEmail: "asmaaahmed@gmail.com",
    phone: "+201023456789",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.00",
    avatarUrl: null,
    nationalId: "1234567891011",
    gender: "Female",
    dateOfBirth: "August 22, 1995",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Fayoum",
    status: "Active",
  },
  {
    id: 2,
    name: "Menna Eldash",
    fullName: "Menna Eldash",
    studentId: "2200124",
    email: "2200124@student.eelu.edu.eg",
    personalEmail: "mennaeldash@gmail.com",
    phone: "+20 101 2345 678",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.20",
    avatarUrl: null,
    nationalId: "1234567891012",
    gender: "Female",
    dateOfBirth: "January 15, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Cairo",
    status: "Active",
  },
  {
    id: 3,
    name: "Anan Hany",
    fullName: "Anan Hany",
    studentId: "2200125",
    email: "2200125@student.eelu.edu.eg",
    personalEmail: "ananhany@gmail.com",
    phone: "+20 101 2345 679",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.15",
    avatarUrl: null,
    nationalId: "1234567891013",
    gender: "Female",
    dateOfBirth: "March 10, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Alexandria",
    status: "Active",
  },
  {
    id: 4,
    name: "Shaza Mohamed",
    fullName: "Shaza Mohamed",
    studentId: "2200126",
    email: "2200126@student.eelu.edu.eg",
    personalEmail: "shazamohamed@gmail.com",
    phone: "+20 101 2345 680",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.25",
    avatarUrl: null,
    nationalId: "1234567891014",
    gender: "Female",
    dateOfBirth: "May 5, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Giza",
    status: "Active",
  },
  {
    id: 5,
    name: "Mariam Abdulraouf",
    fullName: "Mariam Abdulraouf",
    studentId: "2200127",
    email: "2200127@student.eelu.edu.eg",
    personalEmail: "mariamabdulraouf@gmail.com",
    phone: "+20 101 2345 681",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.10",
    avatarUrl: null,
    nationalId: "1234567891015",
    gender: "Female",
    dateOfBirth: "July 20, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Mansoura",
    status: "Active",
  },
  {
    id: 6,
    name: "Mohamed Saeed",
    fullName: "Mohamed Saeed",
    studentId: "2200128",
    email: "2200128@student.eelu.edu.eg",
    personalEmail: "mohamedsaeed@gmail.com",
    phone: "+20 101 2345 682",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.30",
    avatarUrl: null,
    nationalId: "1234567891016",
    gender: "Male",
    dateOfBirth: "September 12, 1995",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Tanta",
    status: "Active",
  },
  {
    id: 7,
    name: "Abdurahman Mohamed",
    fullName: "Abdurahman Mohamed",
    studentId: "2200129",
    email: "2200129@student.eelu.edu.eg",
    personalEmail: "abdurahmanmohamed@gmail.com",
    phone: "+20 101 2345 683",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.18",
    avatarUrl: null,
    nationalId: "1234567891017",
    gender: "Male",
    dateOfBirth: "November 8, 1995",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Zagazig",
    status: "Active",
  },
  {
    id: 8,
    name: "Mohamed Yasser",
    fullName: "Mohamed Yasser",
    studentId: "2200130",
    email: "2200130@student.eelu.edu.eg",
    personalEmail: "mohamedyasser@gmail.com",
    phone: "+20 101 2345 684",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "98 / 132",
    gpa: "3.2 / 4.00",
    cumulativeGpa: "3.22",
    avatarUrl: null,
    nationalId: "1234567891018",
    gender: "Male",
    dateOfBirth: "December 25, 1995",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Fayoum",
    status: "Active",
  },
  {
    id: 9,
    name: "Ahmed Ali",
    fullName: "Ahmed Ali",
    studentId: "2200131",
    email: "2200131@student.eelu.edu.eg",
    personalEmail: "ahmedali@gmail.com",
    phone: "+20 101 2345 685",
    nationality: "Egypt",
    program: "Information Technology",
    department: "IT",
    level: "Level 3",
    credits: "120 / 132",
    gpa: "3.5 / 4.00",
    cumulativeGpa: "3.50",
    avatarUrl: null,
    nationalId: "1234567891019",
    gender: "Male",
    dateOfBirth: "February 14, 1994",
    enrollmentDate: "Oct 22, 2021",
    religion: "Islam",
    currentAddress: "Cairo",
    status: "Active",
  },
  {
    id: 10,
    name: "Fatma Hassan",
    fullName: "Fatma Hassan Mohamed",
    studentId: "2200132",
    email: "2200132@student.eelu.edu.eg",
    personalEmail: "fatmahassan@gmail.com",
    phone: "+20 101 2345 686",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 1",
    credits: "45 / 132",
    gpa: "3.8 / 4.00",
    cumulativeGpa: "3.80",
    avatarUrl: null,
    nationalId: "1234567891020",
    gender: "Female",
    dateOfBirth: "March 20, 1997",
    enrollmentDate: "Oct 22, 2023",
    religion: "Islam",
    currentAddress: "Aswan",
    status: "Active",
  },
  {
    id: 11,
    name: "Omar Khaled",
    fullName: "Omar Khaled Ibrahim",
    studentId: "2200133",
    email: "2200133@student.eelu.edu.eg",
    personalEmail: "omarkhaled@gmail.com",
    phone: "+20 101 2345 687",
    nationality: "Egypt",
    program: "Information Technology",
    department: "IT",
    level: "Level 2",
    credits: "90 / 132",
    gpa: "3.4 / 4.00",
    cumulativeGpa: "3.40",
    avatarUrl: null,
    nationalId: "1234567891021",
    gender: "Male",
    dateOfBirth: "June 15, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Luxor",
    status: "Active",
  },
  {
    id: 12,
    name: "Nour El-Din",
    fullName: "Nour El-Din Ahmed",
    studentId: "2200134",
    email: "2200134@student.eelu.edu.eg",
    personalEmail: "noureldin@gmail.com",
    phone: "+20 101 2345 688",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "95 / 132",
    gpa: "3.6 / 4.00",
    cumulativeGpa: "3.60",
    avatarUrl: null,
    nationalId: "1234567891022",
    gender: "Male",
    dateOfBirth: "April 8, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Ismailia",
    status: "Active",
  },
  {
    id: 13,
    name: "Yasmin Mostafa",
    fullName: "Yasmin Mostafa Ali",
    studentId: "2200135",
    email: "2200135@student.eelu.edu.eg",
    personalEmail: "yasminmostafa@gmail.com",
    phone: "+20 101 2345 689",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 3",
    credits: "115 / 132",
    gpa: "3.7 / 4.00",
    cumulativeGpa: "3.70",
    avatarUrl: null,
    nationalId: "1234567891023",
    gender: "Female",
    dateOfBirth: "October 12, 1995",
    enrollmentDate: "Oct 22, 2021",
    religion: "Islam",
    currentAddress: "Port Said",
    status: "Active",
  },
  {
    id: 14,
    name: "Karim Samir",
    fullName: "Karim Samir Hassan",
    studentId: "2200136",
    email: "2200136@student.eelu.edu.eg",
    personalEmail: "karimsamir@gmail.com",
    phone: "+20 101 2345 690",
    nationality: "Egypt",
    program: "Information Technology",
    department: "IT",
    level: "Level 1",
    credits: "50 / 132",
    gpa: "3.3 / 4.00",
    cumulativeGpa: "3.30",
    avatarUrl: null,
    nationalId: "1234567891024",
    gender: "Male",
    dateOfBirth: "July 25, 1997",
    enrollmentDate: "Oct 22, 2023",
    religion: "Islam",
    currentAddress: "Suez",
    status: "Active",
  },
  {
    id: 15,
    name: "Dina Magdy",
    fullName: "Dina Magdy Fathy",
    studentId: "2200137",
    email: "2200137@student.eelu.edu.eg",
    personalEmail: "dinamagdy@gmail.com",
    phone: "+20 101 2345 691",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "100 / 132",
    gpa: "3.5 / 4.00",
    cumulativeGpa: "3.50",
    avatarUrl: null,
    nationalId: "1234567891025",
    gender: "Female",
    dateOfBirth: "September 3, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Damietta",
    status: "Active",
  },
  {
    id: 16,
    name: "Hassan Mahmoud",
    fullName: "Hassan Mahmoud Saleh",
    studentId: "2200138",
    email: "2200138@student.eelu.edu.eg",
    personalEmail: "hassanmahmoud@gmail.com",
    phone: "+20 101 2345 692",
    nationality: "Egypt",
    program: "Information Technology",
    department: "IT",
    level: "Level 3",
    credits: "125 / 132",
    gpa: "3.9 / 4.00",
    cumulativeGpa: "3.90",
    avatarUrl: null,
    nationalId: "1234567891026",
    gender: "Male",
    dateOfBirth: "November 18, 1994",
    enrollmentDate: "Oct 22, 2021",
    religion: "Islam",
    currentAddress: "Minya",
    status: "Active",
  },
  {
    id: 17,
    name: "Sara Ibrahim",
    fullName: "Sara Ibrahim Mohamed",
    studentId: "2200139",
    email: "2200139@student.eelu.edu.eg",
    personalEmail: "saraibrahim@gmail.com",
    phone: "+20 101 2345 693",
    nationality: "Egypt",
    program: "Computer Science",
    department: "IT",
    level: "Level 2",
    credits: "88 / 132",
    gpa: "3.1 / 4.00",
    cumulativeGpa: "3.10",
    avatarUrl: null,
    nationalId: "1234567891027",
    gender: "Female",
    dateOfBirth: "December 5, 1996",
    enrollmentDate: "Oct 22, 2022",
    religion: "Islam",
    currentAddress: "Beni Suef",
    status: "Active",
  },
  {
    id: 18,
    name: "Amr Tarek",
    fullName: "Amr Tarek Youssef",
    studentId: "2200140",
    email: "2200140@student.eelu.edu.eg",
    personalEmail: "amrtarek@gmail.com",
    phone: "+20 101 2345 694",
    nationality: "Egypt",
    program: "Information Technology",
    department: "IT",
    level: "Level 1",
    credits: "40 / 132",
    gpa: "3.6 / 4.00",
    cumulativeGpa: "3.60",
    avatarUrl: null,
    nationalId: "1234567891028",
    gender: "Male",
    dateOfBirth: "January 30, 1997",
    enrollmentDate: "Oct 22, 2023",
    religion: "Islam",
    currentAddress: "Qena",
    status: "Active",
  },
];

export default function StudentsDirectory({ onSelectStudent }) {
  const { i18n } = useTranslation();
  const { theme: appTheme, colors } = useThemeContext();

  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark" || appTheme === "dark";
  const bgColor = colors?.background || (isDark ? "#020617" : "#F3F4F6");

  const topRef = useRef(null);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [page, setPage] = useState(1);

  const pageSize = 9; // 3 rows × 3 columns

  const filteredStudents = useMemo(() => {
    let list = [...MOCK_STUDENTS];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (std) =>
          std.name.toLowerCase().includes(s) ||
          std.studentId.toLowerCase().includes(s) ||
          std.email.toLowerCase().includes(s)
      );
    }

    if (levelFilter !== "all") {
      list = list.filter((std) => std.level === levelFilter);
    }

    if (programFilter !== "all") {
      list = list.filter((std) => std.program === programFilter);
    }

    return list;
  }, [search, levelFilter, programFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, page, pageSize]);

  // ✅ Pagination: يغيّر الصفحة + يطلع لفوق (بدون سكرول داخلي)
  const handleChangePage = (_e, value) => {
    setPage(value);

    // scroll to top of this section
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <Box
      ref={topRef}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },

        // ✅ خلي الصفحة/اللايوت هو اللي يعمل scroll
        height: "auto",
        minHeight: 0,

        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 2.5, md: 3 },

        maxWidth: "100%",
        width: "100%",
        boxSizing: "border-box",

        bgcolor: bgColor,
        direction: isRTL ? "rtl" : "ltr",

        // ✅ أهم سطرين لإلغاء السكرول التاني
        overflowY: "visible",
        overflowX: "hidden",
      }}
    >
      <StudentsFilterBar
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
          requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }}
        levelFilter={levelFilter}
        onLevelChange={(value) => {
          setPage(1);
          setLevelFilter(value);
          requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }}
        programFilter={programFilter}
        onProgramChange={(value) => {
          setPage(1);
          setProgramFilter(value);
          requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }}
      />

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <StudentsGrid students={paginatedStudents} onSelectStudent={onSelectStudent} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
            pb: 2,
            width: "100%",
          }}
        >
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: colors?.secondary || "#6B7280",
                fontSize: "14px",
                fontWeight: 400,
                minWidth: "32px",
                height: "32px",
                "&:hover": { bgcolor: "transparent" },
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                color: colors?.text || "#111827",
                fontWeight: 600,
                bgcolor: "transparent",
                "&:hover": { bgcolor: "transparent" },
              },
              "& .MuiPaginationItem-icon": {
                color: colors?.text || "#111827",
                fontSize: "20px",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
