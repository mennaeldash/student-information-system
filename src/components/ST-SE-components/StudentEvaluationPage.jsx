// src/components/ST-SE-components/StudentEvaluationPage.jsx
import React, { useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";

import TAEvaluationForm from "./TAEvaluationForm";
import InstructorEvaluationForm from "./InstructorEvaluationForm";
import TAEvaluationCriteria from "./TAEvaluationCriteria.jsx";
import EvaluationCommentBox from "./EvaluationCommentBox";

export default function StudentEvaluationPage() {
  const [active, setActive] = useState("ta");
  const [comments, setComments] = useState({ ta: "", instructor: "" });

  const [saved, setSaved] = useState({ ta: false, instructor: false });

  const [openSnack, setOpenSnack] = useState(false);

  const handleTabChange = (next) => {
    setActive(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleSave = () => {
    console.log("SAVED:", { active, comment: comments[active] });

    setSaved((prev) => ({ ...prev, [active]: true }));

    setOpenSnack(true);
  };

  const isLocked = saved[active];

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      {active === "ta" ? (
        <TAEvaluationForm
          active={active}
          setActive={handleTabChange}
          disabled={isLocked}
        />
      ) : (
        <InstructorEvaluationForm
          active={active}
          setActive={handleTabChange}
          disabled={isLocked}
        />
      )}

      {active === "ta" ? (
        <TAEvaluationCriteria disabled={isLocked} />
      ) : null}

      <EvaluationCommentBox
        value={comments[active]}
        onChange={(v) =>
          setComments((prev) => ({ ...prev, [active]: v }))
        }
        onSave={handleSave}
        disabled={isLocked}
      />

      <Snackbar
        open={openSnack}
        autoHideDuration={2500}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOpenSnack(false)}
        >
          Evaluation saved successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
