import React from "react";
import { Box, Typography, Chip, Button, Avatar, Stack } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function StatusChip({ status = "submitted" }) {
  const { colors } = useThemeContext();

  const map = {
    submitted: {
      label: "Submitted",
      bg: colors?.talab || colors?.infoBg || "#DBEEFF",
      fg: colors?.info || "#2563EB",
    },
    accepted: {
      label: "Accepted",
      bg: colors?.successBg || "#DFF7E7",
      fg: colors?.success || "#16A34A",
    },
    rejected: {
      label: "Rejected",
      bg: colors?.dangerBg || "#FADDDD",
      fg: colors?.danger || "#EF4444",
    },
  };

  const v = map[status] || map.submitted;

  return (
    <Chip
      label={
        <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 400 }}>
          {v.label}
        </span>
      }
      sx={{
        width: 89,
        height: 40,
        borderRadius: "16px",
        bgcolor: v.bg,
        color: v.fg,
        "& .MuiChip-label": { px: "10px" },
      }}
    />
  );
}

function InfoBlock({ label, value }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const labelColor =
    colors?.secondary || (isDark ? "rgba(148,163,184,0.9)" : "#8B8F9A");
  const valueColor = colors?.text || (isDark ? "#e2e8f0" : "#000000");

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontFamily: ff,
          fontSize: 16,
          fontWeight: 400,
          color: labelColor,
          lineHeight: "20px",
          mb: "6px",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: ff,
          fontSize: 16,
          fontWeight: 400,
          color: valueColor,
          lineHeight: "20px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function MembersRow({ members = [] }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const shown = members.slice(0, 4);
  const rest = members.length - shown.length;

  const textColor = colors?.text || (isDark ? "#e2e8f0" : "#000");
  const avatarBorder = isDark ? "rgba(255,255,255,0.12)" : "#fff";
  const plusBg = "#7385AE";

  const initials = (name) => {
    const parts = String(name || "").trim().split(/\s+/);
    const a = parts[0]?.[0] || "A";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
      <Stack direction="row" spacing={-1} sx={{ pl: 0.2 }}>
        {shown.map((m, i) => (
          <Avatar
            key={i}
            sx={{
              width: 44,
              height: 44,
              fontFamily: ff,
              fontSize: 14,
              fontWeight: 400,
              border: `2px solid ${avatarBorder}`,
              bgcolor: m?.color || colors?.primary || undefined,
              color: isDark ? "#0b1220" : "#fff",
            }}
          >
            {initials(m?.name)}
          </Avatar>
        ))}

        {rest > 0 && (
          <Avatar
            sx={{
              width: 44,
              height: 44,
              fontFamily: ff,
              fontSize: 14,
              fontWeight: 400,
              border: `2px solid ${avatarBorder}`,
              bgcolor: plusBg,
              color: "#fff",
            }}
          >
            +{rest}
          </Avatar>
        )}
      </Stack>

      <Typography
        sx={{
          fontFamily: ff,
          fontSize: 16,
          fontWeight: 400,
          color: textColor,
          lineHeight: "20px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
          flex: 1,
        }}
      >
        {members.map((m) => m.name).join(" , ")}
      </Typography>
    </Box>
  );
}

function PersonLine({ label, value }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const labelColor =
    colors?.secondary || (isDark ? "rgba(148,163,184,0.9)" : "#8B8F9A");
  const valueColor = colors?.text || (isDark ? "#e2e8f0" : "#000000");

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontFamily: ff,
          fontSize: 16,
          fontWeight: 400,
          color: labelColor,
          lineHeight: "20px",
        }}
      >
        {label} <span style={{ color: valueColor }}>{value}</span>
      </Typography>
    </Box>
  );
}

export default function GradingProjectCard({ item, onView }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const cardBg = colors?.box || (isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF");
  const border =
    colors?.border ||
    (isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)");
  const titleColor = colors?.text || (isDark ? "#e2e8f0" : "#000000");

  const divider = isDark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.10)";

  const btnBg = colors?.cod || "#E6E6E6";
  const btnHover = isDark ? btnBg : "#DEDEDE";
  const btnText = isDark ? colors?.text || "#e2e8f0" : "#000";

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "8px",
        bgcolor: cardBg,
        border: `1px solid ${border}`,
        boxShadow: isDark ? "none" : "0px 0px 4px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "12px",
          pt: "11px",
          pb: "16px",
          gap: "12px",
        }}
      >
        <Typography
          sx={{
            fontFamily: ff,
            fontSize: 18,
            fontWeight: 400,
            lineHeight: "20px",
            color: titleColor,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: 1,
          }}
        >
          {item?.title}
        </Typography>

        <StatusChip status={item?.status} />
      </Box>

      <Box sx={{ height: "1px", bgcolor: divider }} />

      <Box
        sx={{
          px: "35px",
          pt: "16px",
          pb: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "26px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <InfoBlock label="Domain" value={item?.domain} />
          </Box>

          <Box sx={{ width: "260px", minWidth: 0 }}>
            <InfoBlock label="Academic Year" value={item?.academicYear} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Typography
            sx={{
              fontFamily: ff,
              fontSize: 16,
              fontWeight: 400,
              color:
                colors?.secondary ||
                (isDark ? "rgba(148,163,184,0.9)" : "#8B8F9A"),
              lineHeight: "20px",
            }}
          >
            Members
          </Typography>

          <MembersRow members={item?.members || []} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
          <PersonLine label="Supervisor:" value={item?.supervisor} />
          <PersonLine label="Co Supervisor:" value={item?.coSupervisor} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => onView?.(item)}
            disableElevation
            sx={{
              width: 165,
              height: 45,
              borderRadius: "8px",
              bgcolor: btnBg,
              color: btnText,
              fontFamily: ff,
              fontSize: 14,
              fontWeight: 400,
              textTransform: "none",
              "&:hover": { bgcolor: btnHover },
            }}
          >
            view Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
}