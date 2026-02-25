// TACourseCard Component
// This component displays a styled course card containing course details,
// instructor, coordinator, department, credit hours, prerequisites,
// and a button to add sections. Supports RTL languages and loading skeletons.

import React from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  Skeleton,
  Tooltip,
} from "@mui/material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import { GoBook } from "react-icons/go";
import { AlertCircle, Plus } from "lucide-react";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import {
  User
} from "lucide-react";
export default function CourseCard({
  title,
  code,
  type,
  instructor,
  coordinator,
  creditHours,
  prerequisites,
  department = "Computer Science",
  onAddSections,
  loading = false,
  onRightIconClick, // reserved for future optional actions
}) {
  const { colors } = useThemeContext(); // Theme colors
  const { t } = useTranslation();       // i18n translation hook
  const isRTL = i18n.language === "ar"; // Check if current language uses RTL

  return (
<Box
  dir={isRTL ? "rtl" : "ltr"}
  sx={{
    position: "relative",
    width: "100%",
    display: "block",
    flexShrink: 0,
    minHeight: { xs: 160, sm: "auto", md: "250px" },
    borderRadius: 3,
    bgcolor: colors.box,
    px: { xs: 1.5, sm: 2, md: 2.25 },
    py: { xs: 1.5, sm: 2, md: 2.5 }, 
        boxShadow:
          colors.mode === "dark"
            ? "inset 0 -1px 0 rgba(255,255,255,0.04)"   // Light inner shadow for dark mode
            : "0 1px 0 rgba(0,0,0,.04), inset 0 -1px 0 rgba(0,0,0,.02)", // Default shadow
      }}
    >
      {/* Header: Course Title + Chips */}
      <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }}>
        {loading ? (
          <Skeleton variant="text" width={220} height={28} /> // Loading placeholder
        ) : (
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: 16, sm: 17, md: "25px" },
              fontWeight: 500,
              color: colors.text,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: { xs: "clip", sm: "ellipsis" },
              whiteSpace: { xs: "normal", sm: "nowrap" }, // Wrap on mobile only
              lineHeight: { xs: 1.3, sm: 1.2 },
              wordBreak: "break-word",
              marginInlineEnd: 1.75,
              maxWidth: "100%",
            }}
            title={title} // Tooltip for long titles
          >
            {title}
          </Typography>
        )}

        {/* Course Code + Type Chips */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: (theme) => theme.spacing(1.75),
            ...(isRTL && { marginInlineStart: "12px" }),
          }}
        >
          {loading ? (
            <Skeleton variant="rounded" width={46} height={24} />
          ) : (
            <Chip
              size="small"
              label={code}
              sx={{
                borderRadius: "8px",
                height: "35px",
                width: "80px",
                display: "inline-flex",
                "& .MuiChip-label": { px: 0, fontWeight: 500, fontSize: "15px" },
              }}
            />
          )}

          {loading ? (
            <Skeleton variant="rounded" width={70} height={24} />
          ) : (
            <Chip
              size="small"
              label={type}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                height: "35px",
                width: "80px",
                borderColor: colors.border,
                bgcolor: colors.talab,
                color: "#1F609D",
                display: { xs: "none", sm: "inline-flex" }, // Hide on extra-small screens
                "& .MuiChip-label": { px: 0, fontWeight: 500, fontSize: 14 },
              }}
            />
          )}
        </Box>
      </Stack>

      {/* Divider Between Header and Content */}
      <Divider sx={{ my: { xs: 1.25, md: 1.75 }, borderColor: colors.border }} />

      {/* Main Content: 3 columns layout */}
      <Stack
        direction={{ xs: "column", md: "row" }} // Stacked on mobile, side-by-side on desktop
        spacing={{ xs: 2, md: 0 }}
        justifyContent="space-between"
        alignItems="stretch"
          sx={{
          mt: { xs: 1.5, md: 4 },   // ⬅️ ده اللي ينزّل الكلام لتحت شوية
        }}
      >
        {/* Detail Columns */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            flex: 1,
            rowGap: { xs: 2 },
            columnGap: { md: "56px", lg: "72px", xl: "96px" }, // Spacing between columns
            alignItems: { md: "flex-start" },
            flexWrap: "nowrap",
          }}
        >
          {/* Column 1: Instructor + Department */}
          <Stack
            spacing={1.5}
            sx={{
              minWidth: 0,
              flex: "1 1 0%",
              flexShrink: 0,
              paddingInlineStart: { xs: 1.25, sm: 1.75, md: 2.5 },
            }}
          >
            {/* Instructor Section */}
            <Stack spacing={0.5}>
              <Stack
                direction="row"
                spacing={.25}
                alignItems="center"
                sx={{ paddingInlineStart: 1, columnGap: 0.5 }}
              >
<User size={22} color={colors?.secondary} />
                {loading ? (
                  <Skeleton variant="text" width={80} />
                ) : (
                  <Typography sx={{ color: colors.secondary, fontSize: 15, fontWeight: 500 }}>
                    {t("instructor")}
                  </Typography>
                )}
              </Stack>

              {/* Instructor Name */}
              {loading ? (
                <Skeleton variant="text" width={150} />
              ) : (
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: 17,
                    paddingInlineStart: 3,
                    textAlign: "start",
                  }}
                >
                  {instructor}
                </Typography>
              )}
            </Stack>

            {/* Department Section */}
            <Stack spacing={0.5}>
              <Stack
                direction="row"
                spacing={.25}
                alignItems="center"
                sx={{ paddingInlineStart: 1, columnGap: 0.5 }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.secondary,
                  }}
                >
                  <GoBook size={30} /> {/* Book Icon */}
                </Box>

                {loading ? (
                  <Skeleton variant="text" width={80} />
                ) : (
                  <Typography sx={{ color: colors.secondary, fontSize: 15, fontWeight: 500 }}>
                    {t("department")}
                  </Typography>
                )}
              </Stack>

              {/* Department Name */}
              {loading ? (
                <Skeleton variant="text" width={150} />
              ) : (
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: 17,
                    paddingInlineStart: 3,
                    textAlign: "start",
                  }}
                >
                  {department}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Column 2: Coordinator + Credit Hours */}
          <Stack spacing={1.5} sx={{ minWidth: 0, flex: "1 1 0%", flexShrink: 0 }}>
            {/* Coordinator */}
            <Stack spacing={0.5}>
              <Stack
                direction="row"
                spacing={.25}
                alignItems="center"
                sx={{ paddingInlineStart: 1, columnGap: 0.5 }}
              >
                <PersonOutline sx={{ fontSize: 24, color: colors.secondary }} />
                {loading ? (
                  <Skeleton variant="text" width={80} />
                ) : (
                  <Typography sx={{ color: colors.secondary, fontSize: 15, fontWeight: 500 }}>
                    {t("coordinator")}
                  </Typography>
                )}
              </Stack>

              {/* Coordinator Name */}
              {loading ? (
                <Skeleton variant="text" width={150} />
              ) : (
                <Typography sx={{ color: colors.text, fontSize: 17, paddingInlineStart: 3, textAlign: "start" }}>
                  {coordinator}
                </Typography>
              )}
            </Stack>

            {/* Credit Hours */}
            <Stack spacing={0.5}>
              <Stack
                direction="row"
                spacing={.25}
                alignItems="center"
                sx={{ paddingInlineStart: 1, columnGap: 0.5 }}
              >
                <AccessTimeOutlined sx={{ fontSize: 24, color: colors.secondary }} /> {/* Clock Icon */}
                {loading ? (
                  <Skeleton variant="text" width={80} />
                ) : (
                  <Typography sx={{ color: colors.secondary, fontSize: 15, fontWeight: 500 }}>
                    {t("credit_hours")}
                  </Typography>
                )}
              </Stack>

              {/* Credit Hours Value */}
              {loading ? (
                <Skeleton variant="text" width={40} />
              ) : (
                <Typography sx={{ color: colors.text, fontSize: 17, paddingInlineStart: 3, textAlign: "start" }}>
                  {creditHours}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Column 3: Prerequisites */}
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: "1 1 0%", flexShrink: 0 }}>
            {/* Title */}
            <Stack
              direction="row"
              spacing={.25}
              alignItems="center"
              sx={{ paddingInlineStart: 1, columnGap: 0.5 }}
            >
              <AlertCircle size={24} style={{ color: colors.secondary }} /> {/* Warning icon */}
              {loading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                <Typography sx={{ color: colors.secondary, fontSize: 15, fontWeight: 500 }}>
                  {t("prerequisites")}
                </Typography>
              )}
            </Stack>

            {/* Value */}
            {loading ? (
              <Skeleton variant="text" width={80} />
            ) : (
              <Typography sx={{ color: colors.text, fontSize: 17, paddingInlineStart: 3, textAlign: "start" }}>
                {prerequisites}
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Add Sections Button */}
        <Box
          sx={{
            mt: { xs: 2, md: 0 },
            marginInlineStart: { md: 3 },
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {loading ? (
            <Skeleton variant="rounded" width={120} height={36} />
          ) : (
            <Button
              variant="contained"
              onClick={onAddSections} // Trigger callback
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                width: { xs: "100%", sm: "150px", md: "170px" },
                height: "40px",
                px: 2,
                fontSize: { xs: 13, sm: 14 },
                backgroundColor: colors.tabtn,
                fontWeight: 400,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: isRTL ? "row-reverse" : "row", // Icon direction
              }}
            >
              <Plus
                style={{
                  color: colors?.mode === "dark" ? "black" : "#EFF6FF",
                  width: 16,
                  ...(isRTL
                    ? { marginInlineStart: 8, marginInlineEnd: 0 }
                    : { marginInlineEnd: 8 }),
                }}
              />
              {t("add sections")}
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
}