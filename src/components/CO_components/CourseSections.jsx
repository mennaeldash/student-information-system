import React from "react";
import { Box, Paper, Typography, Chip, Button } from "@mui/material";
import { FaCheck, FaTimes } from "react-icons/fa";
import PersonOutline from "@mui/icons-material/PersonOutline";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// TODO: استبدل هذه الروابط بالروابط الحقيقية لاحقاً
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  sections: `${API_BASE_URL}/sections`,
  sectionDetails: `${API_BASE_URL}/sections/:id`,
  selectSection: `${API_BASE_URL}/sections/:id/select`
};

const sections = [
  {
    number: "001",
    status: "Available",
    instructor: "Dr. Smith",
    schedule: "Mon, Wed 10:00-11:30 AM",
    location: "Science Building, Room 101",
    enrolled: 25,
    capacity: 30,
  },
  {
    number: "002",
    status: "Full",
    instructor: "Dr. Johnson",
    schedule: "Tue, Thu 1:00-2:30 PM",
    location: "Engineering Building, Room 205",
    enrolled: 30,
    capacity: 30,
  },
  {
    number: "003",
    status: "Available",
    instructor: "Dr. Williams",
    schedule: "Fri 2:00-4:00 PM",
    location: "Arts Building, Room 302",
    enrolled: 15,
    capacity: 25,
  }
];

const statusChip = (status, t) => {
  if (status === "Available") {
    return (
      <Chip
        icon={<FaCheck style={{ color: "#166534", fontSize: '0.75rem' }} />}
        label={t("Available")}
        size="small"
        sx={{
          p: '0 6px',
          height: '24px',
          bgcolor: "#DCFCE7",
          color: "#166534",
          fontWeight: 500,
          "& .MuiChip-icon": { ml: '4px', display: 'flex', alignItems: 'center' }
        }}
      />
    );
  }
  return (
    <Chip
      icon={<FaTimes style={{ color: "#B91C1C", fontSize: '0.75rem' }} />}
      label={t("Full")}
      size="small"
      sx={{
        p: '0 6px',
        height: '24px',
        bgcolor: "#FEE2E2",
        color: "#B91C1C",
        fontWeight: 500,
        "& .MuiChip-icon": { ml: '4px', display: 'flex', alignItems: 'center' }
      }}
    />
  );
};

const SectionCard = ({ section, onSelectSection }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isAvailable = section.status === "Available";
  const topBorderColor = isAvailable ? "#166534" : "#EF4444";

  return (
    <Box sx={{ width: 370 }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 2.5,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.box,
          overflow: 'hidden',
          boxShadow: colors.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', bgcolor: topBorderColor }} />
        <Box sx={{ p: 2.5, pt: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: colors.text }}>
              {t("Section")} {section.number}
            </Typography>
            {statusChip(section.status, t)}
          </Box>

          <Box sx={{ display: "flex", flexDirection: 'column', gap: 1.5, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <PersonOutline sx={{ fontSize: 20, color: colors.textSecondary }} />
              <Typography variant="body2" color={colors.textSecondary}>{section.instructor}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <AccessTimeOutlined sx={{ fontSize: 20, color: colors.textSecondary }} />
              <Typography variant="body2" color={colors.textSecondary}>{section.schedule}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <LocationOnOutlined sx={{ fontSize: 20, color: colors.textSecondary }} />
              <Typography variant="body2" color={colors.textSecondary}>{section.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <GroupOutlined sx={{ fontSize: 20, color: colors.textSecondary }} />
              <Typography variant="body2" color={colors.textSecondary}>{section.enrolled}/{section.capacity} {t("Students")}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!isAvailable}
              onClick={() => onSelectSection?.(section)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
                bgcolor: isAvailable 
                  ? (colors.mode === 'dark' ? '#1E293B' : '#18181B')
                  : (colors.mode === 'dark' ? colors.border : '#E5E7EB'),
                color: isAvailable 
                  ? (colors.mode === 'dark' ? '#E2E8F0' : "white")
                  : colors.textSecondary,
                fontWeight: 600,
                fontSize: '14px',
                py: 1.2,
                '&:hover': { 
                  bgcolor: isAvailable 
                    ? (colors.mode === 'dark' ? '#334155' : '#27272A')
                    : (colors.mode === 'dark' ? colors.border : '#E5E7EB')
                },
                '&.Mui-disabled': { 
                  bgcolor: colors.mode === 'dark' ? colors.border : '#E5E7EB', 
                  color: colors.textSecondary 
                },
              }}
            >
              {t("Select Section")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default function CourseSections({ sections: propSections = sections, onSelectSection }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Box sx={{ 
      p: 0, 
      bgcolor: colors.background,
      width: '100%',
      minWidth: 0
    }}>
      <Box sx={{ 
        display: "flex", 
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 2, sm: 3 },
        justifyContent: "flex-start",
        flexWrap: { xs: 'wrap', lg: 'nowrap' },
      }}>
        <SectionCard section={propSections[0]} onSelectSection={onSelectSection} />
        <SectionCard section={propSections[1]} onSelectSection={onSelectSection} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <SectionCard section={propSections[2]} onSelectSection={onSelectSection} />
      </Box>
    </Box>
  );
}