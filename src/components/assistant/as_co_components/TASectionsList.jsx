// TASectionsList Component
// This file contains:
// - A reusable HorizontalScroller for smooth horizontal scrolling with drag & wheel support
// - A MultiScrollTrack for a unified custom scrollbar that syncs multiple scrollers (meta + rows)
// - SectionRow: a single section row representation
// - CourseCard: a grouped card wrapping sections of a single course
// - TASectionsList: main exported component rendering list of courses and their sections

// src/components/assistant/as_co_components/TASectionsList.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  IconButton,
  Divider,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonOutline from "@mui/icons-material/PersonOutline";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import RoomOutlined from "@mui/icons-material/RoomOutlined";
import { BookOpen } from "lucide-react";

import { useThemeContext } from "../../../services/theme_context.jsx";
import { getSectionsData, getCourseSections } from "../../../services/assistant/sectionsStorage.js";
import i18n from "../../../i18n";

/* -------------------- Column width constants -------------------- */
// Predefined widths for section metadata columns, used in MetaItem
const COLS = {
  day: 74,
  time: 161,
  room: 92,
  students: 98,
  instructor: 179,
};

/* -------------------- HorizontalScroller (drag + wheel support) -------------------- */
// A generic horizontally scrollable container with:
// - Mouse drag scrolling
// - Touch drag scrolling
// - Wheel-based scrolling (x or y) converted into horizontal scroll
// - Optional edge fade effect and scroll snapping
function HorizontalScroller({
  children,
  itemGap = { xs: 16, md: 28 },
  snap = "proximity",
  height = 32,
  edgeFade = true,
  dir = "ltr",
  sx,
  scrollerRef,
}) {
  const innerRef = useRef(null);
  const ref = scrollerRef ?? innerRef;

  // State for manual drag scroll
  const drag = useRef({ active: false, x: 0, left: 0 });

  // Start drag
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

  // Handle mouse/touch movement during drag
  const onMove = (e) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    el.scrollLeft = drag.current.left + (drag.current.x - x);
  };

  // End drag
  const onUp = () => {
    const el = ref.current;
    drag.current.active = false;
    if (el) {
      el.style.cursor = "";
      el.dataset.dragging = "";
    }
  };

  // Convert wheel vertical scroll into horizontal, if needed
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
        display: "flex",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
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
          px: 3,
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
          // Make scroller take full width
          width: "100%",

          // Scroll snap behavior
          scrollSnapType: `x ${snap}`,
          "&[data-dragging='1']": { scrollSnapType: "none" },
          "& > *": {
            scrollSnapAlign: "start",
            minWidth: "max-content",
            flexShrink: 0,
          },

          // Flexible filler at the end to avoid weird right gap on larger screens
          "&::after": {
            content: '""',
            flex: "1 1 auto",
            minWidth: 0,
          },

          // Hide scrollbar visually
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },

          overscrollBehaviorX: "contain",
          willChange: "scroll-position",

          ...(edgeFade && {
            // Edge fade masking could be enabled here; currently disabled on all sizes
            maskImage: { xs: "none", md: "none" },
            WebkitMaskImage: { xs: "none", md: "none" },
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* -------------------- MultiScrollTrack (shared scrollbar + RTL-aware) -------------------- */
// A custom track that acts like a synchronized scrollbar for multiple scrollable targets.
// It:
// - Finds the element with the maximum overflow to drive thumb size
// - Listens to scroll & resize events on all targets
// - Allows dragging the thumb to scroll all targets in sync
function MultiScrollTrack({ targets, sx }) {
  const trackRef = React.useRef(null);
  const [state, setState] = React.useState({ thumb: 0, left: 0, overflow: false });

  // Helpers for handling logical scrollLeft in LTR / RTL
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

  // Recalculate thumb size and position based on the "leader" scroller (max overflow)
  const recalc = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const els = (targets || []).map((r) => r?.current).filter(Boolean);

    if (!els.length || track.clientWidth === 0) {
      setState({ thumb: 0, left: 0, overflow: false });
      return;
    }

    // Pick the element with the greatest horizontal overflow
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

    const ratio = leader.clientWidth / leader.scrollWidth;
    const thumbWidth = Math.max(28, Math.floor(track.clientWidth * ratio));
    const left = Math.floor((track.clientWidth - thumbWidth) * (getLogicalLeft(leader) / max));
    setState({ thumb: thumbWidth, left, overflow: true });
  }, [targets]);

  // Subscribe to scroll and resize events to keep thumb in sync
  React.useEffect(() => {
    recalc();

    // Extra recalc frames after mount to handle late layout changes
    let raf = 0, ticks = 0;
    const pump = () => { recalc(); if (ticks++ < 18) raf = requestAnimationFrame(pump); };
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

  // Drag state for the thumb itself
  const drag = React.useRef({ active: false, startX: 0, startLeft: 0 });

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

    const { startX, startLeft } = drag.current;
    const raw = startLeft + (e.clientX - startX);
    const maxLeft = Math.max(0, track.clientWidth - state.thumb);
    const newLeft = Math.max(0, Math.min(raw, maxLeft));

    const ratio = maxLeft === 0 ? 0 : newLeft / maxLeft;

    // Scroll all targets proportionally
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
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
    document.body.style.userSelect = "";
  };

  const thumbVisible = state.overflow && state.thumb > 0;

  return (
    <Box
      ref={trackRef}
      sx={{
        mt: 3,
        height: 10,
        borderRadius: 999,
        bgcolor: "rgba(199, 201, 204, 0.25)",
        position: "relative",
        width: "100%",
        touchAction: "none",
        flex: "0 0 auto",
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

/* -------------------- ToggleIconButton (chevron button style) -------------------- */
// A small styled IconButton used to open/close the course Collapse.
function ToggleIconButton({ colors, sx, ...rest }) {
  return (
    <IconButton
      size="small"
      {...rest}
      sx={{
        width: 65,
        height: 45,
        borderRadius: 1,
        bgcolor: "transparent",
        color: colors?.text,
        "&:hover": {
          bgcolor: colors?.mode === "dark" ? "rgba(255,255,255,.06)" : "rgba(2,6,23,.04)",
        },
        flexShrink: 0,
        ...sx,
      }}
    />
  );
}

/* -------------------- MetaItem (icon + text pair) -------------------- */
// Generic row item with an icon on the left and text on the right.
// Used for day, time, room, students, instructor, etc.
function MetaItem({ icon, children, colors, width }) {
  return (
    <Stack
      direction="row"
      spacing={"5px"}
      alignItems="center"
      sx={{
        minWidth: width || "max-content",
        flex: `1 0 ${width || "max-content"}`,
        maxWidth: "100%",
      }}
    >
      {icon}
      <Typography sx={{ fontSize: "14px", color: colors.text, fontWeight: 400 }}>
        {children}
      </Typography>
    </Stack>
  );
}

/* -------------------- SectionRow: single section line -------------------- */
// Represents a single section row with:
// - Section code chip
// - Day, time, room, students count, instructor
// All inside a HorizontalScroller for narrow screens.
function SectionRow({ sec, colors, dir, scrollerRef }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: { xs: 1.25, sm: 1.5 },
        py: 1.2,
        borderRadius: 2,
        bgcolor: colors?.mode === "dark" ? "transparent" : "#F7FAFE",
        borderColor: colors.border,
        minWidth: 0,
      }}
    >
      <Box sx={{ minWidth: 0, width: "100%" }}>
        <HorizontalScroller dir={dir} height={50} itemGap={{ xs: 14, md: 10 }} scrollerRef={scrollerRef}>
          {/* Section code chip */}
          <Chip
            label={sec.code}
            size="small"
            sx={{
              borderRadius: 2,
              width: 51,
              height: 50,
              fontWeight: 400,
              fontSize: "16px",
              bgcolor: colors.cod,
              flexShrink: 0,
            }}
          />

          {/* Section day */}
          <MetaItem
            colors={colors}
            width={`${COLS.day}px`}
            icon={<CalendarMonthOutlined sx={{ fontSize: 16, color: colors.secondary }} />}
          >
            {sec.day}
          </MetaItem>

          {/* Section time */}
          <MetaItem
            colors={colors}
            width={`${COLS.time}px`}
            icon={<AccessTimeOutlined sx={{ fontSize: 16, color: colors.secondary }} />}
          >
            {sec.time}
          </MetaItem>

          {/* Room */}
          <MetaItem
            colors={colors}
            width={`${COLS.room}px`}
            icon={<RoomOutlined sx={{ fontSize: 16, color: colors.secondary }} />}
          >
            {sec.room}
          </MetaItem>

          {/* Students count */}
          <MetaItem
            colors={colors}
            width={`${COLS.students}px`}
            icon={<PeopleAltOutlined sx={{ fontSize: 16, color: colors.secondary }} />}
          >
            {sec.students} Student
          </MetaItem>

          {/* Section instructor */}
          <MetaItem
            colors={colors}
            width={`${COLS.instructor}px`}
            icon={<PersonOutline sx={{ fontSize: 16, color: colors.secondary }} />}
          >
            {sec.instructor}
          </MetaItem>
        </HorizontalScroller>
      </Box>
    </Paper>
  );
}

/* -------------------- CourseCard: wraps sections of a single course -------------------- */
// Shows:
// - Course header (icon, title, chips)
// - Collapsible body with meta scroller + section rows
// - A unified MultiScrollTrack that controls both the meta bar and all section rows
function CourseCard({ course, colors, isRTL }) {
  const [open, setOpen] = useState(true);
  const dir = isRTL ? "rtl" : "ltr";

  // Render joined list of section codes for the meta line (e.g., "S01 - S02 - S03")
  const codesLine = course.sections.map((s) => s.code).join(" - ");

  // Refs for meta scroller and each section row scroller
  const metaRef = useRef(null);
  const rowRefs = useMemo(() => course.sections.map(() => React.createRef()), [course.sections.length]);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: "8px",
        borderColor: colors.border,
        bgcolor: colors.box,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ px: { xs: 1.75, md: "30px" }, py: { xs: 1.5, md: 2.75 }, position: "relative" }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{ rowGap: 1, columnGap: 1, minWidth: 0  }}
        >
          {/* Left side: book icon + course title + chips */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            flexWrap="wrap"
            sx={{ flex: { xs: "1 1 100%", md: "1 1 auto" }, rowGap: 1, columnGap: 1, minWidth: 0 }}
          >
            {/* Course icon box */}
            <Box
              sx={{
                width: "75px",
                height: "45px",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: colors?.mode === "dark" ? "transparent" : "#EFF6FF",
                color: "#2563EB",
                border: `1px solid ${colors.border}`,
                flexShrink: 0,
              }}
              aria-hidden
            >
              <BookOpen size={18} strokeWidth={1.67} />
            </Box>

            {/* Course title */}
            <Typography
              sx={{
                fontSize: { xs: 16, md: 22 },
                fontWeight: 500,
                color: colors.text,
                minWidth: 0,
                fontFamily: "Inter, sans-serif",
                flexShrink: 1,
              }}
            >
              {course.title}
            </Typography>

            {/* Course code + "Sections" chips */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "nowrap",
                minWidth: "max-content",
                flexBasis: { xs: "100%", md: "auto" },
                order: { xs: 2, md: 2 },
              }}
            >
              <Chip
                label={course.code}
                size="small"
                sx={{
                  px: "10px",
                  borderRadius: "8px",
                  height: "35px",
                  bgcolor: colors.chosen,
                  width: 90,
                  flexShrink: 0,
                }}
              />
              <Chip
                label="Sections"
                size="small"
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  height: "35px",
                  color: "#1F609D",
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.talab,
                  width: 90,
                  "& .MuiChip-icon": { mr: 0.5 },
                  flexShrink: 0,
                }}
              />
            </Box>
          </Stack>

          {/* Collapse toggle button, absolutely anchored to the right */}
          <ToggleIconButton
            colors={colors}
            onClick={() => setOpen((p) => !p)}
            sx={{
              position: "absolute",
              right: 14,              // Always pinned to right
              top: "25%",             // Vertically centered-ish
              transform: `translateY(-20%) ${open ? "rotate(180deg)" : "none"}`,
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 30 }} />
          </ToggleIconButton>
        </Stack>
      </Box>

      {/* Body: collapsible content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider sx={{ mx: 3, borderColor: colors.border }} />

        {/* Meta line (top horizontal scroller) */}
        <Box sx={{ px: { xs: 1.5, md: 3 }, pt: 1, pb: 0.6 }}>
          <HorizontalScroller
            dir={dir}
            height={30}
            itemGap={{ xs: 12, md: 22 }}
            scrollerRef={metaRef}
          >
            {/* Section codes inline */}
            <MetaItem colors={colors}>{codesLine}</MetaItem>

            {/* Max capacity item */}
            <MetaItem
              colors={colors}
              width="130px"
              icon={<PeopleAltOutlined sx={{ fontSize: 20, color: colors.secondary }} />}
            >
              <Box component="span" sx={{ color: colors.secondary, fontSize: 16, fontWeight: 400, marginRight: "8px" }}>
                Max Capacity
              </Box>
              &nbsp;
              {course.maxCapacity} Student
            </MetaItem>

            {/* Course instructor name */}
            <MetaItem
              colors={colors}
              icon={<PersonOutline sx={{ fontSize: 20, color: colors.secondary }} />}
            >
              <Box component="span" sx={{ color: colors.secondary, fontSize: 16, fontWeight: 400, marginRight: "8px" }}>
                Instructor
              </Box>
              &nbsp;
              {course.instructor}
            </MetaItem>
          </HorizontalScroller>
        </Box>

        {/* Sections list */}
        <Box sx={{ px: { xs: 1.75, md: 2.25 }, pt: 0.75, mx: 3 }}>
          <Stack spacing={1.1} sx={{ minWidth: 0 }}>
            {course.sections.map((sec, idx) => (
              <SectionRow key={sec.code} sec={sec} colors={colors} dir={dir} scrollerRef={rowRefs[idx]} />
            ))}
          </Stack>
        </Box>

        {/* Unified bottom scroll track for meta + rows (visible mainly on smaller screens) */}
        <Box sx={{ px: { xs: 1.75, md: 2.25 }, pb: 2, mx: 3 }}>
          <MultiScrollTrack
            targets={[metaRef, ...rowRefs]}
            sx={{ display: { xs: "block", xl: "none" } }}
          />
        </Box>
      </Collapse>
    </Paper>
  );
}


export default function TASectionsList({ data }) {
  const { colors } = useThemeContext();
  const isRTL = i18n.dir() === "rtl";
  const [refreshKey, setRefreshKey] = useState(0);

  // Default courses data
  const defaultCourses = [
    {
      id: "cs101",
      title: "Introduction To Computer",
      code: "cs101",
      maxCapacity: 40,
      instructor: "Dr. Khalid Al-Mansour",
      sections: [
        { code: "S04", day: "Sunday", time: "MWF 9:00–10:00 AM", room: "Room 305", students: 35, instructor: "Eng/ Ahmed Mohamed" },
        { code: "S05", day: "Sunday", time: "MWF 11:00–12:00 AM", room: "Room 302", students: 29, instructor: "Eng/ Ahmed Mohamed" },
        { code: "S06", day: "Monday", time: "MWF 9:00–10:00 AM", room: "CS Building 101", students: 40, instructor: "Eng/ Ahmed Mohamed" },
      ],
    },
    {
      id: "cs112",
      title: "Programming Language",
      code: "cs112",
      maxCapacity: 40,
      instructor: "Dr. Yasser Abdelhamed",
      sections: [
        { code: "S01", day: "Sunday", time: "MWF 9:00–10:00 AM", room: "Room 305", students: 35, instructor: "Eng/ Ahmed Mohamed" },
        { code: "S02", day: "Sunday", time: "MWF 11:00–12:00 AM", room: "Room 302", students: 29, instructor: "Eng/ Ahmed Mohamed" },
        { code: "S03", day: "Monday", time: "MWF 9:00–10:00 AM", room: "CS Building 101", students: 40, instructor: "Eng/ Ahmed Mohamed" },
      ],
    },
  ];

  // Listen for sections updates
  useEffect(() => {
    const handleSectionsUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("sectionsUpdated", handleSectionsUpdate);
    return () => {
      window.removeEventListener("sectionsUpdated", handleSectionsUpdate);
    };
  }, []);

  // Memoize courses and merge with stored sections
  const courses = useMemo(() => {
    const baseCourses = data ?? defaultCourses;
    const storedSections = getSectionsData();

    return baseCourses.map((course) => {
      // استخدام course code كـ identifier (lowercase للتطابق)
      const courseId = (course.code || course.id)?.toLowerCase();
      const storedSectionsForCourse = getCourseSections(courseId);
      
      // Merge default sections with stored sections
      // تجنب التكرار بناءً على section code
      const existingCodes = new Set((course.sections || []).map(s => s.code));
      const newStoredSections = storedSectionsForCourse.filter(s => !existingCodes.has(s.code));
      
      const allSections = [
        ...(course.sections || []),
        ...newStoredSections,
      ];

      return {
        ...course,
        sections: allSections,
      };
    });
  }, [data, refreshKey]);

  return (
    <Stack spacing={3} sx={{ mt: 2 }} dir={isRTL ? "rtl" : "ltr"}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} colors={colors} isRTL={isRTL} />
      ))}
    </Stack>
  );
}