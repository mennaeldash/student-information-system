// src/pages/doctor/dashboard.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useTranslation } from "react-i18next";

import DashboardStatCard from "../../components/doctor/do_db_components/DashboardStatCard";
import NextSessionCard from "../../components/doctor/do_db_components/NextSessionCard";
import AlertsTimeline from "../../components/doctor/do_db_components/AlertsTimeline";
import MyCoursesCard from "../../components/doctor/do_db_components/MyCoursesCard";
import ProjectsCard from "../../components/doctor/do_db_components/ProjectsCard";

// ─── Mock API ───────────────────────────────────────────────────────
function mockFetchNextSession() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        startsInText: "Starting in 45 minutes",
        sectionCode: "CS101-Lecture 2",
        courseName: "Introduction to Computer Science",
        location: "CS Building 101",
        timeText: "MWF 9:00–10:00 AM",
        studentsText: "120 Students",
      });
    }, 800);
  });
}

const fallbackSession = {
  startsInText: "Starting in 45 minutes",
  sectionCode: "CS101-Lecture 2",
  courseName: "Introduction to Computer Science",
  location: "CS Building 101",
  timeText: "MWF 9:00–10:00 AM",
  studentsText: "120 Students",
};

// ─── Page ───────────────────────────────────────────────────────────
const DoctorDashboard = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [nextSession, setNextSession] = useState(fallbackSession);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoadingSession(true);
        const data = await mockFetchNextSession();
        if (!mounted) return;
        setNextSession(data);
      } catch {
        if (!mounted) return;
        setNextSession(fallbackSession);
      } finally {
        if (!mounted) return;
        setLoadingSession(false);
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
        pt: { xs: 3, md: 4 },
        width: "100%",
      }}
    >
      {/* ───── 1) Metrics Row ───── */}
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
          title="Active Courses"
          value={6}
          icon={<MenuBookIcon fontSize="small" />}
          progress={75}
          variant="courses"
        />

        <DashboardStatCard
          title="Today's Sessions"
          value={2}
          icon={<BarChartIcon fontSize="small" />}
          progress={40}
          variant="grading"
        />

        <DashboardStatCard
          title="Total Students"
          value={342}
          icon={<GroupOutlinedIcon fontSize="small" />}
          progress={60}
          variant="students"
        />

        <DashboardStatCard
          title="This Week"
          value={12}
          subtitle="Sessions"
          icon={<CalendarTodayIcon fontSize="small" />}
          progress={80}
          variant="schedule"
        />
      </Box>

      {/* ───── 2) Main Section (Hero + Alerts) ───── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(0, 1fr)",
          },
          gap: 3,
        }}
      >
        <NextSessionCard session={nextSession} />
        <AlertsTimeline />
      </Box>

      {/* ───── 3) Bottom Section (Courses + Projects) ───── */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) minmax(0, 1fr)",
          },
          gap: 3,
        }}
      >
        <MyCoursesCard />
        <ProjectsCard />
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
