import React from "react";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown } from "lucide-react";
import { FaSlidersH } from "react-icons/fa";

const AllProjectsHeader = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
}) => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      style={{
        width: "100%",
        marginBottom: "24px",
        display: "flex",
        gap: "16px",
      }}
    >
      {/* Search panel - wider (e.g. 70%) */}
      <div
        style={{
          flex: 7, 
          height: "48px",
          borderRadius: "8px",
          border: "1px solid #D9D9D9",
          background: colors?.mode === "dark" ? "#374151" : "#FFFFFF",
          boxShadow:
            "0px 0px 0px 1px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          placeholder={t("Search ...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: colors?.text || "#000000",
            fontSize: "14px",
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        />
      </div>

      {/* Select panel - narrower (e.g. 30%) */}
      <div
        style={{
          flex: 3,
          height: "48px",
          borderRadius: "8px",
          border: "1px solid #D9D9D9",
          background: colors?.mode === "dark" ? "#374151" : "#FFFFFF",
          boxShadow:
            "0px 0px 0px 1px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <FaSlidersH
          size={18}
          style={{
            color: colors?.text || "#1F2933",
            marginRight: isRTL ? 0 : 8,
            marginLeft: isRTL ? 8 : 0,
          }}
        />

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          style={{
            flex: 1,
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: colors?.text || "#71717A",
            fontSize: "14px",
            fontFamily: "Inter, -apple-system, sans-serif",
            appearance: "none",
            paddingRight: "32px",
          }}
        >
          <option value="All">{t("Select")}</option>
          <option value="Submitted">{t("Submitted")}</option>
          <option value="Accepted">{t("Accepted")}</option>
          <option value="Rejected">{t("Rejected")}</option>
          <option value="Under review">{t("Under review")}</option>
        </select>

        <ChevronsUpDown
          size={18}
          style={{
            position: "absolute",
            right: isRTL ? "auto" : 16,
            left: isRTL ? 16 : "auto",
            color: "#000000",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default AllProjectsHeader;