import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import SectionDetailsModal from "./SectionDetailsModal";

/* ─────────────────────────────────────────────
   SectionInfoItem — one labelled info block
   (Instructor / Location / Schedule)
───────────────────────────────────────────── */
function SectionInfoItem({ icon: Icon, label, value }) {
  const { colors } = useThemeContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
      {/* Icon + Label row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon sx={{ fontSize: 20, color: colors?.secondary ?? "#64748B" }} />
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 500,
            color: colors?.secondary ?? "#64748B",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
      {/* Value */}
      <Typography
        sx={{
          fontSize: "17px",
          fontWeight: 500,
          color: colors?.text ?? "#09090B",
          lineHeight: 1.4,
          mt: 0.5,
          pl: "14px",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   SectionCard — one section entry
───────────────────────────────────────────── */
function SectionCard({ section, onViewDetails }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#0F172A" : "#FFFFFF",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
        borderRadius: "10px",
        pt: "10px",
        pr: "20px",
        pb: "15px",
        pl: "40px",
        mb: "16px",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: { xs: "none", md: "translateY(-1px)" },
          boxShadow: {
            xs: "none",
            md: isDark
              ? "0 4px 16px rgba(0,0,0,0.45)"
              : "0 4px 16px rgba(0,0,0,0.08)",
          },
        },
      }}
    >
      {/* ── Header: title (left) + icon badge (right) ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 600,
            color: colors?.text ?? "#09090B",
          }}
        >
          {section.title}
        </Typography>

        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "6px",
            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#F4F4F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MenuBookIcon
            sx={{ fontSize: 16, color: colors?.secondary ?? "#64748B" }}
          />
        </Box>
      </Box>

      {/* ── Divider ── */}
      <Divider
        sx={{
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB",
          my: "12px",
        }}
      />

      {/* ── Info grid: 3 cols desktop, 2 tablet, 1 mobile ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: { xs: "16px", sm: "24px" },
          mt: 1,
        }}
      >
        <SectionInfoItem
          icon={PersonIcon}
          label={t("courses.instructor")}
          value={section.instructor}
        />
        <SectionInfoItem
          icon={LocationOnIcon}
          label={t("courses.location")}
          value={section.location}
        />
        <SectionInfoItem
          icon={AccessTimeIcon}
          label={t("courses.schedule")}
          value={`${section.days} - ${section.time}`}
        />
      </Box>

      {/* ── Action row: button aligned right, below info grid ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "stretch", sm: "flex-end" },
          mt: "12px",
        }}
      >
        <Box
          component="button"
          onClick={() => onViewDetails?.(section)}
          sx={{
            height: 36,
            px: "16px",
            borderRadius: "6px",
            border: "none",
            bgcolor: "#1F609D",
            color: "#FFFFFF",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            width: { xs: "100%", sm: "auto" },
            transition: "background 0.15s",
            "&:hover": { bgcolor: "#1A5089" },
            "&:active": { bgcolor: "#164578" },
          }}
        >
          {t("courses.viewDetails")}
        </Box>
      </Box>
    </Box>
  );
}


/* ─────────────────────────────────────────────
   CourseSections — main exported component
───────────────────────────────────────────── */
export default function CourseSections({ sections = [], branches = [] }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  const [selectedBranch, setSelectedBranch] = useState(
    branches.length > 0 ? branches[0].id : ""
  );

  // Modal state — single instance
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (section) => {
    setSelectedSection(section);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Filter sections by selected branch (if branches exist)
  const visibleSections =
    branches.length > 0
      ? sections.filter((s) => s.branchId === selectedBranch)
      : sections;

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Branch selector — always shown, sits directly under tabs ── */}
      {branches.length > 0 && (
        <FormControl
          size="small"
          sx={{ mb: "20px", width: { xs: "100%", sm: 420 } }}
        >
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            renderValue={(val) => {
              const selected = branches.find((b) => b.id === val);
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TuneIcon
                    sx={{
                      fontSize: 18,
                      color: isDark
                        ? colors?.secondary ?? "#94A3B8"
                        : "#71717A",
                    }}
                  />
                  <span
                    style={{
                      color: selected
                        ? colors?.text ?? "#09090B"
                        : isDark
                          ? colors?.secondary ?? "#94A3B8"
                          : "#71717A",
                      fontSize: "0.875rem",
                    }}
                  >
                    {selected ? selected.label : t("courses.selectBranch")}
                  </span>
                </Box>
              );
            }}
            sx={{
              height: 40,
              borderRadius: "8px",
              bgcolor: isDark
                ? colors?.cod ?? "#1E293B"
                : colors?.background ?? "#F8F8F8",
              fontSize: "0.875rem",
              pl: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(0,0,0,0.2)",
              },
              "& .MuiSvgIcon-root": {
                color: isDark
                  ? colors?.secondary ?? "#94A3B8"
                  : "#71717A",
              },
            }}
          >
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* ── Section cards — plain vertical list ── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {visibleSections.length === 0 ? (
          <Box sx={{ py: "40px", textAlign: "center" }}>
            <Typography
              sx={{ fontSize: "14px", color: colors?.secondary ?? "#64748B" }}
            >
              {t("courses.noSections")}
            </Typography>
          </Box>
        ) : (
          visibleSections.map((section) => (
            <SectionCard key={section.id} section={section} onViewDetails={handleViewDetails} />
          ))
        )}
      </Box>

      {/* ── Section Details Modal (single instance) ── */}
      <SectionDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        section={selectedSection}
      />
    </Box>
  );
}
