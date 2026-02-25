// src/components/assistant/as-pr-components/ProfileHeader.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditProfileRequestDialog from "./EditProfileRequestDialog.jsx";
import EditProfileRequestForm from "./EditProfileRequestForm.jsx";

function ProfileHeader({ profile, setProfile }) {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();
  const isRTL = i18n.language === "ar";

  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({});

  // ✅ استخدم profile كمصدر الحقيقة
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

  // ✅ كل مرة profile يتغير، جهّز snapshot جديد للفورم
  const snapshotForm = useMemo(
    () => ({
      // top
      name: profile?.name || "",
      status: profile?.status || "",

      // personal
      taId: profile?.personal?.taId || "",
      nationalId: profile?.personal?.nationalId || "",
      nationality: profile?.personal?.nationality || "",
      gender: profile?.personal?.gender || "",
      dateOfBirth: profile?.personal?.dateOfBirth || "",

      // contact
      personalEmail: profile?.contact?.personalEmail || "",
      primaryEmail: profile?.contact?.primaryEmail || "",
      phoneNumber: profile?.contact?.phoneNumber || "",
      currentAddress: profile?.contact?.currentAddress || "",

      // academic
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

  // ✅ مهم: أول ما الصفحة تحمل (أو profile يتغير) نضمن إن form عنده قيم
  useEffect(() => {
    if (!openEdit) setForm(snapshotForm);
  }, [snapshotForm, openEdit]);

  const handleOpen = () => {
    setForm(snapshotForm); // ✅ أهم سطر: يبدأ الفورم بأحدث قيم
    setOpenEdit(true);
  };

  const handleClose = () => setOpenEdit(false);

  const handleSubmit = () => {
    // ✅ Update functional يضمن الحفظ حتى لو في renders
    setProfile((prev) => ({
      ...prev,
      name: form.name,
      status: form.status,
      personal: {
        ...prev.personal,
        taId: form.taId,
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
      {/* الصف الأول: العنوان + الزرار */}
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
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            fontSize: F.buttonText,
            px: 2,
            py: 0.75,
            boxShadow: "none",
            backgroundColor: colors?.tabtn || colors?.primary || "#1F609D",
            color: colors?.chosen,
            alignSelf: { xs: "flex-start", md: "center" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <Box
              sx={{
                width: 15,
                height: 24,
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditOutlinedIcon
                sx={{ fontSize: F.editIcon, color: colors?.chosen }}
              />
            </Box>

            <Typography
              component="span"
              sx={{
                fontSize: F.buttonText,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {t("EditRequest") || "Edit Request"}
            </Typography>
          </Box>
        </Button>
      </Box>

      {/* الصف الثاني: الأفاتار + البيانات */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 2, md: 3 },
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: { xs: 100, md: 100 },
            height: { xs: 100, md: 100 },
            borderRadius: "50px",
            border: `3px solid ${colors?.secondary || "#475569"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: F.avatarChar,
            color: colors?.secondary || "rgba(75, 85, 99, 1)",
            fontWeight: 500,
          }}
        >
          {name?.charAt(0) || "M"}
        </Box>

        {/* Texts */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 1.5, md: 4 },
            }}
          >
            <Typography
              sx={{
                fontSize: F.name,
                fontWeight: 400,
                color: colors?.text || "#111827",
                lineHeight: 1.2,
              }}
            >
              {name}
            </Typography>

            <Box
              sx={{
                px: 3,
                py: 0.5,
                borderRadius: "10px",
                fontSize: F.badge,
                fontWeight: 400,
                border: `1px solid ${badgeText}`,
                bgcolor: badgeBg,
                color: badgeText,
              }}
            >
              {isActive ? t("active") || "Active" : t("inactive") || "Inactive"}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: F.role,
              fontWeight: 400,
              color: colors?.secondary || "#6B7280",
              lineHeight: 1.2,
            }}
          >
            {t("Teaching Assistant at the Faculty of Computers and Information") ||
              "Teaching Assistant at the Faculty of Computers and Information"}
          </Typography>
        </Box>
      </Box>

      {/* ✅ POPUP */}
      <EditProfileRequestDialog
        open={openEdit}
        onClose={handleClose}
        onSubmit={handleSubmit}
      >
        <EditProfileRequestForm form={form} setForm={setForm} />
      </EditProfileRequestDialog>
    </Box>
  );
}

export default ProfileHeader;
