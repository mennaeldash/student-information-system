// src/services/registration_requests_service.js

export async function fetchRegistrationRequest(requestId) {
  // simulate API delay
  await new Promise((r) => setTimeout(r, 400));

  // mock data
  return {
    header: {
      title: "Course Registration Review",
      academicYear: "2025-2026",
      semester: "Second Semester",
      submissionDate: "08/02/2026",
      status: "Under Review", // Under Review | Approved | Rejected
    },
    student: {
      name: "Mohamed Yasser",
      program: "IT",
      studentId: "2009877",
      level: "Level 3",
      gpa: "3.67",
      earnedCredits: "84",
      maxAllowedCredits: "18",
      submittedTo: "Eng/ Mohamed Gaber",
    },
    summary: {
      totalRegistered: 16,
      maxAllowed: 18,
    },
    courses: [
      {
        id: "1",
        code: "IT110",
        name: "Introduction to Computers",
        credits: 3,
        section: 2,
        schedule: "Sun, Tue 10:00-11:30",
        remark: "—",
      },
      {
        id: "2",
        code: "MA112",
        name: "Discrete Mathematics",
        credits: 2,
        section: 1,
        schedule: "Sun, Tue 10:00-11:30",
        remark: "—",
      },
      {
        id: "3",
        code: "IT110",
        name: "Introduction to Computers",
        credits: 3,
        section: 2,
        schedule: "Sun, Tue 10:00-11:30",
        remark: "—",
      },
      {
        id: "4",
        code: "MA112",
        name: "Discrete Mathematics",
        credits: 3,
        section: 3,
        schedule: "Sun, Tue 10:00-11:30",
        remark: "—",
      },
    ],
  };
}