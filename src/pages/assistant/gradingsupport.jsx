import React, { useState } from "react";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import CreateProject from "@/components/assistant/GS_components/CreateProject.jsx";
import AllProjectsHeader from "@/components/assistant/GS_components/AllProjectsHeader.jsx";
import AllProjectCards from "@/components/assistant/GS_components/AllProjectCards.jsx";

const GradingSupport = () => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        width: "100%",
        minHeight: "100vh",
        background: colors?.background || "#F9FAFB",
        padding: "40px 0 80px 0",
      }}
    >
      {/* TABS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: "32px",
          padding: "0 24px",
        }}
      >
        <div
          className="tabs-container"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "797px",
            height: "55px",
            background: colors?.mode === "dark" ? "#374151" : "#F4F4F5",
            borderRadius: "8px",
            padding: "8px 10px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            gap: "91px",
            boxShadow:
              "0px 0px 0px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* CREATE PROJECT */}
          <div
            style={{
              flex: 1,
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            {activeTab === "create" && (
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  width: "400px",
                  height: "40px",
                  background: colors?.box || "#FFFFFF",
                  borderRadius: "8px",
                  zIndex: 0,
                  transition: "all 0.2s ease",
                  boxShadow:
                    "0px 0px 0px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
                }}
              />
            )}
            <button
              onClick={() => setActiveTab("create")}
              style={{
                width: "185px",
                height: "20px",
                background: "transparent",
                color: colors?.text || "#000000",
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "18px",
                fontWeight: "400",
                lineHeight: "20px",
                border: "none",
                cursor: "pointer",
                padding: "0",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                position: "relative",
              }}
            >
              {t("Create Project")}
            </button>
          </div>

          {/* ALL PROJECT */}
          <div
            style={{
              flex: 1,
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            {activeTab === "all" && (
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  width: "387px",
                  height: "40px",
                  background: colors?.box || "#FFFFFF",
                  borderRadius: "8px",
                  zIndex: 0,
                  transition: "all 0.2s ease",
                  boxShadow:
                    "0px 0px 0px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
                }}
              />
            )}
            <button
              onClick={() => setActiveTab("all")}
              style={{
                width: "185px",
                height: "20px",
                background: "transparent",
                color: colors?.text || "#000000",
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "18px",
                fontWeight: "400",
                lineHeight: "20px",
                border: "none",
                cursor: "pointer",
                padding: "0",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                position: "relative",
              }}
            >
              {t("All Project")}
            </button>
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "create" ? (
        <CreateProject />
      ) : (
        <div
          style={{
            width: "100%",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1096px", // نفس عرض صف الكروت
              margin: "0 auto",
            }}
          >
            {/* الهيدر */}
            <AllProjectsHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />

            {/* الكروت بدون كارد أبيض حوالينهم */}
            <AllProjectCards
              searchQuery={searchQuery}
              selectedFilter={selectedFilter}
            />
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1117px) {
          .tabs-container { 
            width: 100% !important;
            maxWidth: 797px !important;
            height: 55px !important;
            flex-direction: row !important;
            padding: 8px 10px !important;
            gap: 8px !important;
          }
          .tabs-container > div {
            flex: 1 !important;
            height: 40px !important;
          }
          .tabs-container > div:first-child {
            justify-content: flex-start !important;
          }
          .tabs-container > div:last-child {
            justify-content: flex-end !important;
          }
          .tabs-container > div > div {
            width: 387px !important;
            height: 40px !important;
          }
          .tabs-container button {
            width: 387px !important;
            height: 40px !important;
            font-size: 18px !important;
          }
        }
        
        @media (max-width: 1116px) {
          .tabs-container {
            width: 90% !important;
            max-width: 600px !important;
            height: auto !important;
            flex-direction: column !important;
            padding: 12px !important;
            gap: 12px !important;
          }
          .tabs-container > div {
            width: 100% !important;
            height: 48px !important;
            justify-content: center !important;
          }
          .tabs-container > div > div {
            width: 100% !important;
            height: 48px !important;
            left: 0 !important;
            right: 0 !important;
          }
          .tabs-container button {
            width: 100% !important;
            height: 48px !important;
            font-size: 18px !important;
          }
        }
        
        @media (max-width: 768px) {
          .tabs-container {
            width: 95% !important;
          }
          .tabs-container button {
            font-size: 17px !important;
          }
        }
        
        @media (max-width: 480px) {
          .tabs-container {
            width: 95% !important;
            padding: 10px !important;
            gap: 10px !important;
          }
          .tabs-container > div {
            height: 44px !important;
          }
          .tabs-container > div > div {
            height: 44px !important;
          }
          .tabs-container button {
            height: 44px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GradingSupport;
