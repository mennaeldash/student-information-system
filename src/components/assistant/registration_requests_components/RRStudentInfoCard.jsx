import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function RRStudentInfoCard({ student = {} }) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

 
  const divider = isDark ? "#374151" : "#D9D9D9";
  const titleColor = isDark ? colors?.text || "#E5E7EB" : "#020617";
  const labelColor = isDark ? "#CBD5E1" : "#64748B";
  const valueColor = isDark ? colors?.text || "#E5E7EB" : "#09090B";

  const rows = [
    {
      left: { label: "Student Name", value: student?.name },
      right: { label: "Program", value: student?.program },
    },
    {
      left: { label: "Student ID", value: student?.studentId },
      right: { label: "Level", value: student?.level },
    },
    {
      left: { label: "Cumulative GPA", value: student?.gpa },
      right: { label: "Earned Credits", value: student?.earnedCredits },
    },
    {
      left: {
        label: "Maximum Allowed Credit Hours",
        value: student?.maxAllowedCredits,
      },
      right: { label: "Request Submitted To", value: student?.submittedTo },
    },
  ];

  const Item = ({ label, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: 0,

        // ✅خليها row دايمًا وسيب dir=rtl يظبط الاتجاه
        flexDirection: "row",
        gap: "42px",

        "@media (max-width:1455px)": { gap: "16px" },

        "@media (max-width:680px)": {
          flexDirection: "column",
          alignItems: isRTL ? "flex-end" : "flex-start",
          gap: "6px",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: "18px",
          lineHeight: "16px",
          "@media (max-width:1455px)": { fontSize: "16px", lineHeight: "16px" },
          "@media (max-width:1100px)": { fontSize: "15px", lineHeight: "16px" },
          "@media (max-width:380px)": { fontSize: "13px", lineHeight: "14px" },
          color: labelColor,
          whiteSpace: "nowrap",
          flex: "0 0 auto",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t(label)} :
      </Typography>

      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: "18px",
          lineHeight: "28px",
          "@media (max-width:1455px)": { fontSize: "16px", lineHeight: "24px" },
          "@media (max-width:1100px)": { fontSize: "15px", lineHeight: "22px" },
          "@media (max-width:680px)": { fontSize: "14px", lineHeight: "20px" },
          "@media (max-width:380px)": { fontSize: "12px", lineHeight: "18px" },
          color: valueColor,

          minWidth: 0,
          flex: "1 1 auto",
          overflow: "visible",
          textOverflow: "clip",

          whiteSpace: "normal",
          wordBreak: "normal",
          overflowWrap: "normal",

          "@media (max-width:680px)": { width: "100%" },
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {value ?? "—"}
      </Typography>
    </Box>
  );

  const Row = ({ left, right }) => (
    <Box
      sx={{
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        
        paddingInlineStart: "20px",
        paddingInlineEnd: "80px",

        boxSizing: "border-box",
        gap: "30px",

       
        flexDirection: "row",
        minWidth: 0,

        "@media (max-width:1455px)": {
          height: "auto",
          paddingInlineEnd: "24px",
          paddingInlineStart: "20px",
          alignItems: "flex-start",
          gap: "16px",
        },

        "@media (max-width:1244px)": {
          height: "auto",
          paddingInlineStart: "0px",
          paddingInlineEnd: "0px",
          flexDirection: "column",
          alignItems: isRTL ? "flex-end" : "flex-start",
          justifyContent: "flex-start",
          gap: "12px",
        },

        "@media (max-width:380px)": { gap: "10px" },
      }}
    >
      <Box
        sx={{
          width: "489px",
          minWidth: 0,
          "@media (max-width:1455px)": { width: "auto", flex: "1 1 0" },
          "@media (max-width:1244px)": { width: "100%", flex: "unset" },
        }}
      >
        <Item label={left.label} value={left.value} />
      </Box>

      <Box
        sx={{
          width: "505px",
          minWidth: 0,
          "@media (max-width:1455px)": { width: "auto", flex: "1 1 0" },
          "@media (max-width:1244px)": { width: "100%", flex: "unset" },
        }}
      >
        <Item label={right.label} value={right.value} />
      </Box>
    </Box>
  );

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
       
        paddingInlineStart: "30px",
        paddingInlineEnd: "50px",
        pb: "30px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",

        "@media (max-width:1455px)": {
          paddingInlineEnd: "30px",
          paddingInlineStart: "30px",
        },
        "@media (max-width:1100px)": {
          paddingInlineEnd: "16px",
          paddingInlineStart: "16px",
        },
        "@media (max-width:380px)": {
          paddingInlineEnd: "10px",
          paddingInlineStart: "10px",
          pb: "18px",
        },
      }}
    >
      <Box
        sx={{
          pt: "10px",
          pr: "10px",
          pb: "15px",
          pl: "10px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "100%",
          minWidth: 0,
          "@media (max-width:706px)": { gap: "22px" },
          "@media (max-width:380px)": { gap: "16px" },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "30px",
            lineHeight: "32px",
            color: titleColor,
            textAlign: isRTL ? "right" : "left",
            "@media (max-width:1455px)": { fontSize: "26px", lineHeight: "30px" },
            "@media (max-width:1100px)": { fontSize: "22px", lineHeight: "28px" },
            "@media (max-width:380px)": { fontSize: "18px", lineHeight: "24px" },
          }}
        >
          {t("Student Information")}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px", minWidth: 0 }}>
          {rows.map((r, idx) => (
            <Row key={idx} left={r.left} right={r.right} />
          ))}
        </Box>
      </Box>

      
      <Box sx={{ width: "100%", height: "1px", bgcolor: divider }} />
    </Box>
  );
}