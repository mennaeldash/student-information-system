import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";


const BASE_W = 1728;


const f1728 = (minPx, basePx) =>
  `clamp(${minPx}px, ${(basePx * 100) / BASE_W}vw, ${basePx}px)`;

export default function RRCoursesTableCard({
  courses = [],
  summary = { totalRegistered: "—", maxAllowed: "—" },
  onEditRow,
  onDeleteRow,
}) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const wrapBg = isDark ? "#1F2937" : "#F9FAFB";
  const wrapBorder = isDark ? "#374151" : "#E2E8F0";
  const headerBg = isDark ? "#374151" : "#F1F5F9";
  const border = isDark ? "#374151" : "#E2E8F0";

  const textPrimary = colors?.text || (isDark ? "#E5E7EB" : "#111827");
  const textMuted = isDark ? "#CBD5E1" : "#6B7280";
  const divider = isDark ? "#374151" : "#D9D9D9";

  //  Header Cells 
  const thSx = {
    fontFamily: "Inter",
    fontSize: f1728(14, 18),
    fontWeight: 400,
    lineHeight: f1728(18, 20),
    color: textPrimary,
    bgcolor: headerBg,
    borderBottom: `1px solid ${border}`,
    whiteSpace: "nowrap",
    textAlign: "center",
    py: f1728(10, 16),
    px: f1728(14, 24),
  };

  //  Body Cells 
  const tdSx = {
    fontFamily: "Inter",
    fontSize: f1728(14, 18),
    fontWeight: 500,
    lineHeight: f1728(20, 24),
    color: textPrimary,
    borderBottom: `1px solid ${border}`,
    whiteSpace: "nowrap",
    textAlign: "center",
    py: f1728(10, 16),
    px: f1728(14, 24),
  };

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        px: f1728(16, 24),
        py: f1728(16, 18),
      }}
    >
      {/* ===== Header ===== */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: f1728(20, 28),
            fontWeight: 500,
            lineHeight: f1728(24, 28),
            color: textPrimary,
            textAlign: isRTL ? "right" : "left",
            width: "100%",
          }}
        >
          {t("Registered Courses")}
        </Typography>

        {/* Summary  */}
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: f1728(14, 18),
            fontWeight: 400,
            lineHeight: f1728(20, 28),
            color: textPrimary,
            whiteSpace: { xs: "normal", md: "nowrap" },
            width: { xs: "100%", md: "auto" },
            textAlign: isRTL
              ? { xs: "right", md: "left" }
              : { xs: "left", md: "right" },
          }}
        >
          {t("Total Registered Credit Hours")}:{" "}
          {summary?.totalRegistered ?? "—"} /{" "}
          {summary?.maxAllowed ?? "—"}
        </Typography>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: "100%",
          height: "0.5px",
          bgcolor: divider,
          mt: f1728(10, 12),
          mb: f1728(12, 16),
        }}
      />

      {/* ===== Table Wrapper ===== */}
      <Box
        sx={{
          borderRadius: "8px",
          boxShadow: "0px 0px 4px 0px #00000040",
          border: `1px solid ${wrapBorder}`,
          overflow: "hidden",
          bgcolor: wrapBg,
        }}
      >
        <Box
          sx={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Responsive minWidth */}
          <Table sx={{ minWidth: { xs: 720, md: 820, lg: 980 } }}>
            <TableHead>
              <TableRow>
                {[
                  "Course Code",
                  "Course Name",
                  "Credits",
                  "Section",
                  "Schedule",
                  "Remark",
                  "Action",
                ].map((h) => (
                  <TableCell key={h} sx={thSx}>
                    {t(h)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {courses.map((c, idx) => (
                <TableRow
                  key={c.id || `${c.code}-${idx}`}
                  sx={{ boxShadow: "0px 0px 2px 0px #00000040" }}
                >
                  <TableCell sx={tdSx}>{c.code}</TableCell>

                  {/* Course Name  */}
                  <TableCell
                    sx={{
                      ...tdSx,
                      fontSize: f1728(14, 20),
                      maxWidth: { xs: 180, md: 240, lg: 360 },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: textMuted,
                    }}
                    title={c.name}
                  >
                    {c.name}
                  </TableCell>

                  <TableCell sx={{ ...tdSx, fontSize: f1728(14, 20) }}>
                    {c.credits}
                  </TableCell>

                  <TableCell sx={tdSx}>{c.section}</TableCell>

                  <TableCell
                    sx={{
                      ...tdSx,
                      fontWeight: 400,
                      maxWidth: { xs: 180, md: 220, lg: 300 },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={c.schedule}
                  >
                    {c.schedule}
                  </TableCell>

                  <TableCell sx={tdSx}>{c.remark || "—"}</TableCell>

                  <TableCell
                    sx={{
                      ...tdSx,
                      width: { xs: 92, md: 110, lg: 120 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => onEditRow?.(c)}
                        sx={{ color: "#2563EB" }}
                        title={t("Edit")}
                      >
                        <Edit size={16} />
                      </IconButton>

                      <IconButton
                        onClick={() => onDeleteRow?.(c)}
                        sx={{ color: "#EF4444" }}
                        title={t("Delete")}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ ...tdSx, py: f1728(12, 20), color: textMuted }}>
                    {t("No courses found.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}