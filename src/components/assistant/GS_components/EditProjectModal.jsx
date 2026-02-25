import React, { useEffect, useMemo, useState } from "react";
import { Upload, Trash2, ChevronsUpDown } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa6";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";

const EditProjectModal = ({ open, onClose, project, onSave }) => {
  const { colors } = useThemeContext();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academicYear: "",
    completionDate: "",
    supervisor: "",
    coSupervisor: "",
  });

  const isDark = colors?.mode === "dark";

 
  const currentAcademicYear = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0..11
    const startYear = m >= 8 ? y : y - 1;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
  }, []);

  useEffect(() => {
    if (!project) return;

    setFormData({
      title: project.title || "",
      description: project.description || "",
      academicYear: currentAcademicYear, 
      completionDate: project.completionDate || "july / 2026",
      supervisor: project.supervisor || "",
      coSupervisor: project.coSupervisor || "Eng/ Khalil", 
    });

    setUploadedFile(null);
    setExistingFileName(project.file || ""); 
  }, [project, currentAcademicYear, open]);

  if (!project) return null;

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log("File selected:", file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      console.log("File dropped:", files[0]);
    }
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setExistingFileName(""); 
    console.log("File deleted");
  };

  const handleReplace = () => {
    document.getElementById("file-upload-input")?.click();
  };

  //  زرار Save Changes شغال ويحفظ أي تغييرات
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const payload = {
        ...project,
        title: formData.title,
        description: formData.description,
        academicYear: formData.academicYear,
        completionDate: formData.completionDate,
        supervisor: formData.supervisor,
        coSupervisor: formData.coSupervisor,

        //  نخزن اسم الملف فقط (string) عشان مانعملش render لـ File object
        file: uploadedFile ? uploadedFile.name : existingFileName,

        updatedAt: new Date().toISOString(),
      };

      console.log(" Save clicked. Payload:", payload);

      //  لو parent ممرر onSave هنستخدمه
      if (typeof onSave === "function") {
        await onSave(payload);
      } else {
        // fallback
        const key = `editedProject:${project.id ?? project._id ?? project.title ?? "unknown"}`;
        localStorage.setItem(key, JSON.stringify(payload));
        console.warn("⚠️ onSave not provided. Saved to localStorage key:", key);
      }

      onClose?.();
    } catch (err) {
      console.error("❌ Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const displayFileName = uploadedFile ? uploadedFile.name : existingFileName;
  const hasAnyFile = Boolean(uploadedFile || existingFileName);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "939px",
          borderRadius: "8px",
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          padding: "30px 20px 20px 20px",
          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          boxSizing: "border-box",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          mb: 0,
          fontSize: "30px",
          fontWeight: 500,
          lineHeight: "32px",
          color: colors?.text || "#020617",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        Edit Project Details
      </DialogTitle>

      <Box
        sx={{
          width: "100%",
          maxWidth: "899px",
          padding: "24px 16px 24px 16px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Project Title */}
          <Box>
            <Typography
              component="label"
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "14px",
                color: colors?.text || "#020617",
                marginBottom: "16px",
                display: "block",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
            >
              Project Title (English)
              <span style={{ color: "#DC2626" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={formData.title}
              onChange={handleChange("title")}
              placeholder="Enter project title"
              sx={{
                width: "100%",
                maxWidth: "872px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "16px",
                  height: "60px",
                  backgroundColor: isDark ? "#111827" : "#FFFFFF",
                  boxSizing: "border-box",
                  "& fieldset": {
                    borderColor: isDark ? "#374151" : "#71717A",
                  },
                  "&:hover fieldset": {
                    borderColor: isDark ? "#4B5563" : "#9CA3AF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1F609D",
                    borderWidth: "1px",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "16px",
                  color: colors?.text || "#000000",
                },
              }}
            />
          </Box>

          {/* Project Description */}
          <Box>
            <Typography
              component="label"
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "14px",
                color: colors?.text || "#020617",
                marginBottom: "16px",
                display: "block",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
            >
              Project Description
              <span style={{ color: "#DC2626" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Enter project description"
              sx={{
                width: "100%",
                maxWidth: "870px",
                height: "150px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "16px",
                  height: "150px",
                  backgroundColor: isDark ? "#111827" : "#FFFFFF",
                  alignItems: "flex-start",
                  padding: "16px",
                  boxSizing: "border-box",
                  "& fieldset": {
                    borderColor: isDark ? "#374151" : "#71717A",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: isDark ? "#4B5563" : "#9CA3AF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1F609D",
                    borderWidth: "1px",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0",
                  color: colors?.text || "#000000",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "20px",
                },
              }}
            />
          </Box>

          {/* Academic Year & Completion Date */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: "24px", md: "50px" },
              width: "100%",
              maxWidth: "866px",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "406px" }}>
              <Typography
                component="label"
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: colors?.text || "#020617",
                  marginBottom: "16px",
                  display: "block",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Academic year
              </Typography>

              <TextField
                fullWidth
                disabled
                value={formData.academicYear}
                sx={{
                  width: "100%",
                  maxWidth: "406px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontSize: "16px",
                    height: "60px",
                    backgroundColor: isDark ? "#0F1419" : "#F3F4F6",
                    boxSizing: "border-box",
                    "& fieldset": {
                      borderColor: isDark ? "#374151" : "#D1D5DB",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "16px",
                    color: isDark ? "#6B7280" : "#9CA3AF",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Box>

            <Box sx={{ width: "100%", maxWidth: "410px" }}>
              <Typography
                component="label"
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: colors?.text || "#020617",
                  marginBottom: "16px",
                  display: "block",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Completion Date
              </Typography>
              <TextField
                fullWidth
                value={formData.completionDate}
                onChange={handleChange("completionDate")}
                placeholder="july / 2026"
                sx={{
                  width: "100%",
                  maxWidth: "410px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontSize: "16px",
                    height: "60px",
                    backgroundColor: isDark ? "#111827" : "#FFFFFF",
                    boxSizing: "border-box",
                    "& fieldset": {
                      borderColor: isDark ? "#374151" : "#71717A",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "16px",
                    color: colors?.text || "#000000",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Main Supervisor & Co-Supervisor */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: "24px", md: "50px" },
              width: "100%",
              maxWidth: "867px",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "409px" }}>
              <Typography
                component="label"
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: colors?.text || "#020617",
                  marginBottom: "16px",
                  display: "block",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Main Supervisor
                <span style={{ color: "#DC2626" }}>*</span>
              </Typography>

              <TextField
                fullWidth
                select
                value={formData.supervisor}
                onChange={handleChange("supervisor")}
                SelectProps={{
                  IconComponent: () => (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "16px",
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ChevronsUpDown
                        size={20}
                        color={colors?.text || "#000000"}
                      />
                    </Box>
                  ),
                }}
                sx={{
                  width: "100%",
                  maxWidth: "409px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontSize: "16px",
                    height: "60px",
                    backgroundColor: isDark ? "#111827" : "#FFFFFF",
                    boxSizing: "border-box",
                    "& fieldset": {
                      borderColor: isDark ? "#374151" : "#71717A",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiSelect-select": {
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    color: colors?.text || "#000000",
                  },
                }}
              >
                <MenuItem value="Dr. Ahmed Ali">Dr. Ahmed Ali</MenuItem>
                <MenuItem value="Dr. Manal Shaban">Dr. Manal Shaban</MenuItem>
                <MenuItem value="Dr. Manel Ghalian">Dr. Manel Ghalian</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ width: "100%", maxWidth: "408px" }}>
              <Typography
                component="label"
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: colors?.text || "#020617",
                  marginBottom: "16px",
                  display: "block",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Co-Supervisor
              </Typography>

              <TextField
                fullWidth
                disabled
                value={formData.coSupervisor}
                sx={{
                  width: "100%",
                  maxWidth: "408px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontSize: "16px",
                    height: "60px",
                    backgroundColor: isDark ? "#0F1419" : "#F3F4F6",
                    boxSizing: "border-box",
                    "& fieldset": {
                      borderColor: isDark ? "#374151" : "#D1D5DB",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "16px",
                    color: isDark ? "#6B7280" : "#9CA3AF",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Upload File Section */}
          <Box sx={{ width: "100%", maxWidth: "877px" }}>
            <Typography
              component="label"
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "14px",
                color: colors?.text || "#020617",
                marginBottom: "16px",
                display: "block",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
            >
              Upload File
            </Typography>

            {hasAnyFile && (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "877px",
                  height: { xs: "auto", md: "66px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: { xs: "10px 16px", md: "6px 30px" },
                  borderRadius: "8px",
                  marginBottom: "16px",
                  backgroundColor: isDark ? "#111827" : "#F3F7FB",
                  boxSizing: "border-box",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: { xs: "16px", md: "40px", lg: "272px" },
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "21px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#DBEEFF",
                      borderRadius: "20px",
                      flexShrink: 0,
                    }}
                  >
                    <FaRegFilePdf size={25} color="#0369A1" />
                  </Box>

                  <Box
                    sx={{
                      width: "269px",
                      height: "42px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: colors?.text || "#000000",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {displayFileName}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: isDark ? "#9CA3AF" : "#71717A",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "16px",
                        marginTop: "10px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {uploadedFile
                        ? `${(uploadedFile.size / (1024 * 1024)).toFixed(
                            2
                          )} MB • Uploaded on ${new Date().toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}`
                        : "Previously uploaded file"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: "40px",
                    alignItems: "center",
                    flexShrink: 0,
                    width: { xs: "100%", md: "auto" },
                    justifyContent: { xs: "flex-end", md: "flex-start" },
                  }}
                >
                  <Button
                    onClick={handleReplace}
                    startIcon={<Upload size={24} />}
                    sx={{
                      textTransform: "none",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "14px",
                      color: "#1F609D",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      minHeight: "24px",
                      height: "24px",
                      padding: "0",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "rgba(31, 96, 157, 0.06)",
                      },
                      "& .MuiButton-startIcon": {
                        marginRight: "8px",
                        marginLeft: "0",
                      },
                    }}
                  >
                    Replace
                  </Button>

                  <Button
                    onClick={handleDelete}
                    startIcon={<Trash2 size={24} />}
                    sx={{
                      textTransform: "none",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "14px",
                      color: "#D42929",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      minHeight: "24px",
                      height: "24px",
                      padding: "0",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "rgba(212, 41, 41, 0.06)",
                      },
                      "& .MuiButton-startIcon": {
                        marginRight: "8px",
                        marginLeft: "0",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            )}

            <Box
              component="label"
              htmlFor="file-upload-input"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                width: "100%",
                maxWidth: "877px",
                height: "150px",
                border: `1px dashed ${
                  isDragging ? "#1F609D" : isDark ? "#4B5563" : "#71717A"
                }`,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                cursor: "pointer",
                backgroundColor: isDragging
                  ? "#EFF6FF"
                  : isDark
                  ? "#111827"
                  : "#FFFFFF",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#1F609D",
                  backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                },
              }}
            >
              <input
                id="file-upload-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx"
              />

              <Upload
                size={40}
                color={colors?.text || "#000000"}
                strokeWidth={1.2}
              />

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: isDragging
                    ? "#1F609D"
                    : isDark
                    ? "#9CA3AF"
                    : "#71717A",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  textAlign: "center",
                }}
              >
                Drag & drop to upload A File or click to upload
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "22px",
          padding: "0 3px 0 0px",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "6px",
            width: "90px",
            height: "40px",
            border: `1px solid ${isDark ? "#4B5563" : "#71717A"}`,
            color: colors?.text || "#09090B",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSaveChanges}
          disabled={isSaving}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            width: "143px",
            height: "40px",
            backgroundColor: "#1F609D",
            color: "#FAFAFA",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1A5082", boxShadow: "none" },
            "&.Mui-disabled": {
              backgroundColor: isDark ? "#334155" : "#93C5FD",
              color: "#FAFAFA",
            },
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditProjectModal;