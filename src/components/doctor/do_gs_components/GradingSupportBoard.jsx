import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import GradingSupportFilters from "./GradingSupportFilters.jsx";
import GradingProjectCard from "./GradingProjectCard.jsx";
import ViewDetails from "./viewDetails.jsx";

export default function GradingSupportBoard({
  data = [],
  defaultFilter = "all",
}) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(defaultFilter);
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedback, setFeedback] = useState("");

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

  const handleApprove = () => {
    console.log("Approved:", selectedProject, "Feedback:", feedback);
  };

  const handleReject = () => {
    console.log("Rejected:", selectedProject, "Feedback:", feedback);
  };

  if (selectedProject) {
    return (
      <ViewDetails
        item={selectedProject}
        onBack={() => {
          setSelectedProject(null);
          setFeedback("");
        }}
        feedback={feedback}
        setFeedback={setFeedback}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

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
          },
          gap: "24px",
          alignItems: "start",
        }}
      >
        {filtered.map((item) => (
          <GradingProjectCard
            key={item.id}
            item={item}
            onView={(project) => setSelectedProject(project)}
          />
        ))}
      </Box>
    </Box>
  );
}