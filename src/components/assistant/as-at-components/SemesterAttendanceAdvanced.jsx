import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  MapPin,
  Users,
  User,
  ChevronsUpDown,
  Calendar,
  X,
} from "lucide-react";

import AttendanceTable from "../../assistant/AttendanceTable";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function SemesterAttendanceAdvanced() {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedCourse, setSelectedCourse] = useState("");
  const [sectionNumber, setSectionNumber] = useState("S01");
  const [sessionDate, setSessionDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [apiCoursesData, setApiCoursesData] = useState([]);
  const [apiSectionsData, setApiSectionsData] = useState([]);
  const [apiSessionsData, setApiSessionsData] = useState([]);

  const [sessionStats, setSessionStats] = useState({
    completedSessions: 0,
    canceledSessions: 0,
    totalSessions: 0,
    totalStudents: 0,
    totalPresentStudents: 0,
  });

  useEffect(() => {
    fetchCoursesFromAPI();
  }, []);

  const fetchCoursesFromAPI = async () => {
    setLoading(true);
    setTimeout(() => {
      setApiCoursesData([
        { id: "cs101", name: "CS Building 101" },
        { id: "math202", name: "Math Building 202" },
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (!selectedCourse) {
      setApiSectionsData([]);
      setApiSessionsData([]);
      setSessionDate("");
      setSectionNumber("S01");
      return;
    }
    fetchSectionsFromAPI(selectedCourse);
  }, [selectedCourse]);

  const fetchSectionsFromAPI = async () => {
    setLoading(true);
    setTimeout(() => {
      setApiSectionsData([
        { id: "S01", name: "S01" },
        { id: "S02", name: "S02" },
        { id: "S03", name: "S03" },
      ]);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (!selectedCourse || !sectionNumber) {
      setApiSessionsData([]);
      setSessionDate("");
      return;
    }
    fetchSessionsFromAPI(selectedCourse, sectionNumber);
  }, [selectedCourse, sectionNumber]);

  const fetchSessionsFromAPI = async () => {
    setLoading(true);
    setTimeout(() => {
      const sessions = [
        { id: "s1", name: "Session 1 - 01/02/2025" },
        { id: "s2", name: "Session 2 - 01/06/2025" },
        { id: "s3", name: "Session 3 - 01/09/2025" },
      ];
      setApiSessionsData(sessions);
      setSessionDate((prev) => prev || sessions[0]?.id || "");
      setLoading(false);
    }, 300);
  };

  const handleStatsUpdate = (stats) => setSessionStats(stats);

  const selectedCourseName = useMemo(() => {
    return apiCoursesData.find((c) => c.id === selectedCourse)?.name || "—";
  }, [apiCoursesData, selectedCourse]);

  const selectedSessionName = useMemo(() => {
    return apiSessionsData.find((s) => s.id === sessionDate)?.name || "—";
  }, [apiSessionsData, sessionDate]);

  const SummaryCard = ({
    number,
    label,
    iconBg,
    icon: Icon,
    iconSize,
    iconColor,
    progressWidth,
    progressColor,
  }) => (
    <div
      className="summary-card"
      style={{
        flex: "1 1 calc(33.333% - 53.33px)",
        minWidth: "300px",
        height: "150px",
        background: colors?.box || "#FFFFFF",
        borderRadius: "8px",
        padding: "28px 28px 24px 28px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "400",
            lineHeight: "32px",
            color: colors?.text || "#000000",
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        >
          {number}
        </span>

        <div
          style={{
            width: "50px",
            height: "40px",
            background: iconBg,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: iconSize, height: iconSize, color: iconColor, strokeWidth: 2.5 }} />
        </div>
      </div>

      <span
        style={{
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "20px",
          color: colors?.textSecondary || "#9CA3AF",
          fontFamily: "Inter, -apple-system, sans-serif",
          marginTop: "-8px",
        }}
      >
        {t(label)}
      </span>

      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ position: "relative", width: "100%", height: "6px" }}>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: colors?.mode === "dark" ? "#374151" : "#E5E7EB",
              borderRadius: "3px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: progressWidth,
              height: "100%",
              background: progressColor,
              borderRadius: "3px",
              zIndex: 1,
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        width: "100%",
        background: colors?.background || "#F9FAFB",
        paddingBottom: "80px",
      }}
    >
      {/* Course Selection */}
      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            background: colors?.box || "#FFFFFF",
            borderRadius: "8px",
            border: `2px solid ${colors?.mode === "dark" ? "#374151" : "#E5E7EB"}`,
            padding: "20px 20px 16px 20px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <ClipboardList size={20} strokeWidth={2.5} style={{ color: colors?.text || "#000" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 400, margin: 0, fontFamily: "Inter" }}>
              {t("Course and Section Selection")}
            </h3>
          </div>

          <div
            className="form-fields-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              marginBottom: "20px",
            }}
          >
            {/* Course */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontFamily: "Inter" }}>
                {t("Course")} <span style={{ color: "#EF4444" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: isRTL ? "0 16px 0 40px" : "0 40px 0 16px",
                    fontSize: 16,
                    fontFamily: "Inter",
                    color: colors?.text || "#000",
                    background: colors?.box || "#fff",
                    border: "1px solid #71717A",
                    borderRadius: 8,
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">{t("Select Course")}</option>
                  {apiCoursesData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <ChevronsUpDown
                  size={16}
                  strokeWidth={2}
                  style={{
                    position: "absolute",
                    ...(isRTL ? { left: 16 } : { right: 16 }),
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors?.text || "#000",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Section */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontFamily: "Inter" }}>
                {t("Section Number")}
              </label>

              <div style={{ position: "relative" }}>
                <select
                  value={sectionNumber}
                  onChange={(e) => setSectionNumber(e.target.value)}
                  disabled={!selectedCourse}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: isRTL ? "0 16px 0 40px" : "0 40px 0 16px",
                    fontSize: 16,
                    fontFamily: "Inter",
                    color: colors?.text || "#000",
                    background: colors?.box || "#fff",
                    border: "1px solid #71717A",
                    borderRadius: 8,
                    outline: "none",
                    appearance: "none",
                    cursor: selectedCourse ? "pointer" : "not-allowed",
                    opacity: selectedCourse ? 1 : 0.6,
                  }}
                >
                  {(apiSectionsData.length ? apiSectionsData : [{ id: "S01", name: "S01" }]).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <ChevronsUpDown
                  size={16}
                  strokeWidth={2}
                  style={{
                    position: "absolute",
                    ...(isRTL ? { left: 16 } : { right: 16 }),
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors?.text || "#000",
                    pointerEvents: "none",
                    opacity: selectedCourse ? 1 : 0.5,
                  }}
                />
              </div>
            </div>

            {/* Session Date */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontFamily: "Inter" }}>
                {t("Session Date")}
              </label>

              <div style={{ position: "relative" }}>
                <select
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  disabled={!selectedCourse || apiSessionsData.length === 0}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: isRTL ? "0 16px 0 40px" : "0 40px 0 16px",
                    fontSize: 16,
                    fontFamily: "Inter",
                    color: colors?.text || "#000",
                    background: colors?.box || "#fff",
                    border: "1px solid #71717A",
                    borderRadius: 8,
                    outline: "none",
                    appearance: "none",
                    cursor: !selectedCourse || apiSessionsData.length === 0 ? "not-allowed" : "pointer",
                    opacity: !selectedCourse || apiSessionsData.length === 0 ? 0.6 : 1,
                  }}
                >
                  {apiSessionsData.length === 0 ? (
                    <option value="">{t("Select Session")}</option>
                  ) : (
                    apiSessionsData.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  )}
                </select>

                <ChevronsUpDown
                  size={16}
                  strokeWidth={2}
                  style={{
                    position: "absolute",
                    ...(isRTL ? { left: 16 } : { right: 16 }),
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors?.text || "#000",
                    pointerEvents: "none",
                    opacity: !selectedCourse || apiSessionsData.length === 0 ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Info tags */}
          <div
            className="info-tags-container"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 50,
              background: colors?.mode === "dark" ? "#374151" : "#F4F4F5",
              borderRadius: 6,
              padding: "8px 20px",
              gap: 22,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <MapPin size={16} strokeWidth={2.5} style={{ color: "#71717A" }} />
              <span style={{ fontSize: 14, fontFamily: "Inter", whiteSpace: "nowrap" }}>
                {selectedCourseName}
              </span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Users size={16} strokeWidth={2.5} style={{ color: "#71717A" }} />
              <span style={{ fontSize: 14, fontFamily: "Inter", whiteSpace: "nowrap" }}>
                {sessionStats.totalStudents} {t("Student")}
              </span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <User size={16} strokeWidth={2.5} style={{ color: "#71717A" }} />
              <span style={{ fontSize: 14, fontFamily: "Inter", whiteSpace: "nowrap" }}>
                Eng/ Ahmed Mohamed
              </span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Calendar size={16} strokeWidth={2.5} style={{ color: "#71717A" }} />
              <span style={{ fontSize: 14, fontFamily: "Inter", whiteSpace: "nowrap" }}>
                {selectedSessionName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ width: "100%", margin: "24px auto 32px auto", padding: "0 24px" }}>
        <div className="summary-cards-wrapper" style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <SummaryCard
            number={sessionStats.completedSessions}
            label="Session Completed"
            iconBg="#C0EFD0"
            icon={Calendar}
            iconSize={20}
            iconColor="#16A34A"
            progressWidth={`${sessionStats.totalSessions > 0 ? (sessionStats.completedSessions / sessionStats.totalSessions) * 100 : 0}%`}
            progressColor="#1CA950"
          />

          <SummaryCard
            number={sessionStats.canceledSessions}
            label="Session Canceled"
            iconBg="#FEE2E2"
            icon={X}
            iconSize={16}
            iconColor="#DC2626"
            progressWidth={`${sessionStats.totalSessions > 0 ? (sessionStats.canceledSessions / sessionStats.totalSessions) * 100 : 0}%`}
            progressColor="#DC2626"
          />

          <SummaryCard
            number={sessionStats.totalStudents}
            label="Total Students"
            iconBg="#B8CEEE"
            icon={Users}
            iconSize={18}
            iconColor="#475569"
            progressWidth="100%"
            progressColor="#2563EB"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div style={{ width: "100%", margin: "0 auto 60px auto", padding: "0 24px" }}>
        <AttendanceTable onStatsUpdate={handleStatsUpdate} />
      </div>

      {/* نفس CSS بتاعك */}
      <style>{`
        @media (max-width: 1024px) and (min-width: 769px) {
          .form-fields-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 20px !important; 
          }
          .form-fields-grid > div:last-child { grid-column: span 2; }
          .info-tags-container { 
            gap: 12px !important; 
            padding: 8px 12px !important;
            height: auto !important;
            min-height: 50px !important;
          }
        }
        @media (max-width: 768px) and (min-width: 481px) {
          .form-fields-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .info-tags-container {
            width: 100% !important;
            height: auto !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px !important;
            gap: 10px !important;
          }
        }
        @media (max-width: 480px) {
          .form-fields-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .info-tags-container {
            width: 100% !important;
            height: auto !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 10px !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 1116px) {
          .summary-cards-wrapper { flex-direction: column !important; }
          .summary-card { width: 100% !important; min-width: auto !important; flex: none !important; }
        }
      `}</style>
    </div>
  );
}
