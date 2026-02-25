// src/components/assistant/as-at-components/AttendanceEntry.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Avatar,
  Chip,
  IconButton,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { Download, CircleCheckBig } from "lucide-react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { ClipboardList } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";
import * as XLSX from "xlsx";

export default function AttendanceEntry({ onStatsChange }) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  // Generate sample students data
  const generateStudents = () => {
    const names = [
      "Mohamed Yasser Mohamed",
      "Ahmed Ali Hassan",
      "Fatima Ibrahim Saleh",
      "Omar Khaled Mahmoud",
      "Aisha Nour Abdelrahman",
      "Youssef Tarek Mohamed",
      "Mariam Samir Ibrahim",
      "Khaled Amr Ali",
      "Nour Hany Mostafa",
      "Sara Mahmoud Fathy",
      "Ali Mohamed Reda",
      "Dina Waleed Tamer",
      "Hassan Karim Nabil",
      "Layla Amr Samy",
      "Ziad Tarek Hossam",
      "Rana Youssef Magdy",
      "Tamer Hany Sherif",
      "Nada Ashraf Gamal",
      "Sherif Mohamed Adel",
      "Heba Ali Rami",
    ];
    
    const statuses = ["present", "absent", null];
    const students = [];
    
    for (let i = 0; i < 100; i++) {
      const nameIndex = i % names.length;
      const statusIndex = i % statuses.length;
      students.push({
        id: i + 1,
        name: names[nameIndex] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
        studentId: `2200${String(914 + i).padStart(4, "0")}`,
        status: statuses[statusIndex],
      });
    }
    
    return students;
  };

  const [students, setStudents] = useState(generateStudents());
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [lastSaved, setLastSaved] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  });
  const [displayedCount, setDisplayedCount] = useState(4);
  const totalStudents = 100;

  const filtered = useMemo(() => {
    let result = students;
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.studentId.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "status-present":
            if (a.status === "present" && b.status !== "present") return -1;
            if (a.status !== "present" && b.status === "present") return 1;
            return a.name.localeCompare(b.name);
          case "status-absent":
            if (a.status === "absent" && b.status !== "absent") return -1;
            if (a.status !== "absent" && b.status === "absent") return 1;
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }
    
    // Limit displayed count if no search
    if (!search) {
      result = result.slice(0, displayedCount);
    }
    
    return result;
  }, [search, students, displayedCount, sortBy]);

  // Load more students
  const handleLoadMore = () => {
    if (displayedCount < totalStudents) {
      const newCount = Math.min(displayedCount + 10, totalStudents);
      setDisplayedCount(newCount);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filtered.map((s) => s.id);
    const allSelected = filteredIds.every((id) => selected.includes(id));
    
    if (allSelected) {
      // Deselect all filtered items
      setSelected((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered items
      setSelected((prev) => {
        const newSelected = [...prev];
        filteredIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const isAllSelected = filtered.length > 0 && filtered.every((s) => selected.includes(s.id));
  const isIndeterminate = filtered.some((s) => selected.includes(s.id)) && !isAllSelected;

  const changeStatusForSelected = (status) => {
    setStudents((prev) =>
      prev.map((s) => (selected.includes(s.id) ? { ...s, status } : s))
    );
    setSelected([]);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const changeStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  // Handle Import Sheet
  const handleImportSheet = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          // Parse imported data and update students
          const importedStudents = jsonData.map((row, index) => {
            // Try to match by Student ID or Name
            const studentId = row["Student ID"] || row["StudentID"] || row["ID"] || "";
            const studentName = row["Student Name"] || row["Name"] || row["StudentName"] || "";
            const status = row["Status"] || row["Attendance"] || "";

            // Find existing student or create new one
            let existingStudent = students.find(
              (s) => s.studentId === String(studentId) || s.name === studentName
            );

            if (existingStudent) {
              return {
                ...existingStudent,
                status:
                  status.toLowerCase().includes("present") ||
                  status === "Present" ||
                  status === "P"
                    ? "present"
                    : status.toLowerCase().includes("absent") ||
                      status === "Absent" ||
                      status === "A"
                    ? "absent"
                    : existingStudent.status,
              };
            } else {
              // Create new student if not found
              return {
                id: students.length + index + 1,
                name: studentName || `Student ${index + 1}`,
                studentId: String(studentId) || `ID${index + 1}`,
                status:
                  status.toLowerCase().includes("present") ||
                  status === "Present" ||
                  status === "P"
                    ? "present"
                    : status.toLowerCase().includes("absent") ||
                      status === "Absent" ||
                      status === "A"
                    ? "absent"
                    : null,
              };
            }
          });

          // Update students with imported data
          setStudents((prev) => {
            const updated = [...prev];
            importedStudents.forEach((imported) => {
              const index = updated.findIndex(
                (s) => s.id === imported.id || s.studentId === imported.studentId
              );
              if (index >= 0) {
                updated[index] = imported;
              } else {
                updated.push(imported);
              }
            });
            return updated;
          });

          alert(t("Sheet imported successfully") || "Sheet imported successfully");
        } catch (error) {
          console.error("Error importing sheet:", error);
          alert(t("Error importing sheet") || "Error importing sheet. Please check the file format.");
        }
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  };

  // Handle Save Attendance
  const handleSaveAttendance = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setLastSaved(timeString);
    // هنا يمكن إضافة منطق الحفظ الفعلي
    // التحديث يظهر مباشرة على الشاشة من خلال lastSaved
  };

  // Handle Export Attendance
  const handleExportAttendance = () => {
    if (!students.length) {
      alert(t("No data to export") || "No data to export");
      return;
    }

    // Prepare header row
    const headerRow = [
      t("Student Name") || "Student Name",
      t("Student ID") || "Student ID",
      t("Status") || "Status",
    ];

    // Prepare data rows
    const rows = students.map((s) => [
      s.name,
      s.studentId,
      s.status === "present"
        ? t("Present") || "Present"
        : s.status === "absent"
        ? t("Absent") || "Absent"
        : t("Not Set") || "Not Set",
    ]);

    const worksheetData = [headerRow, ...rows];

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Download Excel file
    const fileName = `attendance-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const bgColor = colors?.background || (isDark ? "#020617" : "#F3F4F6");
  const mutedTextColor = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${borderColor}`,
        bgcolor: cardBg,
        boxShadow:
          "0 10px 30px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
    >
      {/* Header */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3,
  }}
>
  <Typography
    sx={{
      fontSize: 22,
      fontWeight: 400,
      color: isDark ? "#E2E8F0" : "#111827",
    }}
  >
    {t("Attendance Entry") || "Attendance Entry"} - Session: 15/01/2026
  </Typography>

  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        border: "1px dashed #E5E7EB",
        borderRadius: "8px",
        bgcolor: isDark ? "#1E293B" : "#F9FAFB",
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          color: "#475569",
          fontWeight: 400,
        }}
      >
        {t("Last saved") || "Last saved"}: {lastSaved}
      </Typography>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: "#16A34A",
        }}
      />
    </Box>

    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        border: "1px dashed #E5E7EB",
        borderRadius: "8px",
        bgcolor: isDark ? "#1E293B" : "#F9FAFB",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "#16A34A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircleCheckBig size={12} color="#FFFFFF" />
        </Box>
        <Typography
          sx={{
            fontSize: 14,
            color: isDark ? "#E2E8F0" : "#111827",
            fontWeight: 400,
          }}
        >
          {t("Present") || "Present"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HighlightOffIcon sx={{ fontSize: 12, color: "#FFFFFF" }} />
        </Box>
        <Typography
          sx={{
            fontSize: 14,
            color: isDark ? "#E2E8F0" : "#111827",
            fontWeight: 400,
          }}
        >
          {t("Absent") || "Absent"}
        </Typography>
      </Box>
    </Box>
  </Box>
</Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<DoneIcon sx={{ fontSize: 18 }} />}
            onClick={() => changeStatusForSelected("present")}
            disabled={selected.length === 0}
            sx={{
              bgcolor: "#2E6158",
              color: "#FFFFFF",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              px: 2.5,
              py: 1.25,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#2E6158",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "#D1D5DB",
                color: "#9CA3AF",
              },
            }}
          >
            {t("Mark Selected Present") || "Mark Selected Present"}
          </Button>

          <Button
            variant="contained"
            startIcon={<CloseIcon sx={{ fontSize: 18 }} />}
            onClick={() => changeStatusForSelected("absent")}
            disabled={selected.length === 0}
            sx={{
              bgcolor: "#7F1F22",
              color: "#FFFFFF",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              px: 2.5,
              py: 1.25,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#7F1F22",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "#D1D5DB",
                color: "#9CA3AF",
              },
            }}
          >
            {t("Mark Selected Absent") || "Mark Selected Absent"}
          </Button>

          <Button
            variant="contained"
            onClick={clearSelection}
            disabled={selected.length === 0}
            sx={{
              bgcolor: "#1F609D",
              color: "#FFFFFF",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              px: 2.5,
              py: 1.25,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1F609D",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "#1F609D",
                color: "#9CA3AF",
              },
            }}
          >
            {t("Clear Selection") || "Clear Selection"}
          </Button>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleImportSheet}
          sx={{
            bgcolor: "#1F609D",
            color: "#FFFFFF",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            px: 2.5,
            py: 1.25,
            Width :"170px",
            Height :"40px",
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1F609D",
              boxShadow: "none",
            },
          }}
        >
           {t("Import Sheet") || "Import Sheet"}
        </Button>
      </Box>

      {/* Search and Select */}
<Box
  sx={{
    display: "flex",
    gap: 1.5,
    mb: 3,
    flexDirection: { xs: "column", sm: "row" },
  }}
>
  {/* Search */}
  <TextField
  placeholder={t("Search by name or student ID...") || "Search by name or student ID..."}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  size="small"
  InputProps={{
    startAdornment: (
      <InputAdornment
        position="start"
        sx={{
          m: 0,           // إزالة margin
          p: 0,           // إزالة padding
          pl: 1.5,        // padding-left بسيط يناسب التصميم (حوالي 12px)
          display: "flex",
          alignItems: "center",
        }}
      >
        <SearchIcon
          sx={{
            fontSize: 20,
            color: mutedTextColor,
            mr: "10px",    // gap بين الأيقونة والنص = 10px
          }}
        />
      </InputAdornment>
    ),
  }}
  sx={{
    width: 1800,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: cardBg,
      height: 48,
      px: 2, // left & right padding = 16px
      py: "10px",
      "& fieldset": {
        borderColor: borderColor,
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: borderColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: isDark ? "#3B82F6" : "#0E151E",
        borderWidth: 1,
      },
    },
  }}
/>

  {/* Select */}
  <Select
    size="small"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    displayEmpty
    renderValue={(value) => {
      if (value) {
        const sortLabels = {
          "name-asc": t("Sort by Name (A-Z)") || "Sort by Name (A-Z)",
          "name-desc": t("Sort by Name (Z-A)") || "Sort by Name (Z-A)",
          "status-present": t("Sort by Status (Present First)") || "Sort by Status (Present First)",
          "status-absent": t("Sort by Status (Absent First)") || "Sort by Status (Absent First)",
        };
        return (
          <Typography sx={{ fontSize: 18, color: textColor }}>
            {sortLabels[value] || value}
          </Typography>
        );
      }
      return (
        <Typography
          sx={{
            fontSize: 18,
            color: colors?.text || (isDark ? "#E2E8F0" : "#111827"),
          }}
        >
          {t("Select") || "Select"}
        </Typography>
      );
    }}
    sx={{
      width: 287,
      height: 48,
      borderRadius: "8px",
      bgcolor: cardBg,
      px: 2, // padding-left/right 16px
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: borderColor,
        borderWidth: "1px",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: borderColor,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? "#3B82F6" : "#2563EB",
      },
      "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",
        p: 0,
        height: "100%",
      },
    }}
  >
    <MenuItem value="">{t("Select") || "Select"}</MenuItem>
    <MenuItem value="name-asc">{t("Sort by Name (A-Z)") || "Sort by Name (A-Z)"}</MenuItem>
    <MenuItem value="name-desc">{t("Sort by Name (Z-A)") || "Sort by Name (Z-A)"}</MenuItem>
    <MenuItem value="status-present">{t("Sort by Status (Present First)") || "Sort by Status (Present First)"}</MenuItem>
    <MenuItem value="status-absent">{t("Sort by Status (Absent First)") || "Sort by Status (Absent First)"}</MenuItem>
  </Select>
</Box>


      {/* Table */}
      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: isDark ? "#1E293B" : "#F9FAFB",
              }}
            >
              <TableCell
                sx={{
                  width: 50,
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: 13,
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleSelectAll}
                  size="small"
                  sx={{
                    color: mutedTextColor,
                    "&.Mui-checked": {
                      color: "#2563EB",
                    },
                    "&.MuiCheckbox-indeterminate": {
                      color: "#2563EB",
                    },
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: 13,
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                {t("Student") || "Student"}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: "20px",
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                {t("Status") || "Status"}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  borderColor: borderColor,
                  color: mutedTextColor,
                  fontSize: "20px",
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                {t("Action") || "Action"}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((student) => (
              <TableRow
                key={student.id}
                sx={{
                  "&:hover": {
                    bgcolor: isDark ? "#1E293B" : "#F9FAFB",
                  },
                }}
              >
                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Checkbox
                    checked={selected.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                    size="small"
                    sx={{
                      color: mutedTextColor,
                      "&.Mui-checked": {
                        color: "#2563EB",
                      },
                    }}
                  />
                </TableCell>

                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDark ? "#1E293B" : "#F3F4F6",
                        color: isDark ? "#94A3B8" : "#6B7280",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: textColor,
                          lineHeight: 1.4,
                        }}
                      >
                        {student.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: mutedTextColor,
                          lineHeight: 1.4,
                        }}
                      >
                        {student.studentId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderColor: borderColor, py: 1.5 }}>
                  {student.status === "present" ? (
                    <Chip
                      label={t("Present") || "Present"}
                      icon={<CircleCheckBig size={14} color="#16A34A" />}
                      size="small"
                      sx={{
                        bgcolor: "rgba(34, 197, 94, 0.1)",
                        color: "#16A34A",
                        fontWeight: 500,
                        fontSize: 12,
                        height: 24,
                        "& .MuiChip-icon": {
                          color: "#16A34A",
                        },
                      }}
                    />
                  ) : student.status === "absent" ? (
                    <Chip
                      label={t("Absent") || "Absent"}
                      icon={<HighlightOffIcon sx={{ fontSize: 14 }} />}
                      size="small"
                      sx={{
                        bgcolor: "rgba(220, 38, 38, 0.1)",
                        color: "#DC2626",
                        fontWeight: 500,
                        fontSize: 12,
                        height: 24,
                        "& .MuiChip-icon": {
                          color: "#DC2626",
                        },
                      }}
                    />
                  ) : null}
                </TableCell>

                <TableCell align="right" sx={{ borderColor: borderColor, py: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    {/* Present Button */}
                    <IconButton
                      onClick={() => changeStatus(student.id, "present")}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor:
                          student.status === "present"
                            ? "#16A34A"
                            : "transparent",
                        border:
                          student.status === "present"
                            ? "none"
                            : `1px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                        color:
                          student.status === "present"
                            ? "#FFFFFF"
                            : mutedTextColor,
                        "&:hover": {
                          bgcolor:
                            student.status === "present"
                              ? "#15803D"
                              : isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <DoneIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    {/* Absent Button */}
                    <IconButton
                      onClick={() => changeStatus(student.id, "absent")}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor:
                          student.status === "absent"
                            ? "#DC2626"
                            : "transparent",
                        border:
                          student.status === "absent"
                            ? "none"
                            : `1px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                        color:
                          student.status === "absent"
                            ? "#FFFFFF"
                            : mutedTextColor,
                        "&:hover": {
                          bgcolor:
                            student.status === "absent"
                              ? "#B91C1C"
                              : isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Loading Indicator inside the table container */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: `1px solid ${isDark ? "#1E293B" : "#E5E7EB"}`,
            borderBottom: `1px solid ${isDark ? "#1E293B" : "#E5E7EB"}`,
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB",
          }}
        >
          {displayedCount < totalStudents ? (
            <Typography 
              onClick={handleLoadMore}
              sx={{ 
                fontSize: 14, 
                color: isDark ? "#94A3B8" : "#6B7280",
                fontFamily: "Inter",
                fontWeight: 400,
                cursor: "pointer",
                "&:hover": {
                  color: isDark ? "#CBD5E1" : "#4B5563",
                },
              }}
            >
              {t("Loading more students...") || "Loading more students..."} ({displayedCount} of {totalStudents})
            </Typography>
          ) : (
            <Typography 
              sx={{ 
                fontSize: 14, 
                color: isDark ? "#94A3B8" : "#6B7280",
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            >
              {t("Loading more students...") || "Loading more students..."} ({displayedCount} of {totalStudents})
            </Typography>
          )}
        </Box>
      </Box>

      {/* Bottom buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 2, gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<ClipboardList size={18} color="#FFFFFF" />}
          onClick={handleSaveAttendance}
          sx={{
            width: 180,
            height: 40,
            bgcolor: "#1F609D",
            color: "#FFFFFF",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "Inter",
            borderRadius: "8px",
            boxShadow: "none",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              marginLeft: 0,
            },
            "&:hover": {
              bgcolor: "#1F609D",
              boxShadow: "none",
            },
          }}
        >
          {t("Save Attendance") || "Save Attendance"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download size={14} color="#09090B" />}
          onClick={handleExportAttendance}
          sx={{
            width: 162,
            height: 40,
            bgcolor: isDark ? "#1E293B" : "#FFFFFF",
            color: isDark ? "#94A3B8" : "#71717A",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "Inter",
            borderRadius: "6px",
            boxShadow: "none",
            border: isDark ? "1px solid #334155" : "1px solid #71717A",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              marginLeft: 0,
            },
            "&:hover": {
              bgcolor: isDark ? "#334155" : "#F9FAFB",
              borderColor: isDark ? "#334155" : "#71717A",
              boxShadow: "none",
            },
          }}
        >
          {t("Export Attendance") || "Export Attendance"}
        </Button>
      </Box>
    </Paper>
  );
}