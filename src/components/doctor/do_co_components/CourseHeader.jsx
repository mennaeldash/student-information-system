import React from "react";
import {
  Box,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";

/**
 * CourseHeader — Figma-exact desktop layout, fully responsive.
 *
 * Breakpoints (MUI):
 *   xs  (<600)  — Mobile: everything stacked, dropdown full-width
 *   sm  (600+)  — Tablet: stacked layout, dropdown below title
 *   md  (900+)  — Laptop: side-by-side, slightly smaller dropdown
 *   lg  (1200+) — Desktop: full Figma layout, 431px dropdown, full spacing
 */
export default function CourseHeader({ data, courses, selectedId, onSelect }) {
  const { t } = useTranslation();
  const c = data?.colors ?? {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: "12px", sm: "14px", lg: "16px" },
        px: { xs: "16px", sm: "20px", md: "24px", lg: "32px" },
        pt: { xs: "16px", sm: "18px", lg: "20px" },
        pb: 0,
      }}
    >
      {/* ── Title row + Dropdown ── */}
      {/* Desktop/Laptop: side-by-side | Tablet/Mobile: stacked */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "12px", md: "16px" },
        }}
      >
        {/* Left block — Semester / Title / Department */}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {/* Semester */}
          <Typography
            component="div"
            sx={{
              fontSize: "0.92rem",
              mb: 1.5,
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
            }}
          >
            <Box
              component="span"
              sx={{ color: c.semesterText, fontWeight: 400 }}
            >
              {data?.semesterLabel || data?.semester}
            </Box>
            {data?.semesterYear && (
              <Box
                component="span"
                sx={{
                  color: c.title,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {data.semesterYear}
              </Box>
            )}
          </Typography>

          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "1.15rem", sm: "1.3rem", lg: "1.6rem" },
              fontWeight: 700,
              color: c.title,
              lineHeight: 1.25,
              mb: 1,
              wordBreak: "break-word",
            }}
          >
            {data?.title}
          </Typography>

          {/* Department dot + text */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "8px", lg: "10px" } }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: c.departmentDot,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: c.departmentText,
                fontWeight: 400,
              }}
            >
              {data?.department}
            </Typography>
          </Box>
        </Box>

        {/* Right block — Select Course dropdown */}
        <FormControl
          size="small"
          sx={{
            width: { xs: "100%", md: 380, lg: 431 },
            maxWidth: "100%",
            flexShrink: 0,
            alignSelf: { xs: "stretch", md: "flex-start" },
          }}
        >
          <Select
            value={selectedId || ""}
            onChange={(e) => onSelect(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            renderValue={(val) => {
              const selected = courses.find((c2) => c2.id === val);
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TuneIcon sx={{ fontSize: 18, color: c.dropdownText }} />
                  <span style={{ color: selected ? c.title : c.dropdownText }}>
                    {selected ? selected.name : t("courses.selectCourse")}
                  </span>
                </Box>
              );
            }}
            sx={{
              bgcolor: c.dropdownBg,
              color: c.title,
              borderRadius: "8px",
              height: 48,
              fontSize: "0.875rem",
              pl: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: c.dropdownBorder,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: c.dropdownBorder,
              },
              "& .MuiSvgIcon-root": {
                color: c.dropdownText,
              },
            }}
          >
            <MenuItem value="" disabled>
              {t("courses.selectCourse")}
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ── Divider (inset — does not reach right edge) ── */}
      <Divider
        sx={{
          borderColor: c.divider,
          mr: { xs: 0, sm: "16px", lg: "1px" },
        }}
      />
    </Box>
  );
}
