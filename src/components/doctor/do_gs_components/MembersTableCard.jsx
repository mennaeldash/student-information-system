import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function MemberRow({ member, isHeader = false }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const rowBg = isHeader
    ? (isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB")
    : "transparent";

  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const secondary = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB";

  return (
    <Box
      sx={{
        width: "100%",
        height: "65px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "24px",
        gap: "20px",
        bgcolor: rowBg,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <Box sx={{ width: "45%", display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        {!isHeader && (
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: member?.avatarColor || "#B8BDC7",
              fontSize: "12px",
            }}
          />
        )}
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "14px",
            fontWeight: 400,
            color: isHeader ? secondary : textColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member?.name}
        </Typography>
      </Box>

      <Box sx={{ width: "20%", minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "14px",
            fontWeight: 400,
            color: isHeader ? secondary : textColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member?.id}
        </Typography>
      </Box>

      <Box sx={{ width: "35%", minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: "14px",
            fontWeight: 400,
            color: isHeader ? secondary : textColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member?.role}
        </Typography>
      </Box>
    </Box>
  );
}

export default function MembersTableCard({ members = [] }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";
  const border = isDark ? "rgba(255,255,255,0.10)" : "#D9D9D9";

  return (
    <Box
      sx={{
        px: "16px",
        pb: "16px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          border: `1px solid ${border}`,
          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fff",
        }}
      >
        <MemberRow
          isHeader
          member={{
            name: "Team Member",
            id: "ID",
            role: "Role",
          }}
        />

        {members.map((member, index) => (
          <MemberRow key={member?.id || index} member={member} />
        ))}
      </Box>
    </Box>
  );
}