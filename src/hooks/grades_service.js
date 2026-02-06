
export async function fetchStudentInfo(lang = 'en') {
  try {
    const data = await fetchJson(`/api/student/info?lang=${lang}`);
    return data;
  } catch (error) {
    console.error('Error fetching student info:', error);
    throw error;
  }
}

/**
 * Fetch GPA data (semester and cumulative)
 */
export async function fetchGpaData(academicYear, semester, lang = 'en') {
  try {
    const data = await fetchJson(
      `/api/student/gpa?lang=${lang}&academic_year=${academicYear}&semester=${semester}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching GPA data:', error);
    throw error;
  }
}

/**
 * Fetch courses with grades for a specific academic year and semester
 */
export async function fetchCoursesGrades(academicYear, semester, lang = 'en') {
  try {
    const data = await fetchJson(
      `/api/student/courses?lang=${lang}&academic_year=${academicYear}&semester=${semester}`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching courses grades:', error);
    throw error;
  }
}

/**
 * Fetch performance matrix data
 */
export async function fetchPerformanceMatrix(lang = 'en') {
  try {
    const data = await fetchJson(`/api/student/performance?lang=${lang}`);
    return data;
  } catch (error) {
    console.error('Error fetching performance matrix:', error);
    throw error;
  }
}

/**
 * Fetch available academic years
 */
export async function fetchAcademicYears(lang = 'en') {
  try {
    const data = await fetchJson(`/api/student/academic-years?lang=${lang}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching academic years:', error);
    // Return default years if API fails
    return ['2023/2024', '2025/2026', '2026/2027'];
  }
}