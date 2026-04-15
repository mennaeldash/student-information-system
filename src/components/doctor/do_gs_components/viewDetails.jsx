import React from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import ProjectDetailsHeader from "./ProjectDetailsHeader.jsx";
import ProjectSummaryCard from "./ProjectSummaryCard.jsx";
import MembersTableCard from "./MembersTableCard.jsx";
import ProjectFilesPanel from "./ProjectFilesPanel.jsx";
import DecisionPanel from "./DecisionPanel.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export default function ViewDetails({
  item,
  onBack,
  onApprove,
  onReject,
  feedback,
  setFeedback,
}) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const pageBg = isDark ? colors?.box || "#0f172a" : "#F1F5F9";
  const sectionBg = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
  const shadow = isDark ? "none" : "0px 0px 4px rgba(0,0,0,0.25)";
  const border = colors?.border || (isDark ? "rgba(255,255,255,0.10)" : "transparent");

  const members =
    item?.membersDetailed ||
    (item?.members || []).map((m, idx) => ({
      id: m?.id || `220012${idx + 1}`,
      name: m?.name || "Mohamed Yasser",
      role: m?.role || "Team Leader / AI Engineer",
      avatarColor: m?.color,
    }));

  const files =
    item?.files || [
      {
        id: 1,
        name: "Project_Proposal_final.pdf",
        size: "2.4 MB",
        uploadedAt: "Uploaded on Jan 15, 2025",
      },
      {
        id: 2,
        name: "Project_Proposal_final.pdf",
        size: "2.4 MB",
        uploadedAt: "Uploaded on Jan 15, 2025",
      },
      {
        id: 3,
        name: "Project_Proposal_final.pdf",
        size: "2.4 MB",
        uploadedAt: "Uploaded on Jan 15, 2025",
      },
    ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: { xs: 1, md: 0 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1241px",
          bgcolor: pageBg,
          borderRadius: "8px",
          boxShadow: shadow,
          border: `1px solid ${border}`,
          pt: "30px",
          pr: "20px",
          pb: "30px",
          pl: "20px",
          fontFamily: ff,
        }}
      >
        <ProjectDetailsHeader item={item} onBack={onBack} />

        <Box
          sx={{
            mt: "26px",
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            flexWrap: { xs: "wrap", lg: "nowrap" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", lg: "652px" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                minHeight: "455px",
                bgcolor: sectionBg,
                borderRadius: "24px",
                boxShadow: shadow,
                overflow: "hidden",
              }}
            >
              <ProjectSummaryCard item={item} />
              <MembersTableCard members={members} />
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", lg: "467px" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <ProjectFilesPanel files={files} />
            <DecisionPanel
              feedback={feedback}
              setFeedback={setFeedback}
              onApprove={onApprove}
              onReject={onReject}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}