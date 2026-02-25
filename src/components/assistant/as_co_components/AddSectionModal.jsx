// src/components/assistant/as_co_components/AddSectionModal.jsx
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

export default function AddSectionModal({ open, onClose, onSave, course }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const [formData, setFormData] = useState({
    sectionDate: "",
    startTime: "",
    endTime: "",
    location: "",
    instructor: "",
    students: 35,
  });

  const [errors, setErrors] = useState({});

  const dateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.sectionDate) newErrors.sectionDate = "Required";
    if (!formData.startTime) newErrors.startTime = "Required";
    if (!formData.endTime) newErrors.endTime = "Required";
    if (!formData.location) newErrors.location = "Required";
    if (!formData.instructor) newErrors.instructor = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave?.(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      sectionDate: "",
      startTime: "",
      endTime: "",
      location: "",
      instructor: "",
      students: 35,
    });
    setErrors({});
    onClose?.();
  };

  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const mutedTextColor = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

  const maxCapacity = 40;
  const availableSpots = maxCapacity - Number(formData.students || 0);

  const fieldSx = (hasError = false, clickable = false) => ({
    "& input::-webkit-calendar-picker-indicator": {
      opacity: 0,
      display: "none",
      WebkitAppearance: "none",
    },
    "& input::-webkit-inner-spin-button": { display: "none" },

    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: cardBg,
      height: 48,
      alignItems: "center",
      "& fieldset": {
        borderColor: hasError ? "#DC2626" : borderColor,
      },
      "&:hover fieldset": {
        borderColor: hasError ? "#DC2626" : borderColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: hasError ? "#DC2626" : "#2563EB",
      },
    },

    "& .MuiInputBase-input": {
      paddingRight: "12px",
    },

    ...(clickable
      ? {
          "& .MuiInputBase-root": { cursor: "pointer" },
          "& input": { cursor: "pointer" },
        }
      : {}),
  });

  const openPicker = (ref) => {
    const el = ref?.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else el.focus(); 
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: cardBg,
          border: `1px solid ${borderColor}`,
        },
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: 600,
          color: textColor,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        {t("Add Section") || "Add Section"}
        {course && (
          <Typography
            component="span"
            sx={{
              fontSize: 16,
              fontWeight: 400,
              color: mutedTextColor,
              ml: 1,
            }}
          >
            - {course.code} ({course.title})
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Section Date */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: textColor, mb: 1 }}>
              {t("Section Date") || "Section Date"}
            </Typography>

            <TextField
              fullWidth
              type="date"
              value={formData.sectionDate}
              onChange={(e) => handleChange("sectionDate", e.target.value)}
              error={!!errors.sectionDate}
              helperText={errors.sectionDate}
              inputRef={dateRef}
              onClick={() => openPicker(dateRef)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon
                      sx={{ fontSize: 20, color: mutedTextColor, cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openPicker(dateRef);
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx(!!errors.sectionDate, true)}
            />
          </Box>

          {/* Time Range */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: textColor, mb: 1 }}>
              {t("Time Range") || "Time Range"}
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              {/* Start Time */}
              <TextField
                fullWidth
                type="time"
                label={t("Start Time") || "Start Time"}
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                error={!!errors.startTime}
                helperText={errors.startTime}
                inputRef={startTimeRef}
                onClick={() => openPicker(startTimeRef)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon
                        sx={{ fontSize: 20, color: mutedTextColor, cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openPicker(startTimeRef);
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx(!!errors.startTime, true)}
              />

              {/* End Time */}
              <TextField
                fullWidth
                type="time"
                label={t("End Time") || "End Time"}
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                error={!!errors.endTime}
                helperText={errors.endTime}
                inputRef={endTimeRef}
                onClick={() => openPicker(endTimeRef)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon
                        sx={{ fontSize: 20, color: mutedTextColor, cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openPicker(endTimeRef);
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx(!!errors.endTime, true)}
              />
            </Box>
          </Box>

          {/* Location */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: textColor, mb: 1 }}>
              {t("Location") || "Location"}
            </Typography>

            <TextField
              fullWidth
              placeholder={
                t("e.g., Room 204, Lab3, Building A") || "e.g., Room 204, Lab3, Building A"
              }
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ fontSize: 20, color: mutedTextColor }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx(!!errors.location)}
            />
          </Box>

          {/* Instructor */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: textColor, mb: 1 }}>
              {t("Instructor") || "Instructor"}
            </Typography>

            <TextField
              fullWidth
              placeholder={t("e.g., Eng/ Ahmed Mohamed") || "e.g., Eng/ Ahmed Mohamed"}
              value={formData.instructor}
              onChange={(e) => handleChange("instructor", e.target.value)}
              error={!!errors.instructor}
              helperText={errors.instructor}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ fontSize: 20, color: mutedTextColor }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx(!!errors.instructor)}
            />
          </Box>

          {/* Students */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: textColor, mb: 1 }}>
              {t("Students") || "Students"}
            </Typography>

            <TextField
              fullWidth
              type="number"
              value={formData.students}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10) || 0;
                if (value >= 0 && value <= maxCapacity) handleChange("students", value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon sx={{ fontSize: 20, color: mutedTextColor }} />
                  </InputAdornment>
                ),
              }}
              sx={fieldSx(false)}
            />

            <Typography
              sx={{
                fontSize: 12,
                color: mutedTextColor,
                mt: 0.5,
                ml: 1.75,
              }}
            >
              {t("capacity") || "capacity"}: {formData.students}/{maxCapacity} (
              {availableSpots} {t("Spots Available") || "Spots Available"})
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            px: 2.5,
            py: 1.25,
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            color: textColor,
            bgcolor: cardBg,
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
            },
          }}
        >
          {t("Cancel") || "Cancel"}
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            px: 2.5,
            py: 1.25,
            borderRadius: "8px",
            bgcolor: "#2563EB",
            color: "#FFFFFF",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1D4ED8",
              boxShadow: "none",
            },
          }}
        >
          {t("Save") || "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
