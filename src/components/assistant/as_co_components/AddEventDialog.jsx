// src/components/assistant/as_co_components/AddEventDialog.jsx
import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

export default function AddEventDialog({ open, onClose, onSave }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: "",
    eventType: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    group: "",
    location: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleSave = () => {
    onSave?.(form);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.12)",
          bgcolor: colors?.box || "#FFFFFF",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 4,
          bgcolor: colors?.background || "#F5F7FB",
        }}
      >
        <Box
          sx={{
            bgcolor: colors?.box || "#FFFFFF",
            borderRadius: 3,
            p: 4,
            border: `1px solid ${colors?.border || "#E4E4E7"}`,
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontSize: 20,
              fontWeight: 600,
              color: colors?.text || "#111827",
            }}
          >
            {t("addEvent.title", "Add Event")}
          </Typography>

          <Stack spacing={2.5}>
            {/* Title field */}
            <Box>
              <Typography sx={{ mb: 0.5, fontSize: 14, color: "#000000ff" }}>
                {t("addEvent.fields.eventTitle", "Title")}
              </Typography>
              <TextField
                fullWidth
                placeholder={t(
                  "addEvent.placeholders.exampleTitle",
                  "e.g., Computer Programming"
                )}
                size="small"
                value={form.title}
                onChange={handleChange("title")}
              />
            </Box>

            {/* Event select */}
        <Box>
  <Typography sx={{ mb: 0.5, fontSize: 14, color: "#000000ff" }}>
    {t("addEvent.fields.eventType", "Event")}
  </Typography>
  <TextField
    select
    fullWidth
    size="small"
    value={form.eventType}
    onChange={handleChange("eventType")}
    SelectProps={{
      displayEmpty: true,
      renderValue: (selected) => {
        if (!selected) {
          return (
            <Typography sx={{ color: "#9CA3AF" }}>
              {t(
                "addEvent.placeholders.selectEvent",
                "Select Event"
              )}
            </Typography>
          );
        }
        // نخلي اللي يبان هو الليبل اللطيف مش value الخام
        const labels = {
          lecture: "Lecture",
          section: "Section",
          lab: "Lab",
          meeting: "Meeting",
        };
        return labels[selected] || selected;
      },
    }}
  >
    <MenuItem value="lecture">Lecture</MenuItem>
    <MenuItem value="section">Section</MenuItem>
    <MenuItem value="lab">Lab</MenuItem>
    <MenuItem value="meeting">Meeting</MenuItem>
  </TextField>
</Box>

            {/* Day of week */}
            <Box>
              <Typography sx={{ mb: 0.5, fontSize: 14, color: "#000000ff" }}>
                {t("addEvent.fields.dayOfWeek", "Day of the week")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={form.dayOfWeek}
                onChange={handleChange("dayOfWeek")}
                InputProps={{
                  startAdornment: (
                    <CalendarMonthOutlinedIcon
                      sx={{ mr: 1, fontSize: 18, color: "#9CA3AF" }}
                    />
                  ),
                }}
              >
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
              </TextField>
            </Box>

            {/* Time range */}
            <Box>
              <Typography sx={{ mb: 0.5, fontSize: 14, color: "#000000ff" }}>
                {t("addEvent.fields.timeRange", "Time Range")}
              </Typography>

              <Stack direction="row" spacing={2}>
                {/* Start Time */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ mb: 0.5, fontSize: 12, color: "#9CA3AF" }}
                  >
                    {t("addEvent.fields.startTime", "Start Time")}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t(
                      "addEvent.placeholders.startTime",
                      "--:--"
                    )}
                    value={form.startTime}
                    onChange={handleChange("startTime")}
                    InputProps={{
                      startAdornment: (
                        <AccessTimeIcon
                          sx={{ mr: 1, fontSize: 18, color: "#9CA3AF" }}
                        />
                      ),
                    }}
                  />
                </Box>

                {/* End Time */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ mb: 0.5, fontSize: 12, color: "#9CA3AF" }}
                  >
                    {t("addEvent.fields.endTime", "End Time")}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t("addEvent.placeholders.endTime", "--:--")}
                    value={form.endTime}
                    onChange={handleChange("endTime")}
                    InputProps={{
                      startAdornment: (
                        <AccessTimeIcon
                          sx={{ mr: 1, fontSize: 18, color: "#9CA3AF" }}
                        />
                      ),
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Group */}
            <Box>
              <Typography sx={{ mb: 0.5, fontSize: 14, color: "#000000ff" }}>
                {t("addEvent.fields.group", "Group")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={form.group}
                onChange={handleChange("group")}
      SelectProps={{
    displayEmpty: true,
    renderValue: (selected) => {
      if (!selected) {
        return (
          <Typography sx={{ color: "#9CA3AF" }}>
            {t(
              "addEvent.placeholders.selectGroup",
              "Select Group"
            )}
          </Typography>
        );
      }
      return selected;
    },
  }}
  InputProps={{
    startAdornment: (
      <GroupOutlinedIcon
        sx={{ mr: 1, fontSize: 18, color: "#9CA3AF" }}
      />
    ),
  }}
>
                <MenuItem value="Group A">Group A</MenuItem>
                <MenuItem value="Group B">Group B</MenuItem>
                <MenuItem value="Group C">Group C</MenuItem>
                <MenuItem value="Group D">Group D</MenuItem>
              </TextField>
            </Box>

            {/* Location */}
            <Box>
              <Typography sx={{ mb: 0.5, fontSize: 14, color: "#000000ff" }}>
                {t("addEvent.fields.location", "Location")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder={t(
                  "addEvent.placeholders.location",
                  "e.g., Room 204, Lab3, Building A"
                )}
                value={form.location}
                onChange={handleChange("location")}
                InputProps={{
                  startAdornment: (
                    <RoomOutlinedIcon
                      sx={{ mr: 1, fontSize: 18, color: "#9CA3AF" }}
                    />
                  ),
                }}
              />
            </Box>

            {/* Actions */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                }}
              >
                {t("addEvent.actions.cancel", "Cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  bgcolor: colors.primary,
                }}
              >
                {t("addEvent.actions.save", "Save")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
