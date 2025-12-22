export async function fetchCourses() {
  // Mock data
  return [
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Programming",
      credits: 3,
      instructor: "Dr. Smith",
      schedule: "Mon, Wed 10:00–11:30 AM",
      status: "available", 
      enrolled: 25,
      capacity: 30,
      prerequisites: [],
      semester: "Fall 2025",
    },
    {
      id: 2,
      code: "MATH201",
      name: "Calculus II",
      credits: 3,
      instructor: "Dr. Brown",
      schedule: "Tue, Thu 09:00–10:20 AM",
      status: "full",
      enrolled: 25,
      capacity: 25,
      prerequisites: ["MATH101"],
      semester: "Fall 2025",
    },
    {
      id: 3,
      code: "PHYS102",
      name: "Physics II",
      credits: 3,
      instructor: "Dr. Clark",
      schedule: "Mon, Wed 13:00–14:30 PM",
      status: "prereq",
      enrolled: 15,
      capacity: 30,
      prerequisites: ["PHYS101"],
      semester: "Spring 2025",
    },
    {
      id: 4,
      code: "ENG303",
      name: "Technical Writing",
      credits: 3,
      instructor: "Dr. Adams",
      schedule: "Mon, Wed 10:00–11:30 AM",
      status: "available",
      enrolled: 15,
      capacity: 30,
      prerequisites: [],
      semester: "Fall 2025",
    },
  ];
}
// export async function fetchCourses() {
//   try {
//     const response = await fetch("https://api.myuniversity.com/courses");
//     if (!response.ok) {
//       throw new Error("Failed to fetch courses");
//     }
//     const data = await response.json();
//     return data; // لازم يكون array بنفس شكل الموك
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return []; // fallback لو فيه مشكلة
//   }
// }
