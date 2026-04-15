// src/components/doctor/do_db_components/NextSessionCard.jsx
import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { useTranslation } from "react-i18next";

const NextSessionCard = ({ session }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const data = session || {};

  const F = {
    title: "clamp(18px, calc(18px + 12 * (100vw / 1720)), 30px)",
    subText: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
    sectionCode: "clamp(18px, calc(18px + 12 * (100vw / 1720)), 30px)",
    courseName: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
    meta: "clamp(12px, calc(12px + 1 * (100vw / 1720)), 13px)",
    button: "clamp(14px, calc(14px + 4 * (100vw / 1720)), 18px)",
  };

  return (
    <Card
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #423ECD 0%, #423ECD 50%, #6675E1 100%)",
        color: "#FFFFFF",
        borderRadius: "12px",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(99,102,241,0.35)",
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "flex-start",
          pt: { xs: 2.5, md: "40px" },
          pb: { xs: 2.5, md: "28px" },
          pl: { xs: 2, md: "25px" },
          pr: { xs: 2, md: "25px" },
          gap: { xs: 2.5, md: 4 },
        }}
      >
        {/* Left content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{ fontSize: F.title, fontWeight: 600, lineHeight: 1.15 }}
          >
            {t("Next Session")}
          </Typography>

          <Typography
            sx={{ fontSize: F.subText, fontWeight: 400, opacity: 0.85 }}
          >
            {data.startsInText || t("Starting in 45 minutes")}
          </Typography>

          <Typography
            sx={{
              fontSize: F.sectionCode,
              fontWeight: 700,
              mt: 1,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.sectionCode || t("CS101-Lecture 2")}
          </Typography>

          <Typography
            sx={{
              fontSize: F.courseName,
              fontWeight: 400,
              mt: 0.5,
              opacity: 0.9,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.courseName || t("Introduction to Computer Science")}
          </Typography>

          {/* Meta info row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              mt: 2.5,
              fontSize: F.meta,
              opacity: 0.92,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
              <span>{data.location || t("CS Building 101")}</span>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 17 }} />
              <span>{data.timeText || t("MWF 9:00–10:00 AM")}</span>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <GroupOutlinedIcon sx={{ fontSize: 17 }} />
              <span>{data.studentsText || t("120 Students")}</span>
            </Box>
          </Box>
        </Box>

        {/* CTA button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: { xs: "100%", md: "auto" },
            pt: { xs: 0, md: 1 },
          }}
        >
          <Button
            variant="contained"
            component="a"
            href="https://www.webex.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              width: { xs: "100%", md: "190px" },
              height: "48px",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
              backdropFilter: "blur(4px)",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.25)",
              textTransform: "none",
              fontSize: F.button,
              fontWeight: 600,
              color: "#FFFFFF",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0px 8px 28px rgba(0, 0, 0, 0.2)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12))",
              },
            }}
          >
            {t("Start Session")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NextSessionCard;
