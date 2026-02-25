// src/components/assistant/as-at-components/SemesterAttendance.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Stack,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { CircleCheckBig } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

export default function SemesterAttendance() {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";
  const [search, setSearch] = useState("");

  const students = [
    {
      id: 1,
      name: "Mohamed Yasser Mohamed",
      studentId: "2200914",
      attendance: 63,
      present: 5,
      absent: 3,
      sessions: [
        { num: 1, date: "01/02", status: "present" },
        { num: 2, date: "01/04", status: "absent" },
        { num: 3, date: "01/06", status: "present" },
        { num: 4, date: "01/09", status: "absent" },
        { num: 5, date: "01/11", status: "present" },
        { num: 6, date: "01/13", status: "present" },
        { num: 7, date: "01/16", status: "present" },
        { num: 8, date: "01/18", status: "absent" },
      ],
    },
    {
      id: 2,
      name: "Mohamed Yasser Mohamed",
      studentId: "2200914",
      attendance: 70,
      present: 5,
      absent: 2,
      sessions: [
        { num: 1, date: "01/02", status: "present" },
        { num: 2, date: "01/04", status: "absent" },
        { num: 3, date: "01/06", status: "present" },
        { num: 4, date: "01/09", status: "present" },
        { num: 5, date: "01/11", status: "present" },
        { num: 6, date: "01/13", status: "absent" },
        { num: 7, date: "01/16", status: "present" },
        { num: 8, date: "01/18", status: "present" },
      ],
    },
    {
      id: 3,
      name: "Mohamed Yasser Mohamed",
      studentId: "2200914",
      attendance: 70,
      present: 5,
      absent: 2,
      sessions: [
        { num: 1, date: "01/02", status: "present" },
        { num: 2, date: "01/04", status: "absent" },
        { num: 3, date: "01/06", status: "present" },
        { num: 4, date: "01/09", status: "present" },
        { num: 5, date: "01/11", status: "present" },
        { num: 6, date: "01/13", status: "absent" },
        { num: 7, date: "01/16", status: "present" },
        { num: 8, date: "01/18", status: "present" },
      ],
    },
  ];

  const filtered = useMemo(() => {
    if (!search) return students;
    const searchLower = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.studentId.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const mutedTextColor = isDark ? "#94A3B8" : "#6B7280";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${borderColor}`,
        bgcolor: cardBg,
        boxShadow:
          "0 10px 30px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
    >
      {/* Top row: last saved + legend (right side) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
        }}
      >
        {/* Left side empty to match design spacing */}
        <Box />

        {/* Right side: last saved + legend */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              border: "1px dashed #E5E7EB",
              borderRadius: "8px",
              bgcolor: isDark ? "#1E293B" : "#F9FAFB",
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                color: "#475569",
                fontWeight: 400,
              }}
            >
              {t("Last saved") || "Last saved"}: 10:30 AM
            </Typography>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#16A34A",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1,
              border: "1px dashed #E5E7EB",
              borderRadius: "8px",
              bgcolor: isDark ? "#1E293B" : "#F9FAFB",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircleCheckBig size={12} color="#FFFFFF" />
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  color: isDark ? "#E2E8F0" : "#111827",
                  fontWeight: 400,
                }}
              >
                {t("Present") || "Present"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HighlightOffIcon sx={{ fontSize: 12, color: "#FFFFFF" }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  color: isDark ? "#E2E8F0" : "#111827",
                  fontWeight: 400,
                }}
              >
                {t("Absent") || "Absent"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Search + filter row */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          fullWidth
          placeholder={
            t("Search by name or student ID...") ||
            "Search by name or student ID..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: mutedTextColor }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: isDark ? "#020617" : "#F9FAFB",
              height: 40,
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
          }}
        />

        <Select
          size="small"
          value=""
          displayEmpty
          renderValue={(value) => {
            if (value) {
              return (
                <Typography sx={{ fontSize: 14, color: textColor }}>
                  {value}
                </Typography>
              );
            }
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <FilterListIcon sx={{ fontSize: 18, color: mutedTextColor }} />
                <Typography
                  sx={{
                    fontSize: 14,
                    color: isDark ? "#94A3B8" : "#9CA3AF",
                  }}
                >
                  {t("Select") || "Select"}
                </Typography>
              </Box>
            );
          }}
          sx={{
            minWidth: 130,
            height: 40,
            borderRadius: "10px",
            bgcolor: cardBg,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: borderColor,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: borderColor,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2563EB",
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              py: 0,
            },
          }}
        >
          <MenuItem value="">{t("Select") || "Select"}</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          overflow: "auto",
          mb: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: isDark ? "#1E293B" : "#F9FAFB",
              }}
            >
              <TableCell
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  py: 1.5,
                }}
              >
                {t("Student") || "Student"}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  py: 1.5,
                }}
              >
                {t("Attendance") || "Attendance"}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  py: 1.5,
                }}
              >
                {t("Present") || "Present"}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  py: 1.5,
                }}
              >
                {t("Absent") || "Absent"}
              </TableCell>
              {students[0]?.sessions.map((session) => (
                <TableCell
                  key={session.num}
                  align="center"
                  sx={{
                    borderColor: borderColor,
                    color: mutedTextColor,
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    py: 1.5,
                  }}
                >
                  {`Session ${session.num}`}
                  <br />
                  {session.date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((s) => (
              <TableRow
                key={s.id}
                sx={{
                  "&:hover": {
                    bgcolor: isDark ? "#1E293B" : "#F9FAFB",
                  },
                }}
              >
                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDark ? "#1E293B" : "#E5E7EB",
                        color: isDark ? "#94A3B8" : "#6B7280",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: textColor,
                          lineHeight: 1.4,
                        }}
                      >
                        {s.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#6B7280",
                          lineHeight: 1.4,
                        }}
                      >
                        {s.studentId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 1,
                      py: 0.5,
                      borderRadius: "6px",
                      bgcolor: isDark ? "#1E293B" : "#F3F4F6",
                      border: `1px solid ${isDark ? "#334155" : "#E5E7EB"}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: textColor,
                      }}
                    >
                      {s.attendance}%
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: "#16A34A" }} />
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: textColor,
                      }}
                    >
                      {s.present}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CancelIcon sx={{ fontSize: 16, color: "#DC2626" }} />
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: textColor,
                      }}
                    >
                      {s.absent}
                    </Typography>
                  </Box>
                </TableCell>

                {s.sessions.map((session) => (
                  <TableCell
                    key={session.num}
                    align="center"
                    sx={{ borderColor: borderColor, py: 1.5 }}
                  >
                    {session.status === "present" ? (
                      <CheckCircleIcon sx={{ fontSize: 18, color: "#16A34A" }} />
                    ) : (
                      <CancelIcon sx={{ fontSize: 18, color: "#DC2626" }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Typography
        sx={{
          fontSize: 13,
          color: "#6B7280",
          mb: 3,
        }}
      >
        {t("Loading more students...") || "Loading more students..."} (3 of 100)
      </Typography>

      {/* Export button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
          sx={{
            bgcolor: "#2563EB",
            color: "#FFFFFF",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            px: 2.5,
            py: 1.1,
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1D4ED8",
              boxShadow: "none",
            },
          }}
        >
          {t("Export Sheet") || "Export Sheet"}
        </Button>
      </Box>
    </Paper>
  );
}