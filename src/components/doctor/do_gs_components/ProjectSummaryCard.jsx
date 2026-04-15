import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function Label({ children }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  return (
    <Typography
      sx={{
        fontFamily: ff,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "20px",
        color: colors?.secondary || (isDark ? "#94A3B8" : "#8B8F9A"),
      }}
    >
      {children}
    </Typography>
  );
}

function Value({ children }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  return (
    <Typography
      sx={{
        fontFamily: ff,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        color: colors?.text || (isDark ? "#E2E8F0" : "#111827"),
      }}
    >
      {children}
    </Typography>
  );
}

function MembersAvatars({ members = [] }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const shown = members.slice(0, 5);
  const initials = (name) => {
    const parts = String(name || "").trim().split(/\s+/);
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "M";
  };

  return (
    <Stack direction="row" spacing={-1} sx={{ pl: 0.2 }}>
      {shown.map((m, i) => (
        <Avatar
          key={i}
          sx={{
            width: 28,
            height: 28,
            fontSize: "11px",
            fontFamily: ff,
            fontWeight: 500,
            bgcolor: m?.color || colors?.primary || "#8B5CF6",
            color: "#fff",
            border: `2px solid ${isDark ? "rgba(255,255,255,0.12)" : "#fff"}`,
          }}
        >
          {initials(m?.name)}
        </Avatar>
      ))}
    </Stack>
  );
}

export default function ProjectSummaryCard({ item }) {
  const description =
    item?.description ||
    "This project focuses on building an AI chatbot to assist campus students with daily tasks, course information, and administrative queries using natural language processing.";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "138px",
        px: "35px",
        pt: "22px",
        pb: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <Box>
        <Label>Description</Label>
        <Box sx={{ mt: "10px", maxWidth: "641px" }}>
          <Value>{description}</Value>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Label>
            Supervisor:{" "}
            <span style={{ color: "inherit" }}>
              <Value>{item?.supervisor || "Dr. Ahmed Ali"}</Value>
            </span>
          </Label>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Label>
            Co Supervisor:{" "}
            <span style={{ color: "inherit" }}>
              <Value>{item?.coSupervisor || "Eng. Salma Fawzy"}</Value>
            </span>
          </Label>
        </Box>
      </Box>

      <Box>
        <Label>Members</Label>
        <Box sx={{ mt: "10px" }}>
          <MembersAvatars members={item?.members || []} />
        </Box>
      </Box>
    </Box>
  );
}