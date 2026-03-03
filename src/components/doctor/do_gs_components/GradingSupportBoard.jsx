import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import GradingSupportFilters from "./GradingSupportFilters.jsx";
import GradingProjectCard from "./GradingProjectCard.jsx";

export default function GradingSupportBoard({
  data = [],
  onViewDetails,
  defaultFilter = "all",
}) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(defaultFilter);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data || []).filter((x) => {
      const matchesFilter = filter === "all" ? true : x.status === filter;
      const blob = [
        x.title,
        x.domain,
        x.academicYear,
        ...(x.members || []).map((m) => m.name),
        x.supervisor,
        x.coSupervisor,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = q ? blob.includes(q) : true;
      return matchesFilter && matchesSearch;
    });
  }, [data, search, filter]);

  const pageBg = colors?.background || (isDark ? "#0f172a" : "#f8fafc");

  return (
     <Box
    sx={{
      width: "100%",
      maxWidth: "100%",     
      mx: 0,               
      px: { xs: 2, md: 3 },
      pb: 4,
      bgcolor: "transparent",
    }}
    >
      <Box sx={{ mt: 2, mb: 2 }}>
        <GradingSupportFilters
          search={search}
          onSearch={setSearch}
          filter={filter}
          onFilter={setFilter}
          selectWidth={414}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
  gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))", 
        },          gap: "24px",
          alignItems: "start",
        }}
      >
        {filtered.map((item) => (
          <GradingProjectCard key={item.id} item={item} onView={onViewDetails} />
        ))}
      </Box>
    </Box>
  );
}