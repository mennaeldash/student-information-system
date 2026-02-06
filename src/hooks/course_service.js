// src/hooks/course_service.js
import api from "../services/api";

function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.data,
    payload?.result,
    payload?.items,
    payload?.courses,
    payload?.offers,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
}

// ✅ short UI id (first part of UUID) OR fallback
function shortIdFromOffer(offer, c) {
  const raw = String(offer?.id ?? "");
  if (raw) return raw.split("-")[0]; // مثال: f2fe9773 بدل UUID كامل
  const code = c?.code ?? "X";
  const section = offer?.section ?? "S";
  return `${code}-${section}`;
}

export async function fetchCourses() {
  try {
    const { data } = await api.get("/students_conntroller/course");

    const list = pickArray(data);

    return list.map((offer) => {
      const c = offer?.course || {};
      const prereqs = Array.isArray(c?.prerequisites) ? c.prerequisites : [];

      const currentEnrollment = Number(offer?.currentEnrollment ?? 0);
      const maxCapacity = Number(offer?.maxCapacity ?? 0);
      const isFull = maxCapacity > 0 && currentEnrollment >= maxCapacity;

      const status = offer?.isAvailable ? (isFull ? "full" : "available") : "full";

      const days = offer?.schedule?.days_string ?? "";
      const time = offer?.schedule?.formatted_time ?? "";
      const schedule = `${days}${days && time ? " • " : ""}${time}`.trim();

      return {
        // ✅ UI key short (لازم في الكروت / الداتا جريد)
        id: shortIdFromOffer(offer, c),

        // ✅ Full UUID (استخدمه في ال API calls)
        courseOfferingId: String(offer?.id ?? ""),
        courseNumericId: c?.id ?? null,

        code: c?.code ?? "",
        name: c?.name ?? "",
        credits: c?.creditHours ?? 0,

        level: c?.level ?? null,
        semester: c?.semester ?? null,

        instructor: offer?.instructorId ?? "",
        enrolled: currentEnrollment,
        capacity: maxCapacity,

        schedule,

        prerequisites: prereqs.map(
          (p) => p?.prerequisiteCourseName || p?.prerequisiteCourseId || "N/A"
        ),

        type: (c?.code ?? "").toLowerCase().startsWith("hu") ? "elective" : "required",

        status,
      };
    });
  } catch (error) {
    console.error("Error fetching courses:", error?.response?.data || error);
    return [];
  }
}
