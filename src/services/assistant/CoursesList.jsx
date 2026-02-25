// src/components/assistant/as_co_components/CoursesList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Alert, Stack } from "@mui/material";
import CourseCard from "../../components/assistant/as_co_components/TACourseCard";
import AddSectionModal from "../../components/assistant/as_co_components/AddSectionModal.jsx";
import { useThemeContext } from "../../services/theme_context.jsx";
import { addSectionToCourse } from "./sectionsStorage.js";

// موك داتا مؤقتًا لحد الـ API
const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction To Computer ",
    code: "cs101",
    type: "Lecture",
    instructor: "Dr. Khalid Al-Mansour",
    coordinator: "Prof. Ahmed Mohamed",
    creditHours: 3,
    prerequisites: "-------",
  },
  {
    id: "2",
    title: "Data Structures",
    code: "cs201",
    type: "Lecture",
    instructor: "Dr. Sara Hassan",
    coordinator: "Prof. Youssef Ali",
    creditHours: 3,
    prerequisites: "cs101",
  },
  {
    id: "3",
    title: "Operating Systems",
    code: "cs301",
    type: "Lecture",
    instructor: "Dr. Mona Nabil",
    coordinator: "Prof. Ahmed Mohamed",
    creditHours: 3,
    prerequisites: "cs201",
  },
];

export default function CoursesList({
  apiUrl = "/api/ta/courses",     // غيره عندك
  containerSx,                    // اختياري: تعدّلي ستايل الحاوية من برّه
}) {
  const { colors } = useThemeContext();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const token = localStorage.getItem("token"); // تأكدي إنه بيتسجّل عند اللوجين

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourse(null);
  };

  const handleSaveSection = (sectionData) => {
    if (!selectedCourse) return;
    
    // استخدام course code كـ identifier لأنه متطابق في TASectionsList
    const courseIdentifier = selectedCourse.code?.toLowerCase() || selectedCourse.id;
    
    // حفظ القسم الجديد للكورس المحدد
    const newSection = addSectionToCourse(courseIdentifier, {
      ...sectionData,
      courseId: courseIdentifier,
      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
    });
    
    console.log("New section added for course:", courseIdentifier, newSection);
    
    // إرسال event لتحديث صفحة Sections
    window.dispatchEvent(new CustomEvent("sectionsUpdated", { 
      detail: { courseId: courseIdentifier } 
    }));
    
    handleCloseModal();
  };

  useEffect(() => {
    const ac = new AbortController();
    let isMounted = true;

    async function fetchCourses() {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: ac.signal,
        });

        if (!res.ok) {
          // fallback للموك
          if (isMounted) {
            setCourses(MOCK_COURSES);
            setErr(""); // مفيش إيرور ظاهر للمستخدم طالما عندنا موك
          }
          return;
        }

        const data = await res.json();

        // طبّعي شكل الداتا من الـ API (عدّلي حسب استجابتك)
        const normalized = (data?.courses || data || []).map((c, idx) => ({
          id: c.id ?? String(idx),
          title: c.title ?? c.name ?? "Untitled",
          code: c.code ?? "N/A",
          type: c.type ?? "Lecture",
          instructor: c.instructor ?? "—",
          coordinator: c.coordinator ?? "—",
          creditHours: c.creditHours ?? c.credit_hours ?? 0,
          prerequisites: c.prerequisites ?? "-------",
        }));

        if (isMounted) setCourses(normalized.length ? normalized : MOCK_COURSES);
      } catch (e) {
        if (isMounted) {
          // fallback للموك
          setCourses(MOCK_COURSES);
          setErr("");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCourses();

    return () => {
      isMounted = false;
      ac.abort();
    };
  }, [apiUrl, token]);

  const list = useMemo(
    () =>
      loading
        ? Array.from({ length: 3 }).map((_, i) => ({
            ...MOCK_COURSES[0],
            id: `skeleton-${i}`,
          }))
        : courses,
    [loading, courses]
  );

  return (
    <Box
      sx={{
        // ✅ يملأ السطر كله، من غير حدود عرض داخلية
        width: "100%",
        maxWidth: "none",
        px: 0,
        mx: 0,
        ...containerSx, // تسمحي بتعديل خارجي لو حبيتي
      }}
    >
      {err && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      <Stack
        spacing={2.25}
        sx={{
          // ✅ كل كارت ياخد العرض الكامل للحاوية
          "& > *": { width: "100%" },
        }}
      >
        {list.map((c) => (
          <CourseCard
            key={c.id}
            title={c.title}
            code={c.code}
            type={c.type}
            instructor={c.instructor}
            coordinator={c.coordinator}
            creditHours={c.creditHours}
            prerequisites={c.prerequisites}
            loading={loading}
            onAddSections={() => handleOpenModal(c)}
          />
        ))}
      </Stack>

      <AddSectionModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveSection}
        course={selectedCourse}
      />
    </Box>
  );
}

 // src/components/assistant/as_co_components/CoursesList.jsx

// import React, { useEffect, useMemo, useState } from "react";
// import { Box, Alert, Stack, CircularProgress } from "@mui/material";
// import CourseCard from "../../components/assistant/as_co_components/TACourseCard";
// import { useThemeContext } from "../../services/theme_context.jsx";

// export default function CoursesList({ apiUrl = "/api/ta/courses" }) {
//   const { colors } = useThemeContext();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchCourses() {
//       setLoading(true);
//       setErr("");

//       try {
//         const res = await fetch(apiUrl, {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           // لو ما بتستخدمي Bearer وبتشتغلي كوكيز:
//           // credentials: "include",
//         });

//         if (!res.ok) {
//           const txt = await res.text().catch(() => "");
//           throw new Error(
//             `Failed to load courses (${res.status}) ${txt ? "- " + txt : ""}`
//           );
//         }

//         const data = await res.json();

//         // عدّلي الماب حسب شكل استجابتك
//         const normalized = (data?.courses || data || []).map((c, idx) => ({
//           id: c.id ?? String(idx),
//           title: c.title ?? c.name ?? "Untitled",
//           code: c.code ?? "N/A",
//           type: c.type ?? "Lecture",
//           instructor: c.instructor ?? "—",
//           coordinator: c.coordinator ?? "—",
//           creditHours: c.creditHours ?? c.credit_hours ?? 0,
//           prerequisites: c.prerequisites ?? "-------",
//         }));

//         if (isMounted) setCourses(normalized);
//       } catch (e) {
//         if (isMounted) setErr(e.message || "Failed to load courses.");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     }

//     fetchCourses();
//     return () => {
//       isMounted = false;
//     };
//   }, [apiUrl, token]);

//   const list = useMemo(() => courses, [courses]);

//   if (loading) {
//     return (
//       <Box sx={{ width: "100%", py: 3, display: "grid", placeItems: "center" }}>
//         <CircularProgress size={28} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%" }}>
//       {err && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {err}
//         </Alert>
//       )}

//       <Stack spacing={2.25}>
//         {list.map((c) => (
//           <CourseCard
//             key={c.id}
//             title={c.title}
//             code={c.code}
//             type={c.type}
//             instructor={c.instructor}
//             coordinator={c.coordinator}
//             creditHours={c.creditHours}
//             prerequisites={c.prerequisites}
//             onAddSections={() => console.log("Add sections for", c.code)}
//           />
//         ))}

//         {!err && list.length === 0 && (
//           <Alert severity="info">No courses found.</Alert>
//         )}
//       </Stack>
//     </Box>
//   );
// }