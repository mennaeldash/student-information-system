// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Box, Paper, Tabs, Tab, Typography, useTheme } from "@mui/material";

import ProfileCard from "../../components/DB_Components/ProfileCard.jsx";
import ContactInfoCard from "../../components/DB_Components/ContactCard";
import FamilyCard from "../../components/PR_components/FamilyCard";
import QualificationsCard from "../../components/PR_components/QualificationsCard";
import TransferCaseCard from "../../components/PR_components/TransferCaseCard";

import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const [tab, setTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: "",
    avatar: "",
    status: "",
  });

  const theme = useTheme();
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setUserInfo({
      name: localStorage.getItem("user_name") || "menna mohammed",
      id: localStorage.getItem("user_id") || "2201996",
      avatar: localStorage.getItem("user_avatar") || "",
      status: localStorage.getItem("user_status") || "Active",
    });
  }, []);

  return (
    <Box
      dir={i18n.dir()}
      sx={{
        height: "100vh",
        overflowY: "auto",
        background: colors?.background,
        px: { xs: 1, md: 2 },
        py: { xs: 2, md: 4 },
        width: "100%",
        fontFamily: colors?.fontFamily,
        color: colors?.text,
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${colors?.border}`,
          mb: 3,
          p: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          gap: 3,
          bgcolor: colors?.box || "#fff",
        }}
      >
        <Box
          sx={{
            width: 75,
            height: 75,
            borderRadius: "50%",
            bgcolor: colors?.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: colors?.text || "#64748B",
            overflow: "hidden",
          }}
        >
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt="avatar"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          ) : (
            userInfo.name.charAt(0)
          )}
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={700} color={colors?.text}>
            {userInfo.name}
          </Typography>
          <Typography variant="body2" color={colors?.secondary} mt={0.2}>
            {t("id")}: {userInfo.id} &nbsp;
            <span
              style={{
                background:
                  userInfo.status === "Active" ? "#e2f5ea" : "#fde8e8",
                color: userInfo.status === "Active" ? "#1aaf78" : "#dc2626",
                fontWeight: 500,
                borderRadius: 8,
                padding: "2.5px 13px",
                fontSize: "13px",
                marginLeft: 8,
              }}
            >
              {userInfo.status === "Active"
                ? t("active") || "Active"
                : t("inactive") || "Inactive"}
            </span>
          </Typography>
        </Box>
      </Paper>

      <Box
        dir={i18n.dir()}
        sx={{
          mt: 1.5,
          width: "100%",
          borderRadius: 3,
          border: `1px solid ${colors?.border || theme.palette.divider}`,
          p: 0.5,
          backgroundColor: theme.palette.mode === "dark" ? "#0A0F1C" : "#F4F4F5",
          height: { xs: 34, sm: 36 },
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            width: "100%",
            minHeight: 0,

            "& .MuiTabs-flexContainer": {
              height: "100%",
              gap: { xs: 0, sm: 0.75 },
            },

            "& .MuiTabs-scrollButtons": {
              color: colors?.secondary,
            },
            "& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.35,
            },
            "@media (max-width:900px)": {
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                display: "inline-flex",
              },
            },

            "& .MuiTab-root": {
              flex: { xs: "0 0 auto", sm: "0 0 auto", md: 1 },
              minHeight: 0,
              height: { xs: 26, sm: 28 },
              minWidth: { xs: 140, sm: 155, md: 0 },
              px: { xs: 1.25, sm: 1.5 },
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: 12.5, sm: 14 },
              fontWeight: 400,
              color:
                theme.palette.mode === "dark"
                  ? "#94A3B8"
                  : colors?.secondary || "#64748B",
              whiteSpace: "nowrap",
              lineHeight: 1.1,
              "& .MuiTab-wrapper": { whiteSpace: "nowrap", lineHeight: 1.1 },
            },
            "& .Mui-selected": {
              color: `${colors?.text} !important`,
              bgcolor: theme.palette.mode === "dark" ? "#5F6C7E" : "#fff",
              fontWeight: 500,
            },
            "& .MuiTouchRipple-root": { display: "none" },
          }}
        >
          <Tab label={t("Profile")} />
          <Tab label={t("Basic Info")} />
          <Tab label={t("Family")} />
          <Tab label={t("Contact Information")} />
          <Tab label={t("Qualifications")} />
          <Tab label={t("Transfer Case")} />
        </Tabs>
      </Box>

      {/* Content */}
      {tab === 0 && (
        <>
          <ProfileCard />
          <FamilyCard />
          <ContactInfoCard />
          <QualificationsCard />
          <TransferCaseCard />
        </>
      )}
      {tab === 1 && <ProfileCard />}
      {tab === 2 && <FamilyCard />}
      {tab === 3 && <ContactInfoCard />}
      {tab === 4 && <QualificationsCard />}
      {tab === 5 && <TransferCaseCard />}
    </Box>
  );
}
