import React from "react";
import { ChevronDown } from "lucide-react";
import { useThemeContext } from "../../services/theme_context.jsx";

export default function CourseCard({
  isVerySmall,
  isRTL,
  t,
  course,
  index,
  onToggleCourseDetails,
}) {
  const { colors, mode } = useThemeContext();
  const isDark = mode === "dark";

  // ✅ UI palette built from your theme_context colors
  const ui = {
    background: colors?.background,
    box: colors?.box,
    text: colors?.text,
    secondary: colors?.secondary,
    border: colors?.border,

    // separators/buttons (mapped to your existing keys)
    separator: colors?.border,
    shadow: "none", // لو عندك shadow في design حطيه هنا
    buttonBg: colors?.chosen, // زر show/hide details
    buttonHoverBg: colors?.min, // hover
  };

  return (
    <div
      style={{
        display: "inline-block",
        width: "100%",
        breakInside: "avoid",
        pageBreakInside: "avoid",
        marginBottom: "30px",

        borderRadius: "8px",
        background: ui.box,
        border: `1px solid ${ui.border}`,
        boxShadow: ui.shadow,
        padding: isVerySmall ? "16px 12px 12px 12px" : "24px 16px 16px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          paddingLeft: isVerySmall ? "8px" : "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "20px",
              color: ui.text,
            }}
          >
            {course.code}
          </span>

          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "20px",
              color: ui.text,
              whiteSpace: isVerySmall ? "normal" : "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course.name}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40px",
            padding: "10px",
            borderRadius: "8px",
            background:
              course.grade === "A+"
                ? isDark
                  ? "rgba(34,197,94,0.14)"
                  : "#F0FDF4"
                : course.grade === "B"
                ? isDark
                  ? "rgba(245,158,11,0.14)"
                  : "#FBF6F0"
                : isDark
                ? "rgba(59,130,246,0.14)"
                : "#EFF3FE",
            boxSizing: "border-box",
            marginLeft: "8px",
            flexShrink: 0,
            border: "none",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              textAlign: "center",
              color: course.grade_color,
              whiteSpace: "nowrap",
            }}
          >
            {course.credits} {t?.("Credits") || "Credits"}
          </span>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: ui.separator,
          marginBottom: "16px",
        }}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingLeft: isVerySmall ? "8px" : "16px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
              color: ui.secondary,
              fontFamily: "Inter, sans-serif",
              flexShrink: 0,
            }}
          >
            {t?.("Instructor") || "Instructor"}:
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: ui.text,
              fontFamily: "Inter, sans-serif",
              textAlign: isRTL ? "left" : "right",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "70%",
            }}
          >
            {course.instructor}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
              color: ui.secondary,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {t?.("Grade") || "Grade"}:
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "20px",
              color: course.grade_color,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {course.grade}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
              color: ui.secondary,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {t?.("Grade Point") || "Grade Point"}:
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: ui.text,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {Number(course.grade_point || 0).toFixed(2)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
              color: ui.secondary,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {t?.("Total Score") || "Total Score"}:
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "20px",
              color: ui.secondary,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {course.total_score}
          </span>
        </div>
      </div>

      <button
        onClick={() => onToggleCourseDetails(index)}
        style={{
          width: "100%",
          maxWidth: "250px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "6px",
          border: `1px solid ${ui.border}`,
          backgroundColor: ui.buttonBg,
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          color: ui.text,
          lineHeight: "20px",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ui.buttonHoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ui.buttonBg)}
      >
        <span style={{ color: ui.text }}>
          {course.expanded
            ? t?.("Hide Details") || "Hide Details"
            : t?.("Show Details") || "Show Details"}
        </span>

        <ChevronDown
          size={20}
          color={ui.text}
          strokeWidth={2}
          style={{
            transform: course.expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {course.expanded && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingLeft: isVerySmall ? "8px" : "16px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              margin: "0 0 8px 0",
              color: ui.text,
              textAlign: isRTL ? "right" : "left",
              marginLeft: isRTL ? 0 : -(isVerySmall ? 4 : 19),
              marginRight: isRTL ? -(isVerySmall ? 4 : 8) : 0,
            }}
          >
            {t?.("Detailed Scores") || "Detailed Scores"}
          </h4>

          {[
            { label: t?.("Attendance") || "Attendance", value: "8 / 10" },
            { label: t?.("Quiz 1") || "Quiz 1", value: "5 / 5" },
            { label: t?.("Quiz 2") || "Quiz 2", value: "4 / 5" },
            { label: t?.("Assignment 1") || "Assignment 1", value: "3 / 5" },
            { label: t?.("Assignment 2") || "Assignment 2", value: "4 / 5" },
            { label: t?.("Practical") || "Practical", value: "5 / 5" },
            { label: t?.("Project") || "Project", value: "4 / 5" },
            { label: t?.("Sub Total") || "Sub Total", value: "33 / 40", bold: true },
            { label: t?.("Midterm") || "Midterm", value: "10 / 10" },
            { label: t?.("Final") || "Final", value: "49 / 50" },
            { label: t?.("Total") || "Total", value: course.total_score, bold: true },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "6px",
                paddingBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: row.bold ? 600 : 400,
                  color: ui.secondary,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {row.label}:
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: row.bold ? 600 : 400,
                  color: ui.text,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
