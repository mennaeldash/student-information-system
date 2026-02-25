// src/components/assistant/as_sd_components/StudentsFilterBar.jsx
import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

export default function StudentsFilterBar({
  search,
  onSearchChange,
  levelFilter,
  onLevelChange,
  programFilter,
  onProgramChange,
}) {
  const { t } = useTranslation();

  const { theme: appTheme, colors } = useThemeContext();
  const isDark = colors?.mode === "dark" || appTheme === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.5, sm: 2 },
        alignItems: { xs: "stretch", sm: "center" },
      }}
    >
      {/* Search */}
      <TextField
        placeholder={t("Search by name or ID...") || "Search by name or ID..."}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{
          width: { xs: "100%", sm: "100%", md: 550 },
          minWidth: { xs: "100%", sm: 280 },
          "& .MuiOutlinedInput-root": {
            height: { xs: 44, sm: 48 },
            borderRadius: "8px",
            backgroundColor: colors?.box || "#FFFFFF",
            paddingTop: { xs: "8px", sm: "10px" },
            paddingBottom: { xs: "8px", sm: "10px" },
            paddingLeft: { xs: "14px", sm: "16px" },
            paddingRight: { xs: "14px", sm: "16px" },
            gap: { xs: "8px", sm: "10px" },
            "& fieldset": {
              borderColor: colors?.border || "#E5E7EB",
            },
            "&:hover fieldset": {
              borderColor: colors?.border || "#D1D5DB",
            },
            "&.Mui-focused fieldset": {
              borderColor: colors?.primary || "#2563EB",
            },
          },
          "& .MuiInputBase-input": {
            padding: 0,
            color: colors?.text || "#111827",
            fontSize: { xs: 14, sm: 16 },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ marginRight: 0 }}>
              <SearchIcon sx={{ color: colors?.secondary || "#9CA3AF", fontSize: { xs: 18, sm: 20 } }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Level Filter */}
      <Select
        value={levelFilter}
        onChange={(e) => onLevelChange(e.target.value)}
        sx={{
          width: { xs: "100%", sm: "calc(50% - 8px)", md: 325 },
          minWidth: { xs: "100%", sm: 200 },
          height: { xs: 44, sm: 48 },
          borderRadius: "8px",
          backgroundColor: colors?.box || "#FFFFFF",
          "& .MuiSelect-select": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: { xs: "14px", sm: "16px" },
            paddingRight: { xs: "14px", sm: "16px" },
            height: "100%",
            boxSizing: "border-box",
            color: colors?.text || "#111827",
            fontSize: { xs: 14, sm: 16 },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors?.border || "#E5E7EB",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors?.border || "#D1D5DB",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors?.primary || "#2563EB",
          },
          "& .MuiSvgIcon-root": {
            color: colors?.secondary || "#9CA3AF",
          },
        }}
        displayEmpty
        renderValue={(value) =>
          value === "all" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: colors?.secondary || "#9CA3AF" }} />
                <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: colors?.text || "#111827" }}>
                  {t("Levels") || "Levels"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: colors?.text || "#111827" }}>{value}</Typography>
            </Box>
          )
        }
      >
        <MenuItem value="all" sx={{ color: colors?.text || "#111827" }}>{t("All Levels") || "All Levels"}</MenuItem>
        <MenuItem value="Level 1" sx={{ color: colors?.text || "#111827" }}>Level 1</MenuItem>
        <MenuItem value="Level 2" sx={{ color: colors?.text || "#111827" }}>Level 2</MenuItem>
        <MenuItem value="Level 3" sx={{ color: colors?.text || "#111827" }}>Level 3</MenuItem>
      </Select>

      {/* Program Filter */}
      <Select
        value={programFilter}
        onChange={(e) => onProgramChange(e.target.value)}
        sx={{
          width: { xs: "100%", sm: "calc(50% - 8px)", md: 325 },
          minWidth: { xs: "100%", sm: 200 },
          height: { xs: 44, sm: 48 },
          borderRadius: "8px",
          backgroundColor: colors?.box || "#FFFFFF",
          "& .MuiSelect-select": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: { xs: "14px", sm: "16px" },
            paddingRight: { xs: "14px", sm: "16px" },
            height: "100%",
            boxSizing: "border-box",
            color: colors?.text || "#111827",
            fontSize: { xs: 14, sm: 16 },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors?.border || "#E5E7EB",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors?.border || "#D1D5DB",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors?.primary || "#2563EB",
          },
          "& .MuiSvgIcon-root": {
            color: colors?.secondary || "#9CA3AF",
          },
        }}
        displayEmpty
        renderValue={(value) =>
          value === "all" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: colors?.secondary || "#9CA3AF" }} />
                <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: colors?.text || "#111827" }}>
                  {t("All Programs") || "All Programs"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: colors?.text || "#111827" }}>{value}</Typography>
            </Box>
          )
        }
      >
        <MenuItem value="all" sx={{ color: colors?.text || "#111827" }}>
          {t("All Programs") || "All Programs"}
        </MenuItem>
        <MenuItem value="Computer Science" sx={{ color: colors?.text || "#111827" }}>Computer Science</MenuItem>
        <MenuItem value="Information Technology" sx={{ color: colors?.text || "#111827" }}>
          Information Technology
        </MenuItem>
      </Select>
    </Box>
  );
}