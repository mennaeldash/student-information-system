import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export default function GradingSupportFilters({
  search,
  onSearch,
  filter,
  onFilter,
  selectWidth = 414,
  scopeClass = "gsNoBlue",
}) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const bg = isDark
    ? (colors?.box ? `${colors.box}` : "rgba(255,255,255,0.05)")
    : (colors?.label || "#F8F8F8"); 

  const border = colors?.border || (isDark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.12)");

  const text = colors?.text || (isDark ? "#e2e8f0" : "#1e293b");
  const icon = colors?.secondary || (isDark ? "rgba(226,232,240,0.9)" : "#141B34");

  const inputRoot = {
    height: 48,
    borderRadius: "8px",
    bgcolor: bg,
    fontFamily: ff,

    "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: border },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: border,
      borderWidth: "1px",
    },
    "&.Mui-focused": { boxShadow: "none" },
  };

  return (
    <Box className={scopeClass} sx={{ width: "100%" }}>
      <GlobalStyles
        styles={{
          [`.${scopeClass} .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline`]:
            {
              borderColor: `${border} !important`,
              borderWidth: "1px !important",
            },
          [`.${scopeClass} .MuiOutlinedInput-root.Mui-focused`]: {
            boxShadow: "none !important",
          },
          [`.${scopeClass} input:focus, .${scopeClass} input:focus-visible`]: {
            outline: "none !important",
            boxShadow: "none !important",
          },

          [`.${scopeClass} .MuiInputBase-input`]: {
            color: `${text} !important`,
          },
          [`.${scopeClass} .MuiSelect-select`]: {
            color: `${text} !important`,
          },
          [`.${scopeClass} .MuiSvgIcon-root`]: {
            color: `${icon} !important`,
          },
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: `1fr ${selectWidth}px` },
          gap: "24px",
          alignItems: "center",
        }}
      >
        <TextField
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search ..."
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": inputRoot,
            "& input": {
              fontFamily: ff,
              fontSize: 16,
              py: 0,
              color: text,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ opacity: 0.6, color: icon }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth size="small">
          <Select
            value={filter}
            onChange={(e) => onFilter?.(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <TuneIcon sx={{ opacity: 0.9, color: icon }} />
              </InputAdornment>
            }
            sx={{
              ...inputRoot,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                fontFamily: ff,
                fontSize: 16,
                py: 0,
                color: text,
              },
            }}
          >
            <MenuItem value="all" sx={{ fontFamily: ff, color: text }}>
              Select
            </MenuItem>
            <MenuItem value="submitted" sx={{ fontFamily: ff, color: text }}>
              Submitted
            </MenuItem>
            <MenuItem value="accepted" sx={{ fontFamily: ff, color: text }}>
              Accepted
            </MenuItem>
            <MenuItem value="rejected" sx={{ fontFamily: ff, color: text }}>
              Rejected
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}