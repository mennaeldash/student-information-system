import React, { useState, useEffect } from "react";
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
}) {
  const [progress, set_progress] = useState(0);
  const { colors } = useThemeContext();
  const { i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    let start = 0;
    const end = Math.min(value, max ?? 100);
    const duration = 1000;
    const increment = end / (duration / 10);

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

  const percent = (progress / (max ?? 100)) * 100;

  return (
    <div
      style={{
        background: colors?.box || "#fff",
        borderRadius: 16,
        padding: 'clamp(12px, 3.5vw, 24px)',
        paddingBottom: 20,
        
        // paddingBottom: hide_progress_bar ? 12 : 20,
        width: '100%',       
     maxWidth: '100%',
    minWidth: 270,       
     flex: '1 1 260px',  
        minHeight: 170,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        position: "relative",
        border: `1px solid ${colors?.border}`,
        direction: isRTL ? "rtl" : "ltr", // 🟢 خلي اتجاه الكارت كله يتظبط
        ...box_style,
      }}
    >
      {icon && (
        <div
          style={{
            position: "absolute",
            top: 17,
            [isRTL ? "left" : "right"]: 10, // 🟢 الأيقونة حسب اللغة
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
          fontSize: 'clamp(12px, 3.5vw, 16px)',
          color: "#64748B",
          textAlign: isRTL ? "right" : "left", // 🟢 محاذاة النص
        }}
      >
        {label}
      </div>

      {/* Value + Max Label */}
      <div
        style={{
          fontSize: 'clamp(28px, 4vw, 20px)',
          fontWeight:"normal",
          color: colors?.mode === "dark" ? "#fff" : "#000",
          textAlign: isRTL ? "right" : "left", // 🟢 القيمة تتحاذى حسب اللغة
        }}
      >
        {progress.toFixed(2)}
        {max_label && (
          <span
            style={{
              fontSize: 'clamp(12px, 3.2vw, 15px)',
              color: "#64748B",
              fontWeight: 400,
              marginLeft: isRTL ? 0 : 15, // 🟢 المسافة حسب اللغة
              marginRight: isRTL ? 15 : 0,
            }}
          >
            {max_label}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!hide_progress_bar && (
        <div
  style={{
    position: "absolute",
    left: 20,
    right: 20,
    bottom: extra_info ? 20 : 15,
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
      backgroundColor: bar_color || "#3B82F6",
      transition: "width 0.5s ease",
    }}
  />
</div>

      )}

      {/* Extra info */}
      {extra_info && (
        <div
          style={{
            position: "absolute",
            bottom: extra_info ? 'clamp(14px, 3.5vw, 20px)'
                   : 'clamp(12px, 3vw, 16px)'
,
            color: colors?.text,
            textAlign: isRTL ? "right" : "left", // 🟢 النص الإضافي برضه
          }}
        >
          {extra_info}
        </div>
      )}
    </div>
  );
}

export default AnimatedProgressBar;
