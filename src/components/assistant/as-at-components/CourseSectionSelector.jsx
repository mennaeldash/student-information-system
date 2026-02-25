// src/components/assistant/as-at-components/CourseSectionSelector.jsx
import React, { useState } from "react";
import { Box, Paper, TextField, MenuItem, Typography } from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  User
} from "lucide-react";

import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

function LabeledSelect({ label, required, value, onChange, children }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const borderColor = colors?.border || (isDark ? "#1E293B" : "#D1D5DB");
  const bg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const labelColor = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          fontSize: 15,
          fontWeight: 500,
          color: labelColor,
          mb: 0.5,
        }}
      >
        {label}
        {required && <span style={{ color: "#EF4444" }}> *</span>}
      </Typography>

      <TextField
        select
        fullWidth
        size="small"
        value={value}
        onChange={onChange}
        SelectProps={{ displayEmpty: true }}
        sx={{
          "& .MuiOutlinedInput-root": {
            minHeight: 48,
            borderRadius: "8px",
            bgcolor: bg,
            fontSize: 14,
            "& fieldset": {
              borderColor: borderColor,
            },
            "&:hover fieldset": {
              borderColor: borderColor,
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563EB",
              borderWidth: 1,
            },
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            py: 1.5,
            color: textColor,
          },
        }}
      >
        {children}
      </TextField>
    </Box>
  );
}

export default function CourseSectionSelector({ showDateTime = true }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";
  const { t } = useTranslation();

  const [course, setCourse] = useState("");
  const [section, setSection] = useState("S01");
  const [session, setSession] = useState("Session 1 - 01/02/2025");

  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const iconBorderColor = isDark ? "#1E293B" : "#E5E7EB";
  const iconBg = isDark ? "#1E293B" : "#FFFFFF";
  const iconColor = isDark ? "#E2E8F0" : "#111827";
  const infoBg = isDark ? "#111827" : "#F1F5F9";
  const infoText = colors?.secondary || (isDark ? "#94A3B8" : "#4B5563");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "12px",
        border: `1px solid ${borderColor}`,
        bgcolor: cardBg,
        boxShadow: isDark
          ? "0 1px 3px rgba(0,0,0,0.4)"
          : "0 6px 18px rgba(15,23,42,0.06)",
      }}
    >
      {/* Header with icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          columnGap: 1,
        }}
      >
        <Box
          sx={{
            idth: 24,
            height: 24,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: iconBg,
            flexShrink: 0,
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: 16, color: iconColor }} />
        </Box>

        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 400,
            color: textColor,
          }}
        >
          {t("Course and Section Selection") ||
            "Course and Section Selection"}
        </Typography>
      </Box>

      {/* 3 selects row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          columnGap: 2,
          rowGap: 2,
          mb: 2.5,
        }}
      >
        <LabeledSelect
          label={t("course")}
          required
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <MenuItem value="">{t("select_course")}</MenuItem>
          <MenuItem value="CS101">CS101 - Intro to Programming</MenuItem>
          <MenuItem value="CS201">CS201 - Data Structures</MenuItem>
        </LabeledSelect>

        <LabeledSelect
          label={t("Section Number")}
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <MenuItem value="">{t("select_section")}</MenuItem>
          <MenuItem value="S01">S01</MenuItem>
          <MenuItem value="S02">S02</MenuItem>
        </LabeledSelect>

        <LabeledSelect
          label={t("Session Date")}
          value={session}
          onChange={(e) => setSession(e.target.value)}
        >
          <MenuItem value="">{t("select_session")}</MenuItem>
          <MenuItem value="Session 1 - 01/02/2025">
            Session 1 - 01/02/2025
          </MenuItem>
          <MenuItem value="Session 2 - 01/09/2025">
            Session 2 - 01/09/2025
          </MenuItem>
        </LabeledSelect>
      </Box>

      {/* Info strip */}
      <Box
        sx={{
          mt: 0,
          borderRadius: "8px",
          bgcolor: "#F4F4F5",
          px: 2.5,
          py: 0.5,
          minHeight: 52,
          display: "inline-flex",
          alignItems: "center",
          columnGap: 3,
          rowGap: 1.5,
          flexWrap: "wrap",
      
        }}
      >
        {showDateTime && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarMonthIcon sx={{ fontSize: 20, color: "#71717A" }} />
              <Typography sx={{ fontSize: 14, color: "#09090B" }}>
                2025-02-1
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AccessTimeIcon sx={{ fontSize: 20, color: "#71717A" }} />
              <Typography sx={{ fontSize: 14, color: "#09090B" }}>
                MWF 9:00-10:00 AM
              </Typography>
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <LocationOnIcon sx={{ fontSize: 20, color: "#71717A" }} />
          <Typography sx={{ fontSize: 14, color: "#09090B" }}>
            CS Building 101
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <PeopleIcon sx={{ fontSize: 20, color: "#71717A" }} />
          <Typography sx={{ fontSize: 14, color: "#09090B"}}>
            100 Student
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
  <User size={20} color={"#71717A"} />
  <Typography sx={{ fontSize: 14, color: "#09090B" }}>
    Eng/ Ahmed Mohamed
  </Typography>
</Box>
      </Box>
    </Paper>
  );
}