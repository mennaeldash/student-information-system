// src/services/assistant/sectionsStorage.js
// Service to manage sections data storage and retrieval

const STORAGE_KEY = "ta_sections_data";

// Get all sections data from localStorage
export const getSectionsData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading sections data:", error);
    return {};
  }
};

// Save sections data to localStorage
export const saveSectionsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving sections data:", error);
  }
};

// Add a new section to a course
export const addSectionToCourse = (courseId, sectionData) => {
  const allData = getSectionsData();
  
  // Normalize courseId to lowercase for consistency
  const normalizedCourseId = courseId?.toLowerCase();
  
  if (!allData[normalizedCourseId]) {
    allData[normalizedCourseId] = [];
  }
  
  // Generate section code if not provided
  const existingSections = allData[normalizedCourseId];
  const sectionNumber = existingSections.length + 1;
  const sectionCode = `S${String(sectionNumber).padStart(2, "0")}`;
  
  // Format section data to match TASectionsList structure
  const formattedSection = {
    code: sectionCode,
    day: formatDay(sectionData.sectionDate),
    time: formatTimeRange(sectionData.startTime, sectionData.endTime),
    room: sectionData.location || "TBA",
    students: sectionData.students || 0,
    instructor: sectionData.instructor || "TBA",
  };
  
  allData[normalizedCourseId].push(formattedSection);
  saveSectionsData(allData);
  
  return formattedSection;
};

// Get sections for a specific course
export const getCourseSections = (courseId) => {
  const allData = getSectionsData();
  const normalizedCourseId = courseId?.toLowerCase();
  return allData[normalizedCourseId] || [];
};

// Format date to day name
const formatDay = (dateString) => {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

// Format time range
const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return "TBA";
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };
  return `${formatTime(startTime)}–${formatTime(endTime)}`;
};

// Clear all sections data (for testing)
export const clearSectionsData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
