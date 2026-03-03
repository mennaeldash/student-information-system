// src/pages/doctor/DoctorGradingSupport.jsx

import React from "react";
import { Box } from "@mui/material";
import GradingSupportBoard from "../../components/doctor/do_gs_components/GradingSupportBoard.jsx";

const dummyData = [
  {
    id: 1,
    title: "Smart Traffic Management System",
    status: "submitted",
    domain: "Computer Vision",
    academicYear: "2025/2026",
    members: [
      { name: "Mohamed" },
      { name: "Ahmed" },
      { name: "Elham" },
      { name: "Salma" },
    ],
    supervisor: "Dr. Ahmed Ali",
    coSupervisor: "Eng. Salma Fawzy",
  },
  {
    id: 2,
    title: "AI-Powered Campus Assistant Chatbot",
    status: "rejected",
    domain: "Artificial Intelligence",
    academicYear: "2025/2026",
    members: [
      { name: "Mohamed" },
      { name: "Ahmed" },
      { name: "Elham" },
      { name: "Salma" },
    ],
    supervisor: "Dr. Ahmed Ali",
    coSupervisor: "Eng. Salma Fawzy",
  },
  {
    id: 3,
    title: "AI-Powered Campus Assistant Chatbot",
    status: "rejected",
    domain: "Artificial Intelligence",
    academicYear: "2025/2026",
    members: [
      { name: "Mohamed" },
      { name: "Ahmed" },
      { name: "Elham" },
      { name: "Salma" },
    ],
    supervisor: "Dr. Ahmed Ali",
    coSupervisor: "Eng. Salma Fawzy",
  },
  {
    id: 4,
    title: "Smart Traffic Management System",
    status: "submitted",
    domain: "Computer Vision",
    academicYear: "2025/2026",
    members: [
      { name: "Mohamed" },
      { name: "Ahmed" },
      { name: "Elham" },
      { name: "Salma" },
    ],
    supervisor: "Dr. Ahmed Ali",
    coSupervisor: "Eng. Salma Fawzy",
  },
];

export default function DoctorGradingSupport() {
return (
    <Box
      sx={{
        width: "100%",
        pt: "24px",
        pb: "40px",
        display: "block",    
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",   
          mx: 0,             
        }}
      >
        <GradingSupportBoard
          data={dummyData}
          onViewDetails={(item) => console.log("view details:", item)}
        />
      </Box>
    </Box>
  );
}