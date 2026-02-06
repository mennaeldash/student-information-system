import React, { useState, useEffect, useMemo } from "react";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

function AnimatedProgressBar({
  value,
  max = 100,
  label,
  box_style = {},
  value_color,
  max_color,
  max_label = "",
  bar_color, 
  icon,
  extra_info,
  hide_progress_bar = false,

  displayValue = null,   
  displaySuffix = "",   
}) {
  const [progress, set_progress] = useState(0);
  const { colors } = useThemeContext();
  const { i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    let start = 0;
    const end = Math.min(Number(value ?? 0), Number(max ?? 100));
    const duration = 120;
    const increment = end / (duration / 10 || 1);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      set_progress(start);
    }, 10);

    return () => clearInterval(timer);
  }, [value, max]);

  const safeMax = Number(max ?? 100) || 100;

  const percent = useMemo(() => {
    const p = (progress / safeMax) * 100;
    return Math.max(0, Math.min(100, p));
  }, [progress, safeMax]);

  const autoBarColor = useMemo(() => {
    if (percent < 25) return "#ef4444";
    if (percent < 50) return "#f97316";
    if (percent < 75) return "#eab308";
    return "#22c55e";
  }, [percent]);

  const finalBarColor = bar_color || autoBarColor;

  const shownNumber = useMemo(() => {
    const n = displayValue !== null ? Number(displayValue) : Number(progress);
    if (!Number.isFinite(n)) return "0.00";
    return n.toFixed(2);
  }, [displayValue, progress]);

  return (
    <div
      style={{
        background: colors?.box || "#fff",
        borderRadius: 16,
        padding: "clamp(12px, 3.5vw, 24px)",
        paddingBottom: extra_info ? 34 : 20,
        width: "100%",
        maxWidth: "100%",
        minWidth: 270,
        flex: "1 1 260px",
        minHeight: 170,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        position: "relative",
        border: `1px solid ${colors?.border}`,
        direction: isRTL ? "rtl" : "ltr",
        ...box_style,
      }}
    >
      {icon && (
        <div
          style={{
            position: "absolute",
            top: 17,
            [isRTL ? "left" : "right"]: 10,
            borderRadius: 12,
            padding: 4,
          }}
        >
          {icon}
        </div>
      )}

      {/* Label */}
      <div
        style={{
          fontWeight: 500,
          fontSize: "clamp(12px, 3.5vw, 16px)",
          color: "#64748B",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {label}
      </div>

      {/* Value + Max Label */}
      <div
        style={{
          fontSize: "clamp(20px, 4vw, 28px)",
          fontWeight: "normal",
          color: value_color || finalBarColor,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {shownNumber}
        {displaySuffix ? (
          <span
            style={{
              fontSize: "clamp(12px, 3.2vw, 15px)",
              color: max_color || "#64748B",
              fontWeight: 400,
              marginLeft: isRTL ? 0 : 10,
              marginRight: isRTL ? 10 : 0,
            }}
          >
            {displaySuffix}
          </span>
        ) : (
          max_label && (
            <span
              style={{
                fontSize: "clamp(12px, 3.2vw, 15px)",
                color: max_color || "#64748B",
                fontWeight: 400,
                marginLeft: isRTL ? 0 : 15,
                marginRight: isRTL ? 15 : 0,
              }}
            >
              {max_label}
            </span>
          )
        )}
      </div>

      {/* Progress bar */}
      {!hide_progress_bar && (
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: extra_info ? 12 : 15,
            height: 6,
            backgroundColor: colors?.mode === "dark" ? "#334155" : "#E2E8F0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              backgroundColor: finalBarColor,
              transition: "width 0.5s ease, background-color 0.25s ease",
            }}
          />
        </div>
      )}

      {/* Extra info */}
      {extra_info && (
        <div
          style={{
            position: "absolute",
            bottom: 26,
            color: colors?.text,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {extra_info}
        </div>
      )}
    </div>
  );
}

export default AnimatedProgressBar;
