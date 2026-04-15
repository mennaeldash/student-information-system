import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function RRNotesActionsCard({
  requestId = 1,
  notes = "",
  setNotes,
  onQuickNote,
}) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const { enqueueSnackbar } = useSnackbar();
  const [openReject, setOpenReject] = useState(false);

  const textPrimary = colors?.text || (isDark ? "#E5E7EB" : "#111827");
  const muted = isDark ? "#CBD5E1" : "#6B7280";
  const inputBg = isDark ? "#111827" : "#FFFFFF";

  const notesBorder = "#71717A";

  const quick = useMemo(
    () => ["Reduce credit hours", "Schedule Conflict Detected"],
    []
  );

  const handleChange = (value) => setNotes?.(value);

  const handleQuick = (q) => {
    const next = String(notes || "").trim() ? `${notes}\n- ${q}` : `- ${q}`;
    setNotes?.(next);
    onQuickNote?.(q);
  };

  const approveMutation = useMutation({
    mutationFn: () =>
      axios.post(`/api/requests/${requestId}/approve`, { notes }),
    onSuccess: () => enqueueSnackbar(t("Request Approved Successfully"), { variant: "success" }),
    onError: () => enqueueSnackbar(t("Error approving request"), { variant: "error" }),
  });

  const editMutation = useMutation({
    mutationFn: () => axios.post(`/api/requests/${requestId}/edit`, { notes }),
    onSuccess: () => enqueueSnackbar(t("Request Updated"), { variant: "info" }),
    onError: () => enqueueSnackbar(t("Error updating request"), { variant: "error" }),
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      axios.post(`/api/requests/${requestId}/reject`, { notes }),
    onSuccess: () => {
      enqueueSnackbar(t("Request Rejected"), { variant: "warning" });
      setOpenReject(false);
    },
    onError: () => enqueueSnackbar(t("Error rejecting request"), { variant: "error" }),
  });

  const isLoading =
    approveMutation.isPending ||
    editMutation.isPending ||
    rejectMutation.isPending;

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        maxWidth: "100%",
        flex: 1,
        minWidth: 0,
        alignSelf: "stretch",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        px: { xs: "16px", md: "24px" },
        py: { xs: "16px", md: "18px" },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: { xs: "20px", md: "27px" },
          fontWeight: 500,
          lineHeight: "28px",
          color: textPrimary,
          m: 0,
        }}
      >
        {t("Teaching Assistant Notes")}
      </Typography>

      <TextField
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        multiline
        fullWidth
        placeholder={t("Write your notes to the student here...")}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            borderRadius: "8px",
            bgcolor: inputBg,
            color: textPrimary,
            fontFamily: "Inter",
            fontSize: "16px",
            height: { xs: "120px", sm: "140px", md: "150px" },
            alignItems: "flex-start",
          },
          "& .MuiInputBase-input": {
            padding: 0,
            height: "100%",
            boxSizing: "border-box",
            overflow: "auto",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: notesBorder,
            borderWidth: "1px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: notesBorder },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: notesBorder },
          "& .MuiInputBase-input::placeholder": {
            color: muted,
            opacity: 1,
            fontSize: { xs: "14px", md: "16px" },
          },
        }}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        {quick.map((q) => (
          <Chip
            key={q}
            label={t(q)}
            onClick={() => handleQuick(q)}
            sx={{
              height: "45px",
              borderRadius: "8px",
              bgcolor: isDark ? "#1F2937" : "#F3F4F6",
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
              px: "10px",
              "& .MuiChip-label": {
                px: 0,
                fontFamily: "Inter",
                fontSize: "16px",
                lineHeight: "14px",
                fontWeight: 400,
                color: isDark ? textPrimary : "rgba(0,0,0,0.70)",
              },
              "&:hover": { bgcolor: isDark ? "#374151" : "#E5E7EB" },
            }}
          />
        ))}
      </Box>

    
      <Box
        sx={{
          width: "100%",
          borderTop: `1px solid ${isDark ? "#374151" : "#D9D9D9"}`,
          mt: "22px",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={() => approveMutation.mutate()}
          disabled={isLoading}
          variant="contained"
          sx={{
            height: "45px",
            width: { xs: "100%", sm: "180px" },
            borderRadius: "8px",
            bgcolor: "#1F609D",
            color: "#FAFAFA",
            textTransform: "none",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1A5082", boxShadow: "none" },
          }}
        >
          {t("Approve Registration")}
        </Button>

        <Button
          onClick={() => editMutation.mutate()}
          disabled={isLoading}
          variant="outlined"
          sx={{
            height: "45px",
            width: { xs: "100%", sm: "180px" },
            borderRadius: "8px",
            borderColor: "#1D4ED9",
            color: "#1D4ED9",
            textTransform: "none",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            "&:hover": { borderColor: "#1D4ED9", bgcolor: "rgba(29,78,217,0.06)" },
          }}
        >
          {t("Edit Request")}
        </Button>

        <Button
          onClick={() => {
            if (!String(notes || "").trim()) {
              enqueueSnackbar(t("Please enter rejection reason"), { variant: "warning" });
              return;
            }
            setOpenReject(true);
          }}
          disabled={isLoading}
          variant="outlined"
          sx={{
            height: "45px",
            width: { xs: "100%", sm: "180px" },
            borderRadius: "8px",
            borderColor: "#E86F6F",
            color: "#E86F6F",
            textTransform: "none",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            "&:hover": { borderColor: "#E86F6F", bgcolor: "rgba(232,111,111,0.08)" },
          }}
        >
          {t("Reject Request")}
        </Button>
      </Box>

      <Dialog open={openReject} onClose={() => setOpenReject(false)}>
        <DialogTitle>{t("Are you sure you want to reject this request?")}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenReject(false)} sx={{ textTransform: "none" }}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => rejectMutation.mutate()}
            disabled={rejectMutation.isPending}
            sx={{ textTransform: "none", color: "#E86F6F" }}
          >
            {t("Confirm Reject")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}