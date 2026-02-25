// src/components/doctor/dr-pr-components/ProfileHeader.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import EditProfileRequestDialog from "./EditProfileRequestDialog.jsx";
import EditProfileRequestForm from "./EditProfileRequestForm.jsx";

export default function ProfileHeader({ profile, setProfile }) {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();
  const isRTL = i18n.language === "ar";

  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({});

  const name = profile?.name || "";
  const status = profile?.status || "";

  const isActive = status === "Active";
  const isDark = colors?.mode === "dark";

  const badgeBg = isActive
    ? isDark
      ? "rgba(22, 163, 74, 0.15)"
      : "#E2F5EA"
    : isDark
    ? "rgba(220, 38, 38, 0.15)"
    : "#FDE8E8";

  const badgeText = isActive ? "#16A34A" : "#DC2626";

  const F = {
    headerTitle: "clamp(20px, calc(20px + 10 * (100vw / 1720)), 30px)",
    buttonText: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
    avatarChar: "clamp(20px, calc(20px + 6 * (100vw / 1720)), 26px)",
    name: "clamp(18px, calc(18px + 6 * (100vw / 1720)), 24px)",
    badge: "clamp(11px, calc(11px + 1 * (100vw / 1720)), 12px)",
    role: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)",
    editIcon: "clamp(14px, calc(14px + 2 * (100vw / 1720)), 16px)",
  };

  const snapshotForm = useMemo(
    () => ({
      name: profile?.name || "",
      status: profile?.status || "",

      doctorId: profile?.personal?.doctorId || "",
      nationalId: profile?.personal?.nationalId || "",
      nationality: profile?.personal?.nationality || "",
      gender: profile?.personal?.gender || "",
      dateOfBirth: profile?.personal?.dateOfBirth || "",

      personalEmail: profile?.contact?.personalEmail || "",
      primaryEmail: profile?.contact?.primaryEmail || "",
      phoneNumber: profile?.contact?.phoneNumber || "",
      currentAddress: profile?.contact?.currentAddress || "",

      department: profile?.academic?.department || "",
      university: profile?.academic?.university || "",
      faculty: profile?.academic?.faculty || "",
      academicDegree: profile?.academic?.academicDegree || "",
      gpa: profile?.academic?.gpa || "",
      graduationYear: profile?.academic?.graduationYear || "",
      previousExperience: profile?.academic?.previousExperience || "",
    }),
    [profile]
  );

  useEffect(() => {
    if (!openEdit) setForm(snapshotForm);
  }, [snapshotForm, openEdit]);

  const handleOpen = () => {
    setForm(snapshotForm);
    setOpenEdit(true);
  };
  const handleClose = () => setOpenEdit(false);

  const handleSubmit = () => {
    setProfile((prev) => ({
      ...prev,
      name: form.name,
      status: form.status,
      personal: {
        ...prev.personal,
        doctorId: form.doctorId,
        nationalId: form.nationalId,
        nationality: form.nationality,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
      },
      contact: {
        ...prev.contact,
        personalEmail: form.personalEmail,
        primaryEmail: form.primaryEmail,
        phoneNumber: form.phoneNumber,
        currentAddress: form.currentAddress,
      },
      academic: {
        ...prev.academic,
        department: form.department,
        university: form.university,
        faculty: form.faculty,
        academicDegree: form.academicDegree,
        gpa: form.gpa,
        graduationYear: form.graduationYear,
        previousExperience: form.previousExperience,
      },
    }));
    setOpenEdit(false);
  };

  const initialChar = (name?.trim()?.[0] || "D").toUpperCase();

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2.5, md: 3 },
        pb: { xs: 2, md: 3 },
        mb: { xs: 3, md: 4 },
        borderBottom: `2px solid ${colors?.border || "#E5E7EB"}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          rowGap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: F.headerTitle,
            fontWeight: 500,
            color: colors?.text || "#111827",
            lineHeight: 1.15,
          }}
        >
          {t("Profile Information") || "Profile Information"}
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<EditOutlinedIcon sx={{ fontSize: F.editIcon }} />}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            fontSize: F.buttonText,
            px: 2.2,
            py: 1,
            boxShadow: "none",
          }}
        >
          {t("Edit Request") || "Edit Request"}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: 86,
            height: 86,
            borderRadius: "50%",
            border: `2px solid ${colors?.border || "#CBD5E1"}`,
            display: "grid",
            placeItems: "center",
            color: colors?.secondary || "#475569",
            fontWeight: 600,
            fontSize: F.avatarChar,
          }}
        >
          {initialChar}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, minWidth: 260 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexWrap: "wrap",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <Typography
              sx={{
                fontSize: F.name,
                fontWeight: 500,
                color: colors?.text || "#111827",
              }}
            >
              {name}
            </Typography>

            <Box
              sx={{
                px: 1.4,
                py: 0.55,
                borderRadius: 999,
                bgcolor: badgeBg,
                color: badgeText,
                fontWeight: 600,
                fontSize: F.badge,
              }}
            >
              {status}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: F.role,
              fontWeight: 400,
              color: colors?.secondary || "#64748B",
            }}
          >
            {t("doctor") || "Doctor"}
          </Typography>
        </Box>
      </Box>

      <EditProfileRequestDialog
        open={openEdit}
        onClose={handleClose}
        onSubmit={handleSubmit}
      >
        <EditProfileRequestForm form={form} setForm={setForm} onSubmit={handleSubmit} />
      </EditProfileRequestDialog>
    </Box>
  );
}
