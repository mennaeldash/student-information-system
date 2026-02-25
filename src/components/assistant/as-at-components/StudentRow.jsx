// StudentRow.jsx
import React from "react";
import { Box, Avatar, Typography, IconButton, Paper, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useThemeContext } from "../../services/theme_context.jsx";

export default function StudentRow({ student = null }) {
  const { theme } = useThemeContext();

  // sample student fallback
  const s = student || { name: "Mohamed Yasser Mohamed", id: "2200914", status: "present" };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.5,
        borderRadius: 2,
        backgroundColor: theme === "dark" ? "grey.800" : "grey.50",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 48, height: 48 }}>{s.name?.[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1">{s.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {s.id}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip label={s.status === "present" ? "Present" : "Absent"} color={s.status === "present" ? "success" : "error"} />
        <IconButton size="small" aria-label="mark-present">
          <CheckIcon />
        </IconButton>
        <IconButton size="small" aria-label="mark-absent">
          <CloseIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}