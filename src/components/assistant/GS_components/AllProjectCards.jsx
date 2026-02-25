import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import EditProjectModal from "./EditProjectModal";
import AddMemberModal from "./AddMemberModal";

const AllProjectCards = ({ searchQuery, selectedFilter }) => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const isRTL = i18n?.dir?.() === "rtl";

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI-Powered Campus Assistant Chatbot",
      status: "Submitted",
      domain: "Artificial Intelligence",
      academicYear: "2025/2026",
      semester: "Fall",
      members: [
        { name: "AA", color: "#2563EB" },
        { name: "AM", color: "#9C719A" },
        { name: "EY", color: "#99B59E" },
        { name: "AH", color: "#485A83" },
      ],
      supervisor: "Dr. Ahmed Ali",
      coSupervisor: "Eng. Salma Fawzy",
      description:
        "This project focuses on building an AI chatbot to assist campus students with daily tasks, course information, and administrative queries using natural language processing...",
      file: ".pdf",
    },
    {
      id: 2,
      title: "Smart Traffic Management System",
      status: "Accepted",
      domain: "Computer Vision",
      academicYear: "2025/2026",
      semester: "Fall",
      members: [
        { name: "AA", color: "#2563EB" },
        { name: "AM", color: "#9C719A" },
        { name: "EY", color: "#99B59E" },
        { name: "AH", color: "#485A83" },
      ],
      supervisor: "Dr. Ahmed Ali",
      coSupervisor: "Eng. Salma Fawzy",
      description:
        "An intelligent traffic management system using computer vision and machine learning to optimize traffic flow and reduce congestion in urban areas...",
      file: ".pdf",
    },
    {
      id: 3,
      title: "E-Learning Platform Development",
      status: "Under review",
      domain: "Web Development",
      academicYear: "2025/2026",
      semester: "Fall",
      members: [
        { name: "AA", color: "#2563EB" },
        { name: "AM", color: "#9C719A" },
        { name: "EY", color: "#99B59E" },
        { name: "AH", color: "#485A83" },
      ],
      supervisor: "Dr. Manel Ghalian",
      coSupervisor: "Eng. Khali",
      description:
        "A comprehensive e-learning platform with interactive features, video streaming, assessment tools, and progress tracking for enhanced student learning...",
      file: ".pdf",
    },
    {
      id: 4,
      title: "Blockchain-Based Voting System",
      status: "Rejected",
      domain: "Artificial Intelligence",
      academicYear: "2025/2026",
      semester: "Fall",
      members: [
        { name: "AA", color: "#2563EB" },
        { name: "AM", color: "#9C719A" },
        { name: "EY", color: "#99B59E" },
        { name: "AH", color: "#485A83" },
      ],
      supervisor: "Dr. Ahmed Ali",
      coSupervisor: "Eng. Salma Fawzy",
      description:
        "This project focuses on building an AI chatbot to assist campus students with daily tasks, course information, and administrative queries using natural language processing...",
      file: ".pdf",
    },
    {
      id: 5,
      title: "IoT Home Automation System",
      status: "Submitted",
      domain: "Artificial Intelligence",
      academicYear: "2025/2026",
      semester: "Fall",
      members: [
        { name: "AA", color: "#2563EB" },
        { name: "AM", color: "#9C719A" },
        { name: "EY", color: "#99B59E" },
        { name: "AH", color: "#485A83" },
      ],
      supervisor: "Dr. Ahmed Ali",
      coSupervisor: "Eng. Salma Fawzy",
      description:
        "This project focuses on building an AI chatbot to assist campus students with daily tasks, course information, and administrative queries using natural language processing...",
      file: ".pdf",
    },
    {
      id: 6,
      title: "Healthcare Management Portal",
      status: "Accepted",
      domain: "Computer Vision",
      academicYear: "2025/2026",
      semester: "Fall",
      members: [
        { name: "AA", color: "#2563EB" },
        { name: "AM", color: "#9C719A" },
        { name: "EY", color: "#99B59E" },
        { name: "AH", color: "#485A83" },
      ],
      supervisor: "Dr. Ahmed Ali",
      coSupervisor: "Eng. Salma Fawzy",
      description:
        "An intelligent traffic management system using computer vision and machine learning to optimize traffic flow and reduce congestion in urban areas...",
      file: ".pdf",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return { bg: "#DBEEFF", text: "#1F609D" };
      case "Accepted":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "Rejected":
        return { bg: "#FEE2E2", text: "#991B1B" };
      case "Under review":
        return { bg: "#FEF3C7", text: "#92400E" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  const filteredProjects = projects.filter((project) => {
    const statusMatch =
      selectedFilter === "All" || project.status === selectedFilter;

    const searchLower = searchQuery.toLowerCase().trim();
    const searchMatch =
      searchLower === "" ||
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.domain.toLowerCase().includes(searchLower);

    return statusMatch && searchMatch;
  });

  const handleSaveProject = (updatedProject) => {
    // لو الملف اتحذف، ارجعيه لـ .pdf
    const projectToSave = {
      ...updatedProject,
      file: updatedProject.file || ".pdf",
      members: updatedProject.members || updatedProject.members,
    };
    
    setProjects((prev) =>
      prev.map((p) => (p.id === projectToSave.id ? projectToSave : p))
    );
    setSelectedProject(projectToSave);
  };

  return (
    <>
      <style>{`
        .cards-grid {
          display: grid;
          gap: 24px;
          width: 100%;
          max-width: 100%;
        }

        @media (max-width: 767px) {
          .cards-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }
          .project-card {
            min-height: auto !important;
          }
          .card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            padding: 12px 14px !important;
            min-height: 0 !important;
          }
          .card-title {
            white-space: normal !important;
            font-size: 15px !important;
          }
          .card-content {
            padding: 16px !important;
            gap: 16px !important;
          }
          .domain-row,
          .supervisor-row {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .info-block,
          .supervisor-item {
            width: 100% !important;
            min-width: 100% !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .cards-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 20px;
          }
          .card-content {
            padding: 20px !important;
            gap: 18px !important;
          }
          .domain-row {
            gap: 24px !important;
          }
          .supervisor-row {
            gap: 20px !important;
          }
        }

        @media (min-width: 1024px) and (max-width: 1439px) {
          .cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
          .card-content {
            padding: 30px !important;
            gap: 22px !important;
          }
        }

        @media (min-width: 1440px) {
          .cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
          .card-content {
            padding: 35px !important;
            gap: 24px !important;
          }
        }

        .project-card {
          background: ${colors?.mode === "dark" ? "#1F2937" : "#FFFFFF"};
          border: 1px solid ${
            colors?.mode === "dark" ? "#374151" : "#E5E7EB"
          };
          border-radius: 8px;
          box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          max-width: 100%;
          overflow: visible;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid ${
            colors?.mode === "dark" ? "#374151" : "#E5E7EB"
          };
          box-shadow: ${
            colors?.mode === "dark"
              ? "0px 2px 4px 0px rgba(0, 0, 0, 0.3)"
              : "0px 2px 4px 0px rgba(0, 0, 0, 0.06)"
          };
          min-height: 72px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 400;
          color: ${colors?.text || "#111827"};
          margin: 0;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 20px;
          flex: 1;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }

        .card-content {
          padding: 35px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .domain-row {
          display: flex;
          align-items: flex-start;
          gap: 60px;
          flex-wrap: wrap;
        }

        .info-block {
          flex: 1;
          min-width: 150px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .supervisor-row {
          display: flex;
          align-items: flex-start;
          gap: 40px;
          flex-wrap: wrap;
        }

        .supervisor-item {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          min-width: 180px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .supervisor-item span {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .card-description {
          font-size: 14px;
          font-weight: 400;
          color: ${colors?.text || "#000000"};
          margin: 0;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 20px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }
      `}</style>

      <div className="cards-grid">
        {filteredProjects.map((project) => {
          const statusColor = getStatusColor(project.status);

          return (
            <div key={project.id} className="project-card">
              <div className="card-header">
                <h3 className="card-title">{project.title}</h3>
                <span
                  style={{
                    minWidth: "89px",
                    height: "40px",
                    borderRadius: "16px",
                    fontSize: "14px",
                    fontWeight: "400",
                    background: statusColor.bg,
                    color: statusColor.text,
                    fontFamily: "Inter, -apple-system, sans-serif",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "20px",
                    padding: "0 16px",
                  }}
                >
                  {t(project.status)}
                </span>
              </div>

              <div className="card-content">
                <div className="domain-row">
                  <div className="info-block">
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                        margin: "0 0 8px 0",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {t("Domain")}
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.text || "#111827",
                        margin: 0,
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {project.domain}
                    </p>
                  </div>
                  <div className="info-block">
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                        margin: "0 0 8px 0",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {t("Academic Year")}
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.text || "#111827",
                        margin: 0,
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {project.academicYear}
                    </p>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                      margin: "0 0 8px 0",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      lineHeight: "20px",
                    }}
                  >
                    {t("Semester")}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: colors?.text || "#111827",
                      margin: 0,
                      fontFamily: "Inter, -apple-system, sans-serif",
                      lineHeight: "20px",
                    }}
                  >
                    {project.semester}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                      margin: "0 0 16px 0",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      lineHeight: "20px",
                    }}
                  >
                    {t("Members")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {project.members.map((member, index) => (
                        <div
                          key={index}
                          style={{
                            width: "46px",
                            height: "44px",
                            borderRadius: "50%",
                            background: member.color,
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "400",
                            fontFamily: "Inter, -apple-system, sans-serif",
                            lineHeight: "24px",
                            marginLeft: !isRTL && index > 0 ? "-12px" : "0",
                            marginRight: isRTL && index > 0 ? "-12px" : "0",
                            zIndex: project.members.length - index,
                          }}
                        >
                          {member.name}
                        </div>
                      ))}
                      <div
                        style={{
                          width: "46px",
                          height: "44px",
                          borderRadius: "50%",
                          background:
                            colors?.mode === "dark" ? "#374151" : "#D6DADE",
                          marginLeft: !isRTL ? "-12px" : "0",
                          marginRight: isRTL ? "-12px" : "0",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedProject(project);
                          setIsAddMemberOpen(true);
                        }}
                      >
                        {""}
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.text || "#111827",
                        margin: 0,
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "24px",
                      }}
                    >
                      Mohamed , Ahmed , Elham
                    </p>
                  </div>
                </div>

                <div className="supervisor-row">
                  <div className="supervisor-item">
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Supervisor:
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.text || "#111827",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {project.supervisor}
                    </span>
                  </div>
                  <div className="supervisor-item">
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Co Supervisor:
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.text || "#111827",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {project.coSupervisor}
                    </span>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                      margin: "0 0 8px 0",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      lineHeight: "20px",
                    }}
                  >
                    {t("Description")}
                  </p>
                  <p className="card-description">{project.description}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <div>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: colors?.mode === "dark" ? "#9CA3AF" : "#6B7280",
                        margin: "0 0 8px 0",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {t("File")}
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <FileText size={24} color="#4E4E4E" strokeWidth={1.5} />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#4E4E4E",
                          fontFamily: "Inter, -apple-system, sans-serif",
                          fontWeight: "400",
                          textDecoration: "underline",
                        }}
                      >
                        {project.file || ".pdf"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "22px",
                      marginTop: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      style={{
                        minWidth: "60px",
                        height: "30px",
                        background: "transparent",
                        border: `1px solid ${
                          colors?.mode === "dark" ? "#4B5563" : "#71717A"
                        }`,
                        borderRadius: "6px",
                        color: colors?.mode === "dark" ? "#FFFFFF" : "#09090B",
                        fontSize: "13px",
                        fontWeight: "400",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        cursor:
                          project.status === "Under review" ||
                          project.status === "Accepted"
                            ? "not-allowed"
                            : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        padding: "0 12px",
                        opacity:
                          project.status === "Under review" ||
                          project.status === "Accepted"
                            ? 0.5
                            : 1,
                      }}
                      onClick={() => {
                        if (
                          project.status !== "Under review" &&
                          project.status !== "Accepted"
                        ) {
                          setSelectedProject(project);
                          setIsEditOpen(true);
                        }
                      }}
                      disabled={
                        project.status === "Under review" ||
                        project.status === "Accepted"
                      }
                    >
                      {t("Edit")}
                    </button>

                    <button
                      style={{
                        minWidth: "111px",
                        height: "30px",
                        background: "#1F609D",
                        border: "none",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: "400",
                        fontFamily: "Inter, -apple-system, sans-serif",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        padding: "0 12px",
                      }}
                      onClick={() => {
                        setSelectedProject(project);
                        setIsAddMemberOpen(true);
                      }}
                    >
                      {t("Add Member")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditProjectModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />

      <AddMemberModal
        open={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </>
  );
};

export default AllProjectCards;