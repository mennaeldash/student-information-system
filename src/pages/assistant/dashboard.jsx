// src/pages/assistant/dashboard.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useTranslation } from "react-i18next";

import DashboardStatCard from "../../components/assistant/as-db-components/DashboardStatCard";
import NextSessionCard from "../../components/assistant/as-db-components/NextSessionCard";
import MyCourses from "../../components/assistant/as-db-components/MyCourses";
import ProjectsWidget from "../../components/assistant/as-db-components/ProjectsWidget";
import EvaluationWidget from "../../components/assistant/as-db-components/EvaluationWidget";

const MOCK_SHOULD_FAIL = false; 

function mockFetchNextSession() {
  const mockResponse = {
    startsInText: "Starting in 45 minutes",
    sectionCode: "CS101-Section 2",
    courseName: "Introduction to Computer Science",
    location: "CS Building 101",
    timeText: "MWF 9:00–10:00 AM",
    studentsText: "100 Student",
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (MOCK_SHOULD_FAIL) reject(new Error("Mock API failed"));
      else resolve(mockResponse);
    }, 900);
  });
}

// function fetchNextSessionFromAPI() {
//   return fetch("https://api.example.com/assistant/next-session", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       // Authorization: `Bearer ${token}`, //
//     },
//   }).then((res) => {
//     if (!res.ok) {
//       throw new Error("API request failed");
//     }
//     return res.json();
//   });
// }


const fallbackSession = {
  startsInText: "Starting in 45 minutes",
  sectionCode: "CS101-Section 2",
  courseName: "Introduction to Computer Science",
  location: "CS Building 101",
  timeText: "MWF 9:00–10:00 AM",
  studentsText: "100 Student",
};

const Dashboard = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [nextSession, setNextSession] = useState(fallbackSession);
  const [loadingNextSession, setLoadingNextSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoadingNextSession(true);
        const data = await mockFetchNextSession();



        if (!mounted) return;
        setNextSession(data);
      } catch (e) {
        if (!mounted) return;
        setNextSession(fallbackSession);
      } finally {
        if (!mounted) return;
        setLoadingNextSession(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        pt: 4,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "stretch",
          mb: 4,
        }}
      >
        <DashboardStatCard
          title="Today's Session"
          value={4}
          icon={<BarChartIcon fontSize="small" />}
          progress={40}
          variant="sessions"
        />

        <DashboardStatCard
          title="Weekly Hours"
          value={45}
          subtitle="hours"
          icon={<CalendarTodayIcon fontSize="small" />}
          progress={65}
          variant="hours"
        />

        <DashboardStatCard
          title="Total Student"
          value={1450}
          icon={<GroupOutlinedIcon fontSize="small" />}
          progress={55}
          variant="students"
            hideProgress   

        />

        <DashboardStatCard
          title="This week"
          value={24}
          subtitle="Sessions Scheduled"
          icon={<NotificationsNoneIcon fontSize="small" />}
          variant="week"
          hideProgress={true}
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "clamp(360px, 50vw, 877px) 1fr",
          },
          gap: 3,
        }}
      >
        <NextSessionCard session={nextSession} loading={loadingNextSession} />
        <EvaluationWidget />
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(0, 1.4fr)",
          },
          gap: 3,
        }}
      >
        <ProjectsWidget />
        <MyCourses />
      </Box>
    </Box>
  );
};

export default Dashboard;
