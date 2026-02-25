// src/pages/assistant/sections.jsx
import React from "react";
import { Box } from "@mui/material";
import TASectionTabs from "../../components/assistant/as_co_components/TASectionTabs.jsx";
import TASectionsList from "../../components/assistant/as_co_components/TASectionsList.jsx";

export default function TASections() {
  return (
    <Box sx={{ width: "100%", mx: 0, px: { xs: 1, sm: 1.5, md: 2 } }}>
      <TASectionTabs />
      <TASectionsList />
    </Box>
  );
}
