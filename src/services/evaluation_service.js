const generateFeedback = (prefix, dates, comments, overallStart = 8.9) => {
  return dates.map((date, index) => {
    const overall = Number(
      Math.max(5.8, overallStart - index * 0.18).toFixed(1)
    );

    const base = Math.max(6, Math.min(10, Math.round(overall)));

    return {
      id: index + 1,
      studentName: "Anonymous Student",
      date,
      overall,
      scores: [
        { label: "Knowledge", value: Math.min(10, base + (index % 2)) },
        { label: "Communication", value: Math.max(6, base - (index % 3 === 0 ? 1 : 0)) },
        { label: "Commitment", value: Math.max(6, base - (index % 4 === 0 ? 1 : 0)) },
        { label: "Preparation", value: Math.max(6, base - (index % 5 === 0 ? 1 : 0)) },
        { label: "Helpfulness", value: Math.max(6, base - (index % 3 === 1 ? 1 : 0)) },
      ],
      comment: comments[index % comments.length],
    };
  });
};

const softwareComments = [
  "Professor Ahmed explains complex concepts very clearly. The assignments were challenging but fair, and the feedback on submissions was always detailed and useful.",
  "The lectures were well organized and the instructor always came prepared. More practical examples during class would make the course even better.",
  "Good teaching style overall. Sometimes the pace was a bit fast, but the material was delivered in a clear and professional way.",
  "Very supportive instructor. The revision sessions before exams were especially helpful and made the difficult topics easier to understand.",
  "The course content was excellent and the instructor encouraged questions throughout the semester.",
  "",
  "ok",
  "No comment",
  "The weekly tasks were useful and matched the lecture material well. I also appreciated the clear grading rubric.",
  "The instructor was committed and respectful, and office hours were helpful whenever I needed clarification.",
  "I liked how the subject was broken down into smaller topics. It made the difficult material easier to follow.",
  "Assignments were meaningful and improved my understanding, but I would have liked a bit more time for some submissions.",
];

const dsComments = [
  "The content was strong and useful. Some lectures needed slower explanation, especially in recursion and tree traversal topics.",
  "The instructor knows the material very well, but I hoped for more solved examples during class.",
  "",
  "I liked the quizzes and the weekly tasks. They helped me stay focused and understand each topic step by step.",
  "The course was good overall and the lecturer was responsive to questions during class.",
  "No comment",
  "The teaching was clear, and I especially liked the problem-solving discussions before quizzes.",
  "A few lectures moved too quickly, but the explanations were still understandable after revision.",
  "good",
  "The examples used in class helped connect theory with implementation, which made the course more useful.",
];

const dbComments = [
  "The course was very well structured. The practical SQL sessions were the most useful part of the semester.",
  "Great organization and clear assignments. The lecturer also explained normalization in a very simple way.",
  "good",
  "The practical work was the strongest part of the course, and the examples were relevant to real database scenarios.",
  "I appreciated the clarity of the material and the way each lecture built on the previous one.",
  "",
  "The instructor was very organized and the labs made difficult topics much easier to understand.",
  "No comment",
  "The assessments matched the course content well, and expectations were clear from the beginning.",
  "I found the explanations of joins and normalization very helpful and easy to follow.",
];

const aiComments = [
  "Very interesting course and the instructor clearly understands the subject deeply. The project guidance was especially helpful.",
  "I enjoyed the examples and demos in class. Sometimes the content was advanced, but overall it was explained well.",
  "No comment",
  "The instructor connected theory with real AI applications in a way that made the lectures engaging.",
  "The project feedback was useful and helped me improve my work before the final submission.",
  "",
  "The material was advanced but exciting, and the instructor answered difficult questions clearly.",
  "The overall experience was very good and the lectures were well prepared.",
  "ok",
  "The examples made machine learning concepts easier to understand and apply.",
];

export const fetchEvaluationPageData = async () => {
  return {
    courses: [
      "Software Engineering",
      "Data Structures",
      "Database Systems",
      "Artificial Intelligence",
    ],

    dataByCourse: {
      "Software Engineering": {
        summaryCards: [
          {
            id: 1,
            title: "Total Evaluation",
            value: "142",
            subValue: "out of 180",
            footerLabel: "Response Rate",
            footerValue: "78%",
            iconType: "clipboard",
            iconBg: "#EEF3FF",
          },
          {
            id: 2,
            title: "Overall Average Score",
            value: "8.1",
            subValue: "out of 10",
            footer: "Across all criteria",
            iconType: "star",
            iconBg: "#F0FDF4",
          },
          {
            id: 3,
            title: "Highest Rated Criterion",
            value: "9.3",
            subValue: "",
            footer: "Communication Skills",
            iconType: "trophy",
            iconBg: "#FAF5FF",
          },
        ],
        criteriaData: [
          { id: 1, label: "Subject Knowledge", value: 93, color: "#2563EB" },
          { id: 2, label: "Communication Skills", value: 89, color: "#16A34A" },
          { id: 3, label: "Commitment & Punctuality", value: 81, color: "#D18B00" },
          { id: 4, label: "Preparation & Organization", value: 86, color: "#16A34A" },
          { id: 5, label: "Helpfulness", value: 88, color: "#2563EB" },
        ],
        feedbackList: generateFeedback(
          "SE",
          [
            "2025-05-15","2025-05-18","2025-05-20","2025-05-22","2025-05-23",
            "2025-05-24","2025-05-26","2025-05-28","2025-05-30","2025-06-01",
            "2025-06-03","2025-06-05","2025-06-07","2025-06-09","2025-06-11",
            "2025-06-13","2025-06-15","2025-06-17","2025-06-19","2025-06-21",
            "2025-06-23","2025-06-25","2025-06-27","2025-06-29","2025-07-01"
          ],
          softwareComments,
          9.2
        ),
      },

      "Data Structures": {
        summaryCards: [
          {
            id: 1,
            title: "Total Evaluation",
            value: "96",
            subValue: "out of 120",
            footerLabel: "Response Rate",
            footerValue: "80%",
            iconType: "clipboard",
            iconBg: "#EEF3FF",
          },
          {
            id: 2,
            title: "Overall Average Score",
            value: "7.4",
            subValue: "out of 10",
            footer: "Across all criteria",
            iconType: "star",
            iconBg: "#F0FDF4",
          },
          {
            id: 3,
            title: "Highest Rated Criterion",
            value: "8.8",
            subValue: "",
            footer: "Subject Knowledge",
            iconType: "trophy",
            iconBg: "#FAF5FF",
          },
        ],
        criteriaData: [
          { id: 1, label: "Subject Knowledge", value: 88, color: "#2563EB" },
          { id: 2, label: "Communication Skills", value: 74, color: "#16A34A" },
          { id: 3, label: "Commitment & Punctuality", value: 79, color: "#D18B00" },
          { id: 4, label: "Preparation & Organization", value: 72, color: "#16A34A" },
          { id: 5, label: "Helpfulness", value: 77, color: "#2563EB" },
        ],
        feedbackList: generateFeedback(
          "DS",
          [
            "2025-04-10","2025-04-13","2025-04-17","2025-04-20","2025-04-22",
            "2025-04-24","2025-04-27","2025-04-30","2025-05-03","2025-05-06",
            "2025-05-09","2025-05-12","2025-05-15","2025-05-18","2025-05-21",
            "2025-05-24","2025-05-27","2025-05-30"
          ],
          dsComments,
          8.0
        ),
      },

      "Database Systems": {
        summaryCards: [
          {
            id: 1,
            title: "Total Evaluation",
            value: "118",
            subValue: "out of 150",
            footerLabel: "Response Rate",
            footerValue: "79%",
            iconType: "clipboard",
            iconBg: "#EEF3FF",
          },
          {
            id: 2,
            title: "Overall Average Score",
            value: "8.5",
            subValue: "out of 10",
            footer: "Across all criteria",
            iconType: "star",
            iconBg: "#F0FDF4",
          },
          {
            id: 3,
            title: "Highest Rated Criterion",
            value: "9.5",
            subValue: "",
            footer: "Preparation & Organization",
            iconType: "trophy",
            iconBg: "#FAF5FF",
          },
        ],
        criteriaData: [
          { id: 1, label: "Subject Knowledge", value: 91, color: "#2563EB" },
          { id: 2, label: "Communication Skills", value: 87, color: "#16A34A" },
          { id: 3, label: "Commitment & Punctuality", value: 85, color: "#D18B00" },
          { id: 4, label: "Preparation & Organization", value: 95, color: "#16A34A" },
          { id: 5, label: "Helpfulness", value: 84, color: "#2563EB" },
        ],
        feedbackList: generateFeedback(
          "DB",
          [
            "2025-03-05","2025-03-08","2025-03-10","2025-03-12","2025-03-15",
            "2025-03-18","2025-03-21","2025-03-24","2025-03-27","2025-03-30",
            "2025-04-02","2025-04-05","2025-04-08","2025-04-11","2025-04-14",
            "2025-04-17","2025-04-20","2025-04-23","2025-04-26","2025-04-29"
          ],
          dbComments,
          8.9
        ),
      },

      "Artificial Intelligence": {
        summaryCards: [
          {
            id: 1,
            title: "Total Evaluation",
            value: "84",
            subValue: "out of 100",
            footerLabel: "Response Rate",
            footerValue: "84%",
            iconType: "clipboard",
            iconBg: "#EEF3FF",
          },
          {
            id: 2,
            title: "Overall Average Score",
            value: "8.7",
            subValue: "out of 10",
            footer: "Across all criteria",
            iconType: "star",
            iconBg: "#F0FDF4",
          },
          {
            id: 3,
            title: "Highest Rated Criterion",
            value: "9.6",
            subValue: "",
            footer: "Subject Knowledge",
            iconType: "trophy",
            iconBg: "#FAF5FF",
          },
        ],
        criteriaData: [
          { id: 1, label: "Subject Knowledge", value: 96, color: "#2563EB" },
          { id: 2, label: "Communication Skills", value: 85, color: "#16A34A" },
          { id: 3, label: "Commitment & Punctuality", value: 83, color: "#D18B00" },
          { id: 4, label: "Preparation & Organization", value: 88, color: "#16A34A" },
          { id: 5, label: "Helpfulness", value: 86, color: "#2563EB" },
        ],
        feedbackList: generateFeedback(
          "AI",
          [
            "2025-02-12","2025-02-14","2025-02-18","2025-02-20","2025-02-22",
            "2025-02-24","2025-02-26","2025-02-28","2025-03-02","2025-03-04",
            "2025-03-06","2025-03-08","2025-03-10","2025-03-12","2025-03-14",
            "2025-03-16"
          ],
          aiComments,
          9.1
        ),
      },
    },
  };
};