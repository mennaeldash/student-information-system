// src/components/assistant/as_co_components/TAScheduleList.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Box, Paper, Typography, Chip, Stack, Divider, Button } from "@mui/material";
import { Calendar } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import AddEventDialog from "./AddEventDialog.jsx";

const scheduleData = [
  {
    day: "Saturday",
    items: [
      { title: "Introduction to computer", type: "Section", location: "Room 302", time: "From 9:00 to 10:00", group: "Group B" },
    ],
  },
  {
    day: "Sunday",
    items: [
      { title: "Introduction to computer", type: "Meeting", location: "Online", time: "From 9:00 to 10:00", group: "Group A" },
      { title: "Introduction to computer", type: "Section", location: "Room 302", time: "From 9:00 to 10:00", group: "Group C" },
    ],
  },
  {
    day: "Monday",
    items: [
      { title: "Introduction to computer", type: "Section", location: "Room 302", time: "From 9:00 to 10:00", group: "Group A" },
    ],
  },
  {
    day: "Tuesday",
    items: [
      { title: "Introduction to computer", type: "Meeting", location: "Online", time: "From 9:00 to 10:00", group: "Group D" },
      { title: "Computer Programming", type: "Section", location: "Room 302", time: "From 12:00 to 01:00", group: "Group A" },
      { title: "Introduction to computer", type: "Section", location: "Room 302", time: "From 9:00 to 10:00", group: "Group C" },
    ],
  },
  {
    day: "Wednesday",
    items: [
      { title: "Introduction to computer", type: "Section", location: "Room 302", time: "From 9:00 to 10:00", group: "Group B" },
    ],
  },
  {
    day: "Thursday",
    items: [
      { title: "Introduction to computer", type: "Section", location: "Room 302", time: "From 9:00 to 10:00", group: "Group A" },
    ],
  },
];

function HorizontalScroller({
  children,
  itemGap = { xs: 14, md: 20 },
  snap = "proximity",
  height = 78,
  dir = "ltr",
  sx,
  scrollerRef,
}) {
  const innerRef = useRef(null);
  const ref = scrollerRef ?? innerRef;

  const drag = useRef({ active: false, x: 0, left: 0 });

  const onDown = (e) => {
    const el = ref.current;
    if (!el) return;
    drag.current = {
      active: true,
      x: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
      left: el.scrollLeft,
    };
    el.style.cursor = "grabbing";
    el.dataset.dragging = "1";
  };

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    el.scrollLeft = drag.current.left + (drag.current.x - x);
  };

  const onUp = () => {
    const el = ref.current;
    drag.current.active = false;
    if (el) {
      el.style.cursor = "";
      el.dataset.dragging = "";
    }
  };

  const onWheel = (e) => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta !== 0) {
        e.preventDefault();
        el.scrollLeft += delta * 1.06;
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height,
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Box
        ref={ref}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseLeave={onUp}
        onMouseUp={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onWheel={onWheel}
        sx={{
          px: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: itemGap,
          overflowX: "auto",
          overflowY: "hidden",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          direction: dir,
          width: "100%",

          scrollSnapType: `x ${snap}`,
          "&[data-dragging='1']": { scrollSnapType: "none" },
          "& > *": { scrollSnapAlign: "start", minWidth: "max-content", flexShrink: 0 },

          "&::after": { content: '""', flex: "1 1 auto", minWidth: 0 },

          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },

          overscrollBehaviorX: "contain",
          willChange: "scroll-position",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* -------------------- MultiScrollTrack (per day) -------------------- */
function MultiScrollTrack({ targets, sx }) {
  const trackRef = useRef(null);
  const [state, setState] = useState({ thumb: 0, left: 0, overflow: false });

  const getDir = (el) => getComputedStyle(el).direction || "ltr";

  const setLogicalLeft = (el, logicalLeft) => {
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const clamped = Math.max(0, Math.min(logicalLeft, max));
    if (getDir(el) === "rtl") el.scrollLeft = max - clamped;
    else el.scrollLeft = clamped;
  };

  const getLogicalLeft = (el) => {
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    return getDir(el) === "rtl" ? max - el.scrollLeft : el.scrollLeft;
  };

  const recalc = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const els = (targets || []).map((r) => r?.current).filter(Boolean);

    if (!els.length || track.clientWidth === 0) {
      setState({ thumb: 0, left: 0, overflow: false });
      return;
    }

    // leader = أكبر overflow
    let leader = els[0];
    let bestOver = leader.scrollWidth - leader.clientWidth;
    for (const el of els) {
      const over = el.scrollWidth - el.clientWidth;
      if (over > bestOver) {
        bestOver = over;
        leader = el;
      }
    }

    const max = Math.max(0, leader.scrollWidth - leader.clientWidth);
    const overflow = max > 0;

    if (!overflow) {
      setState({ thumb: 0, left: 0, overflow: false });
      return;
    }

    const ratio = leader.scrollWidth ? leader.clientWidth / leader.scrollWidth : 1;
    const thumbWidth = Math.max(28, Math.floor(track.clientWidth * ratio));
    const left = Math.floor((track.clientWidth - thumbWidth) * (max === 0 ? 0 : getLogicalLeft(leader) / max));

    setState({ thumb: thumbWidth, left, overflow: true });
  }, [targets]);

  useEffect(() => {
    recalc();

    // pump frames عشان layout يتثبت
    let raf = 0;
    let ticks = 0;
    const pump = () => {
      recalc();
      if (ticks++ < 14) raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);

    const onAnyScroll = () => recalc();
    const ros = [];

    (targets || []).forEach((r) => {
      const el = r?.current;
      if (!el) return;
      el.addEventListener("scroll", onAnyScroll, { passive: true });
      const ro = new ResizeObserver(onAnyScroll);
      ro.observe(el);
      ros.push({ ro, el });
    });

    const tr = trackRef.current;
    const roTrack = new ResizeObserver(recalc);
    tr && roTrack.observe(tr);

    const onResize = () => recalc();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      (targets || []).forEach((r) => r?.current?.removeEventListener("scroll", onAnyScroll));
      ros.forEach(({ ro }) => ro.disconnect());
      roTrack.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [targets, recalc]);

  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const onPointerDown = (e) => {
    if (!state.overflow) return;
    drag.current = { active: true, startX: e.clientX, startLeft: state.left };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    document.body.style.userSelect = "none";
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;

    const raw = drag.current.startLeft + (e.clientX - drag.current.startX);
    const maxLeft = Math.max(0, track.clientWidth - state.thumb);
    const newLeft = Math.max(0, Math.min(raw, maxLeft));
    const ratio = maxLeft === 0 ? 0 : newLeft / maxLeft;

    (targets || []).forEach((r) => {
      const el = r?.current;
      if (!el) return;
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      setLogicalLeft(el, max * ratio);
    });

    setState((s) => ({ ...s, left: newLeft }));
  };

  const onPointerUp = (e) => {
    drag.current.active = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}
    document.body.style.userSelect = "";
  };

  const thumbVisible = state.overflow && state.thumb > 0;

  return (
    <Box
      ref={trackRef}
      sx={{
        mt: 1.5,
        height: 10,
        borderRadius: 999,
        bgcolor: "rgba(199, 201, 204, 0.25)",
        position: "relative",
        width: "100%",
        touchAction: "none",
        ...sx,
      }}
    >
      {thumbVisible && (
        <Box
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          sx={{
            position: "absolute",
            top: 0,
            left: `${state.left}px`,
            width: `${state.thumb}px`,
            height: "100%",
            borderRadius: 999,
            bgcolor: "#aeb7cbff",
            cursor: "grab",
            transition: "left .06s linear",
            "&:active": { cursor: "grabbing" },
          }}
        />
      )}
    </Box>
  );
}

/* -------------------- Mobile Row -------------------- */
function MobileScheduleRow({ item, colors, dir, scrollerRef }) {
  const tagColor =
    item.type === "Meeting"
      ? {
          bg: colors?.badgeInfoBg || "rgba(34, 197, 94, 0.10)",
          text: colors?.badgeInfoText || "#16A34A",
          border: "1px solid rgba(34, 197, 94, 0.35)",
        }
      : {
          bg: colors?.badgePrimaryBg || "rgba(59, 130, 246, 0.10)",
          text: colors?.badgePrimaryText || "#2563EB",
          border: "1px solid rgba(59, 130, 246, 0.35)",
        };

  const muted = colors?.textSecondary || "#6B7280";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "8px",
        bgcolor: "#F4F6FF",
        minHeight: 73,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
        mb: 1,
        minWidth: 0,
      }}
    >
      <HorizontalScroller dir={dir} height={78} itemGap={{ xs: 16, md: 16 }} scrollerRef={scrollerRef}>
        <Typography
          sx={{
            fontSize: 18,
            lineHeight: "24px",
            fontWeight: 500,
            fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: "#020617",
            minWidth:180,
          }}
        >
          {item.title}
        </Typography>

        <Chip
          label={item.type}
          size="small"
          sx={{
            fontSize: 14,
            lineHeight: "24px",
            minWidth:95,
            fontWeight: 500,
            fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            bgcolor: tagColor.bg,
            color: tagColor.text,
            borderRadius: "8px",
            border: tagColor.border,
            height: "30px",
            px: "10px",
            minWidth: "90px",
          }}
        />

<Stack direction="row" alignItems="center" sx={{ gap: "6px", minWidth: 240 }}>
          <AccessTimeIcon sx={{ fontSize: 20, color: muted }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>Time:</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#020617" }}>{item.time}</Typography>
        </Stack>

<Stack direction="row" alignItems="center" sx={{ gap: "6px", minWidth: 230 }}>
          <RoomOutlinedIcon sx={{ fontSize: 20, color: muted }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>Location:</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#020617" }}>{item.location}</Typography>
        </Stack>

<Stack direction="row" alignItems="center" sx={{ gap: "6px", minWidth: 170 }}>
          <GroupOutlinedIcon sx={{ fontSize: 20, color: muted }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>Group:</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#020617" }}>{item.group}</Typography>
        </Stack>
      </HorizontalScroller>
    </Paper>
  );
}

function DesktopScheduleRow({ item, colors }) {
  const tagColor =
    item.type === "Meeting"
      ? {
          bg: colors?.badgeInfoBg || "rgba(34, 197, 94, 0.10)",
          text: colors?.badgeInfoText || "#16A34A",
          border: "1px solid rgba(34, 197, 94, 0.35)",
        }
      : {
          bg: colors?.badgePrimaryBg || "rgba(59, 130, 246, 0.10)",
          text: colors?.badgePrimaryText || "#2563EB",
          border: "1px solid rgba(59, 130, 246, 0.35)",
        };

  const muted = colors?.textSecondary || "#6B7280";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "8px",
        bgcolor: "#F4F6FF",
        minHeight: 73,
        display: "flex",
        gap: "90px",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        px: { xs: "16px", md: "50px" },
        py: { xs: "8px", md: "10px" },
        mb: 1,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: { md: "0 0 35%" },
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            lineHeight: "24px",
            fontWeight: 500,
            fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: "#020617",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.title}
        </Typography>

        <Chip
          label={item.type}
          size="small"
          sx={{
            fontSize: 14,
            lineHeight: "24px",
            fontWeight: 500,
            fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            bgcolor: tagColor.bg,
            color: tagColor.text,
            borderRadius: "8px",
            border: tagColor.border,
            height: "30px",
            px: "10px",
            minWidth: "90px",
          }}
        />
      </Box>

      <Divider sx={{ display: { xs: "block", md: "none" }, width: "100%", my: 0.5 }} />

      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          flex: 1,
          width: "100%",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "flex-start", md: "space-between" },
          alignItems: { xs: "flex-start", md: "center" },
          rowGap: { xs: 0.5, md: 0 },
          columnGap: { xs: "8px", md: 0 },
          mt: { xs: 0.5, md: 0 },
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ gap: "4px", minWidth: { xs: "100%", md: "233px" }, flexShrink: 0 }}>
          <AccessTimeIcon sx={{ fontSize: 24, color: muted }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#475569", fontFamily: "Inter" }}>Time:</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#020617", fontFamily: "Inter", whiteSpace: "nowrap" }}>
            {item.time}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ gap: "4px", minWidth: { xs: "100%", md: "200px" }, flexShrink: 0 }}>
          <RoomOutlinedIcon sx={{ fontSize: 24, color: muted }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#475569", fontFamily: "Inter" }}>Location:</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#020617", fontFamily: "Inter", whiteSpace: "nowrap" }}>
            {item.location}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ gap: "4px", minWidth: { xs: "100%", md: "97px" }, flexShrink: 0 }}>
          <GroupOutlinedIcon sx={{ fontSize: 24, color: muted }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#475569", fontFamily: "Inter" }}>Group:</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#020617", fontFamily: "Inter", whiteSpace: "nowrap" }}>
            {item.group}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function DayBlock({ dayBlock, colors, border, text, dir }) {
  const rowRefs = useMemo(
    () => (dayBlock.items || []).map(() => React.createRef()),
    [dayBlock.items?.length]
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.5,
          py: 0.4,
          mb: 2,
          borderRadius: "8px",
          border: `1px solid ${border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 0.5,
            fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: text,
          }}
        >
          {dayBlock.day}
        </Typography>
      </Box>

      {/* Mobile */}
      <Box sx={{ display: { xs: "block", lg: "none" }, minWidth: 0 }}>
        {(dayBlock.items || []).map((item, idx) => (
          <MobileScheduleRow
            key={`${dayBlock.day}-${idx}`}
            item={item}
            colors={colors}
            dir={dir}
            scrollerRef={rowRefs[idx]}
          />
        ))}

        <MultiScrollTrack targets={rowRefs} sx={{ display: "block" }} />
      </Box>

      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        {(dayBlock.items || []).map((item, idx) => (
          <DesktopScheduleRow key={`${dayBlock.day}-${idx}`} item={item} colors={colors} />
        ))}
      </Box>
    </Box>
  );
}

export default function TAScheduleList({ data }) {
  const { colors } = useThemeContext();
  const { i18n } = useTranslation();
  const isRTL = i18n?.dir?.() === "rtl";

  const text = colors?.text || "#0F172A";
  const border = colors?.border || "#E5E7EB";

  const [schedule, setSchedule] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("ta_schedule");
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse saved schedule", e);
    }
    return data && data.length ? data : scheduleData;
  });

  const [openAddEvent, setOpenAddEvent] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("ta_schedule", JSON.stringify(schedule));
      }
    } catch (e) {
      console.error("Failed to save schedule", e);
    }
  }, [schedule]);

  const handleSaveEvent = (form) => {
    if (!form?.dayOfWeek) {
      setOpenAddEvent(false);
      return;
    }

    const newItem = {
      title: form.title || "New Event",
      type: form.eventType === "lecture" ? "Lecture" : form.eventType === "meeting" ? "Meeting" : "Section",
      location: form.location || "Room 000",
      time: form.startTime && form.endTime ? `From ${form.startTime} to ${form.endTime}` : "Time not set",
      group: form.group || "",
    };

    setSchedule((prev) => {
      const idx = prev.findIndex((d) => d.day === form.dayOfWeek);
      if (idx === -1) return [...prev, { day: form.dayOfWeek, items: [newItem] }];

      const copy = [...prev];
      copy[idx] = { ...copy[idx], items: [...copy[idx].items, newItem] };
      return copy;
    });

    setOpenAddEvent(false);
  };

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        mt: 3,
        mb: 3,
        overflowX: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${border}`,
          bgcolor: colors?.box || "#FFFFFF",
          px: { xs: 1.75, md: 2.5 },
          py: { xs: 1.5, md: 2 },
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${border}`,
            }}
          >
            <Calendar sx={{ fontSize: 20, color: text }} />
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 500,
                fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                color: text,
              }}
            >
              Weekly Schedule
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setOpenAddEvent(true)}
            sx={{
              minWidth: "60px",
              height: "60px",
              borderRadius: "12px",
              p: 0,
              boxShadow: "0 10px 15px -3px rgba(37,99,235,0.25)",
              bgcolor: "#3778B5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AddIcon sx={{ fontSize: 22, color: "#FFFFFF" }} />
          </Button>
        </Box>

        {/* Days */}
        {schedule.map((dayBlock, dayIndex) => (
          <React.Fragment key={dayBlock.day}>
            <DayBlock dayBlock={dayBlock} colors={colors} border={border} text={text} dir={isRTL ? "rtl" : "ltr"} />
            {dayIndex !== schedule.length - 1 && <Divider sx={{ mb: 4, mt: 1 }} />}
          </React.Fragment>
        ))}
      </Paper>

      <AddEventDialog open={openAddEvent} onClose={() => setOpenAddEvent(false)} onSave={handleSaveEvent} />
    </Box>
  );
}
