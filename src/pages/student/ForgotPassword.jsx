// src/pages/student/ForgotPassword.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";

import { useThemeContext } from "../../services/theme_context.jsx";
import { fetch_theme_colors } from "../../services/theme_service";

const API_BASE = "https://eelu-test.runasp.net/api/authentication_";
const SERVER_BASE = "https://eelu-test.runasp.net";

function resolveLogoUrl(raw) {
  if (!raw) return "";
  const v = String(raw).trim();

  if (/^(data:|blob:|https?:\/\/)/i.test(v)) return v;
  if (v.startsWith("/")) return `${SERVER_BASE}${v}`;
  return `${SERVER_BASE}/${v}`;
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  const { colors: ctxColors, mode: ctxMode } = useThemeContext?.() || {};
  const isDarkFromContext = ctxMode === "dark";

  const [current_theme] = useState("light");
  const [theme_loading, setTheme_loading] = useState(true);
  const [theme_error, setTheme_error] = useState("");
  const [all_colors, setAll_colors] = useState(null);
  const [theme_colors, setTheme_colors] = useState({});

  const [loogo_url, setLogo_url] = useState("");
  const [slogan, setSlogan] = useState("");

  // steps: 1 email -> 2 verify code -> 3 reset password
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const get_colors = async () => {
      try {
        setTheme_loading(true);
        setTheme_error("");
        const colorsAll = await fetch_theme_colors();
        setAll_colors(colorsAll);
      } catch (err) {
        console.error("Error loading theme colors:", err);
        setTheme_error("Failed to load theme colors");
      } finally {
        setTheme_loading(false);
      }
    };
    get_colors();
  }, []);

  useEffect(() => {
    if (!all_colors) return;

    const themeData = all_colors[current_theme] || {};
    setTheme_colors(themeData);

    document.documentElement.setAttribute("data-theme", current_theme);
    Object.entries(themeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        document.documentElement.style.setProperty(`--${key}`, value);
      }
    });

    setLogo_url(resolveLogoUrl(themeData.loogo_url));
    setSlogan(themeData.slogan || "");
  }, [all_colors, current_theme]);

  useEffect(() => {
    const ctxLogo = resolveLogoUrl(ctxColors?.loogo_url);
    if (ctxLogo) setLogo_url(ctxLogo);

    const ctxSlogan = ctxColors?.slogan;
    if (ctxSlogan) setSlogan(ctxSlogan);
  }, [ctxColors?.loogo_url, ctxColors?.slogan]);

  const colors =
    theme_colors && Object.keys(theme_colors).length ? theme_colors : ctxColors || {};

  const isDark =
    (colors?.mode ? colors.mode === "dark" : isDarkFromContext) || false;

  const circleFill = useMemo(() => {
    return isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)";
  }, [isDark]);

  const clearMessages = () => {
    setMsg("");
    setError("");
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    clearMessages();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.title || "Failed to send verification code."
        );
      }

      setMsg(data?.message || "If email exists, code sent.");
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    clearMessages();

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError("Please enter the code.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/verify-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          code: trimmedCode,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.title || "Invalid code.");
      }

      setMsg("Code verified successfully.");
      setStep(3);
    } catch (err) {
      console.error("Verify code error:", err);
      setError(err.message || "Invalid code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!newPassword || !confirmNewPassword) {
      setError("Please enter the new password and confirm it.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          newPassword,
          confirmNewPassword,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.title || "Failed to reset password."
        );
      }

      setMsg(data?.message || "Password changed successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepTitle = () => {
    if (step === 1) return "Forget Password";
    if (step === 2) return "Verify Code";
    return "Reset Password";
  };

  if (theme_loading) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading theme...</p>;
  }

  if (theme_error) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>
        {theme_error}
      </p>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: colors?.background || "#f8fafc",
        color: colors?.text || "#0f172a",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          pt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: colors?.secondary || "#64748b" }}>
          Academic Year 2025-2024
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: colors?.secondary || "#64748b" }}>
            Help &amp; Support,
          </Typography>

          <IconButton
            onClick={() => navigate(-1)}
            size="small"
            sx={{
              border: `1px solid ${colors?.border || "rgba(148,163,184,0.6)"}`,
              borderRadius: 2,
              color: colors?.text || "#0f172a",
              bgcolor: colors?.box || "#ffffff",
            }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>

      {/* Body wrapper */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          pt: { xs: 6, md: 7 },
          pb: { xs: 7, md: 4 },
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          flex: 1,
        }}
      >
        {/* Blue container */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1160,
            borderRadius: { xs: 5, md: 7 },
            bgcolor: "#0B3A7A",
            flex: 1,
            minHeight: { xs: "auto", md: "clamp(560px, 70vh, 900px)" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            justifyContent: "center",
            px: { xs: 2.5, md: 8 },
            py: { xs: 5, md: 6 },
            gap: { xs: 4, md: 7 },
            boxShadow: isDark
              ? "0 18px 45px rgba(0,0,0,0.35)"
              : "0 18px 45px rgba(2,6,23,0.12)",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Left side */}
          <Box
            sx={{
              flex: "1 1 auto",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                bgcolor: circleFill,
                width: { xs: 180, md: 240 },
                height: { xs: 180, md: 240 },
              }}
            >
              <Box
                component="img"
                alt="EELU_Logo"
                src={loogo_url || "/eelu_logo.png"}
                onError={(e) => {
                  if (e.currentTarget.src.includes("/eelu_logo.png")) return;
                  e.currentTarget.src = "/eelu_logo.png";
                }}
                sx={{
                  width: "80%",
                  height: "80%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.92)",
                fontSize: { xs: 18, md: 32 },
                fontWeight: 500,
              }}
            >
              {slogan || "تعليم يقرب المسافات"}
            </Typography>
          </Box>

          {/* Right side */}
          <Box
            sx={{
              flex: "0 0 auto",
              width: { xs: "100%", md: 420 },
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: 3,
                bgcolor: colors?.box || "#ffffff",
                border: `1px solid ${colors?.border || "rgba(148,163,184,0.6)"}`,
                boxShadow: isDark
                  ? "0 14px 40px rgba(0,0,0,0.35)"
                  : "0 14px 40px rgba(2,6,23,0.16)",
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 1.8 }}>
                {renderStepTitle()}
              </Typography>

              {step === 1 && (
                <Box
                  component="form"
                  onSubmit={handleSendResetCode}
                  sx={{ display: "grid", gap: 2 }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>
                      Student Mail
                    </Typography>

                    <TextField
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your mail address"
                      type="email"
                      required
                      size="small"
                      disabled={submitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon
                              sx={{ color: colors?.secondary || "#64748b" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: colors?.background || "#f8fafc",
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  {!!msg && <Alert severity="success">{msg}</Alert>}
                  {!!error && <Alert severity="error">{error}</Alert>}

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3.2,
                        minWidth: 120,
                        boxShadow: "none",
                        bgcolor: colors?.primary || "#1d4ed8",
                        color: "white",
                        "&:hover": { bgcolor: colors?.primary || "#1d4ed8" },
                      }}
                    >
                      {submitting ? (
                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Box>

                  <Button
                    type="button"
                    onClick={() => navigate("/login")}
                    sx={{
                      textTransform: "none",
                      color: colors?.secondary || "#64748b",
                      justifyContent: "flex-start",
                      px: 0,
                    }}
                  >
                    Back to login
                  </Button>
                </Box>
              )}

              {step === 2 && (
                <Box
                  component="form"
                  onSubmit={handleVerifyCode}
                  sx={{ display: "grid", gap: 2 }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>
                      Enter The Number
                    </Typography>

                    <TextField
                      fullWidth
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter the code sent to your email"
                      type="text"
                      required
                      size="small"
                      disabled={submitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NumbersOutlinedIcon
                              sx={{ color: colors?.secondary || "#64748b" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: colors?.background || "#f8fafc",
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  {!!msg && <Alert severity="success">{msg}</Alert>}
                  {!!error && <Alert severity="error">{error}</Alert>}

                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setStep(1);
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 2.4,
                        color: colors?.secondary || "#64748b",
                      }}
                    >
                      Back
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3.2,
                        minWidth: 120,
                        boxShadow: "none",
                        bgcolor: colors?.primary || "#1d4ed8",
                        color: "white",
                        "&:hover": { bgcolor: colors?.primary || "#1d4ed8" },
                      }}
                    >
                      {submitting ? (
                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </Box>
                </Box>
              )}

              {step === 3 && (
                <Box
                  component="form"
                  onSubmit={handleResetPassword}
                  sx={{ display: "grid", gap: 2 }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>
                      New Password
                    </Typography>

                    <TextField
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      type="password"
                      required
                      size="small"
                      disabled={submitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordOutlinedIcon
                              sx={{ color: colors?.secondary || "#64748b" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: colors?.background || "#f8fafc",
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>
                      Confirm New Password
                    </Typography>

                    <TextField
                      fullWidth
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      type="password"
                      required
                      size="small"
                      disabled={submitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordOutlinedIcon
                              sx={{ color: colors?.secondary || "#64748b" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: colors?.background || "#f8fafc",
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  {!!msg && <Alert severity="success">{msg}</Alert>}
                  {!!error && <Alert severity="error">{error}</Alert>}

                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setStep(2);
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 2.4,
                        color: colors?.secondary || "#64748b",
                      }}
                    >
                      Back
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3.2,
                        minWidth: 120,
                        boxShadow: "none",
                        bgcolor: colors?.primary || "#1d4ed8",
                        color: "white",
                        "&:hover": { bgcolor: colors?.primary || "#1d4ed8" },
                      }}
                    >
                      {submitting ? (
                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          pb: 2,
          color: colors?.secondary || "#64748b",
          fontSize: 12,
          position: "relative",
          zIndex: 2,
        }}
      >
        © 2025 University Administration Portal. All rights reserved.
      </Box>
    </Box>
  );
}