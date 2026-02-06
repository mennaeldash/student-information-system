// src/components/DB_Components/ProfileCard.jsx
import React from "react";
import { Paper, Typography, Box, Divider, Avatar, Button } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import UseProfile from "../../hooks/UseProfile";

export default function ProfileCard({ isRTL }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const { profile, error } = UseProfile(); // المنطق كما هو

  if (error) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors?.border || "#e5e7eb"}` }}>
        <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
        <Button variant="outlined" onClick={() => (window.location.href = "/login")}>
          {t("go_to_login", "الذهاب لتسجيل الدخول")}
        </Button>
      </Paper>
    );
  }

  if (!profile) return <Typography>{t("loading", "Loading...")}</Typography>;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        pt: 2.5,
        borderRadius: 3,
        border: `1px solid ${colors?.border}`,
        mb: 3,
        bgcolor: colors?.box || "#fff",
        color: colors?.text || "#000",
        width: "100%",
        fontFamily: colors?.fontFamily,
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexDirection: isRTL ? "row-reverse" : "row",
          minWidth: 0,
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: 16, sm: 18 } }}>
          {t("Basic Information", "Basic Information")}
        </Typography>

      
      </Box>

      <Divider sx={{ mb: { xs: 2, sm: 3 }, bgcolor: colors?.border || "#e3e8ee", height: 1 }} />

      {/* Body */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "88px 1fr", sm: "auto 1fr" },
          gap: { xs: 2, sm: 4 },
          alignItems: "start",
          minWidth: 0,
        }}
      >
        {/* Avatar + ID */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",  
            justifyContent: "flex-start",
            minWidth: 0,
            justifySelf: "start",   
          }}
        >
          <Avatar
            sx={{
              marginLeft:"8px",
              width: { xs: 56, sm: 72 },
              height: { xs: 56, sm: 72 },
              bgcolor: "#e5e7eb",
              fontSize: { xs: 28, sm: 36 },
              mb: { xs: 1.5, sm: 2 },
            }}
            src={profile.avatar}
          >
            {profile.nameEn?.slice(0, 1)}
          </Avatar>

          <Box
            sx={{
              border: `1px solid ${colors?.border || "#e2e8f0"}`,
              color: "#90a3b6",
              fontSize: { xs: 12.5, sm: 13.5 },
              px: { xs: 1.6, sm: 2.3 },
              py: "2.5px",
              borderRadius: 1.5,
              mt: "3px",
              textAlign: "center",
              direction: "ltr",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={profile.student_id}
          >
            {profile.student_id}
          </Box>
        </Box>

        {/* Details grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gridAutoRows: "minmax(min-content, max-content)",
            gap: { xs: 1.75, sm: 3, md: 4 },
            width: "100%",
            alignContent: "start",
            minWidth: 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2, whiteSpace: "nowrap" }}>
              {t("name_en", "Name (English)")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, sm: 15.3 },
                fontWeight: 500,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile.nameEn}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2, whiteSpace: "nowrap" }}>
              {t("name_ar", "Name (Arabic)")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, sm: 15.3 },
                fontWeight: 500,
                direction: "rtl",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile.nameAr}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2 }}>
              {t("nationality", "Nationality")}
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, sm: 15.3 }, wordBreak: "break-word" }}>
              {profile.nationality}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2 }}>
              {t("gender", "Gender")}
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, sm: 15.3 } }}>{profile.gender}</Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2 }}>
              {t("religion", "Religion")}
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, sm: 15.3 } }}>{profile.religion}</Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2 }}>
              {t("dob", "Date of Birth")}
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, sm: 15.3 }, direction: "ltr" }}>
              {profile.dob}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: { xs: "auto", sm: "span 2" }, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, color: colors?.secondary, mb: 0.2 }}>
              {t("nid", "National ID")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, sm: 15.3 },
                direction: "ltr",
                wordBreak: "break-all",
              }}
            >
              {profile.id}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
