import React from "react";
import { Box, Typography } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function FileItem({ file }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const itemBg = isDark ? "rgba(255,255,255,0.03)" : "#F3F7FB";
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const secondary = colors?.secondary || (isDark ? "#94A3B8" : "#8B8F9A");

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "66px",
        borderRadius: "8px",
        bgcolor: itemBg,
        px: "16px",
        py: "6px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "#DBEEFF",
          flexShrink: 0,
        }}
      >
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: "#2563EB" }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "18px",
            color: textColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file?.name}
        </Typography>

        <Typography
          sx={{
            mt: "4px",
            fontFamily: ff,
            fontSize: "11px",
            fontWeight: 400,
            lineHeight: "14px",
            color: secondary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file?.size} • {file?.uploadedAt}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ProjectFilesPanel({ files = [] }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const cardBg = colors?.box || (isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF");
  const shadow = isDark ? "none" : "0px 0px 4px rgba(0,0,0,0.25)";
  const titleColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const accent = colors?.info || "#4F46E5";

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "24px",
        bgcolor: cardBg,
        boxShadow: shadow,
        px: "22px",
        py: "18px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "16px",
        }}
      >
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "20px",
            color: titleColor,
          }}
        >
          Project Files
        </Typography>

        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "18px",
            color: accent,
          }}
        >
          {files.length} Files
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </Box>
    </Box>
  );
}