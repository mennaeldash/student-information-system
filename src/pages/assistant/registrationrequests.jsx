// src/pages/assistant/registrationrequests.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { useThemeContext } from "../../services/theme_context.jsx";
import RegistrationRequestsHeader from "../../components/assistant/as_rr_components/RegistrationRequestsHeader.jsx";
import RegistrationRequestCard from "../../components/assistant/as_rr_components/RegistrationRequestCard.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

const DUMMY = [
  { id: 1, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "under_review" },
  { id: 2, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "rejected" },
  { id: 3, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "under_review" },
  { id: 4, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "approved" },
  { id: 5, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "under_review" },
  { id: 6, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "edit_requested" },
  { id: 7, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "under_review" },
  { id: 8, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "approved" },
  { id: 9, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "rejected" },
  { id: 10, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "under_review" },
  { id: 11, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "under_review" },
  { id: 12, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "approved" },
  { id: 13, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "approved" },
  { id: 14, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "approved" },
  { id: 15, studentName: "Mohamed Yasser Mohamed", studentId: "2200914", program: "IT", level: "Year 4", requestCredit: "16/18", status: "approved" },
];

function buildPageList(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "dots"];
  if (current >= total - 3) return ["dots", total - 4, total - 3, total - 2, total - 1, total];
  return ["dots", current - 1, current, current + 1, "dots_end"];
}

function PaginationBar({ page, totalPages, onChange }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const textColor = isDark ? "rgba(226,232,240,0.90)" : "#111827";
  const muted = isDark ? "rgba(226,232,240,0.55)" : "rgba(17,24,39,0.55)";

  const items = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);
  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        mt: "24px",
        userSelect: "none",
      }}
    >
      <IconButton
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        sx={{ p: 0.5, color: page === 1 ? muted : textColor }}
      >
        <ChevronLeftRoundedIcon />
      </IconButton>

      <Box sx={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {items.map((it, idx) => {
          if (it === "dots" || it === "dots_end") {
            return (
              <Typography
                key={`${it}-${idx}`}
                sx={{ fontFamily: ff, fontSize: "18px", fontWeight: 400, color: textColor }}
              >
                ...
              </Typography>
            );
          }

          const n = it;
          const active = n === page;

          return (
            <Typography
              key={n}
              onClick={() => onChange(n)}
              sx={{
                fontFamily: ff,
                fontSize: "18px",
                fontWeight: active ? 600 : 400,
                color: textColor,
                cursor: "pointer",
                lineHeight: "24px",
              }}
            >
              {n}
            </Typography>
          );
        })}
      </Box>

      <IconButton
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        sx={{ p: 0.5, color: page === totalPages ? muted : textColor }}
      >
        <ChevronRightRoundedIcon />
      </IconButton>
    </Box>
  );
}

export default function TARegistrationRequests() {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return DUMMY.filter((x) => {
      const bySearch =
        !s ||
        x.studentName.toLowerCase().includes(s) ||
        x.studentId.toLowerCase().includes(s) ||
        x.program.toLowerCase().includes(s);

      const byFilter = filter === "all" ? true : x.status === filter;
      return bySearch && byFilter;
    });
  }, [search, filter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)),
    [filtered.length]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const stats = useMemo(
    () => ({ total: 100, underReview: 10, approved: 65, editRequested: 15, rejected: 10 }),
    []
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        bgcolor: colors?.background,
        py: { xs: 2, md: 3 },
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1375px",
          mx: "auto",
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
          borderRadius: "8px",
          boxShadow: isDark ? "none" : "0px 10px 30px rgba(15,23,42,0.06)",
          px: { xs: 2, md: 4 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <RegistrationRequestsHeader
          stats={stats}
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          filter={filter}
          onFilterChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        />

        <Box sx={{ mt: "32px" }}>
          <Box
            sx={{
              display: "grid",
              // ✅ موبايل: عمود واحد / ديسكتوب: عمودين
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 635px))",
              },
              justifyContent: { xs: "stretch", md: "space-between" },
    gap: { xs: "18px", md: "32px" }, // ✅ أصغر على الموبايل
            }}
          >
            {paged.map((item) => (
              <RegistrationRequestCard
                key={item.id}
                item={item}
                onView={(x) => console.log("View:", x)}
              />
            ))}
          </Box>

          <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
        </Box>
      </Box>
    </Box>
  );
}