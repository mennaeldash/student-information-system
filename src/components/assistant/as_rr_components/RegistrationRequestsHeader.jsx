// src/components/assistant/as_rr_components/RegistrationRequestsHeader.jsx
import React from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  FormControl,
  Chip,
} from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function StatItem({ label, value, tone }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const palette = {
    info: {
      fg: colors?.info || "#2563EB",
      bg: colors?.infoBg || "#EEF3FF",
      bgDark: "rgba(37,99,235,0.14)",
    },
    warning: {
      fg: colors?.warning || "#F59E0B",
      bg: colors?.warningBg || "#F4F2FF",
      bgDark: "rgba(245,158,11,0.14)",
    },
    success: {
      fg: colors?.success || "#16A34A",
      bg: colors?.successBg || "#EFFFF4",
      bgDark: "rgba(22,163,74,0.14)",
    },
    edit: {
      fg: colors?.edit || "#D97706",
      bg: colors?.editBg || "#FFF5E6",
      bgDark: "rgba(217,119,6,0.14)",
    },
    danger: {
      fg: colors?.danger || "#EF4444",
      bg: colors?.dangerBg || "#FFECEC",
      bgDark: "rgba(239,68,68,0.14)",
    },
  };

  const v = palette[tone] || palette.info;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <Typography
        sx={{
          fontFamily: ff,
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "20px",
          color: colors?.text,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>

      <Chip
        label={
          <span style={{ fontFamily: ff, fontSize: 16, fontWeight: 600 }}>
            {value}
          </span>
        }
        sx={{
          height: "44px",
          width: "50px",
          borderRadius: "12px",
          px: "10px",
          bgcolor: isDark ? v.bgDark : v.bg,
          color: v.fg,
          "& .MuiChip-label": { px: 0 },
        }}
      />
    </Box>
  );
}

export default function RegistrationRequestsHeader({
  title = "Course Registration Review",
  subtitleLines = ["Academic Year 2025-2026", "Second Semester"],
  stats,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const secondaryText = isDark ? "rgba(226,232,240,0.75)" : "#6B7280";
  const borderIdle = isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB";
  const borderHover = isDark ? "rgba(255,255,255,0.18)" : "#D1D5DB";

  // ✅ شكل الحقول
  const inputSx = {
    height: "48px",
    borderRadius: "8px",
    boxShadow: "none",
    bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#F8F8F8",
    fontFamily: ff,

    // (مساعد) بس الأساس هيكون من GlobalStyles بـ !important
    "& .MuiOutlinedInput-notchedOutline": { borderColor: borderIdle },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: borderHover },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: borderIdle,
      borderWidth: "1px",
    },
    "&.Mui-focused": { boxShadow: "none" },
    "&:focus-within": { boxShadow: "none" },

    "& input": { outline: "none" },
    "& input:focus": { outline: "none" },
    "& input:focus-visible": { outline: "none" },
  };

  return (
    <Box className="rrNoBlue" sx={{ width: "100%", maxWidth: "1304px", mx: "auto" }}>
      {/* ✅ ده اللي هيقفل الأزرق 100% حتى لو Theme/GlobalStyles عندك أقوى */}
      <GlobalStyles
        styles={{
          /* Outlined TextField */
          ".rrNoBlue .MuiOutlinedInput-notchedOutline": {
            borderColor: `${borderIdle} !important`,
          },
          ".rrNoBlue .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor: `${borderHover} !important`,
            },
          ".rrNoBlue .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: `${borderIdle} !important`,
              borderWidth: "1px !important",
            },
          ".rrNoBlue .MuiOutlinedInput-root.Mui-focused": {
            boxShadow: "none !important",
            outline: "none !important",
          },

          /* Outlined Select (InputBase) */
          ".rrNoBlue .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: `${borderIdle} !important`,
              borderWidth: "1px !important",
            },
          ".rrNoBlue .MuiInputBase-root.Mui-focused": {
            boxShadow: "none !important",
            outline: "none !important",
          },

          /* Browser focus ring */
          ".rrNoBlue input:focus, .rrNoBlue input:focus-visible": {
            outline: "none !important",
            boxShadow: "none !important",
          },
        }}
      />

      <Box sx={{ textAlign: "center", pt: "10px" }}>
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "30px",
            fontWeight: 400,
            lineHeight: "36px",
            color: isDark ? colors?.text || "#e2e8f0" : "#000000",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "20px",
            color: secondaryText,
            mt: "10px",
          }}
        >
          {subtitleLines?.[0]}
        </Typography>

        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "20px",
            color: secondaryText,
            mt: "6px",
          }}
        >
          {subtitleLines?.[1]}
        </Typography>
      </Box>

      <Box
        sx={{
          height: "1px",
          bgcolor: isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB",
          mt: "28px",
          mb: "32px",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "53px",
          alignItems: "center",
          mb: "18px",
        }}
      >
        <StatItem
          label="Total Requests:"
          value={stats?.total ?? 100}
          tone="info"
        />
        <StatItem
          label="Under Review:"
          value={stats?.underReview ?? 10}
          tone="warning"
        />
        <StatItem
          label="Approved:"
          value={stats?.approved ?? 65}
          tone="success"
        />
        <StatItem
          label="Edit Requested:"
          value={stats?.editRequested ?? 15}
          tone="edit"
        />
        <StatItem
          label="Rejected:"
          value={stats?.rejected ?? 10}
          tone="danger"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 408px" },
          gap: { xs: "14px", md: "20px" },
          alignItems: "center",
          mt: "25px",
        }}
      >
        <TextField
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search ..."
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": inputSx,
            "& input": { fontFamily: ff, fontSize: "16px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth size="small">
          <Select
            value={filter}
            onChange={(e) => onFilterChange?.(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <TuneIcon sx={{ opacity: 1, color: "#141B34" }} />
              </InputAdornment>
            }
            sx={{
              ...inputSx,
              color: "#141B34",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                fontFamily: ff,
              },
            }}
          >
            <MenuItem value="all" sx={{ fontFamily: ff }}>
              Select
            </MenuItem>
            <MenuItem value="under_review" sx={{ fontFamily: ff }}>
              Under Review
            </MenuItem>
            <MenuItem value="approved" sx={{ fontFamily: ff }}>
              Approved
            </MenuItem>
            <MenuItem value="edit_requested" sx={{ fontFamily: ff }}>
              Edit Requested
            </MenuItem>
            <MenuItem value="rejected" sx={{ fontFamily: ff }}>
              Rejected
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}