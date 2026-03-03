
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

function shortIdFromOffer(offer, c) {
  const raw = String(offer?.id ?? "");
  if (raw) return raw.split("-")[0];
  const code = c?.code ?? "X";
  const section = offer?.section ?? "S";
  return `${code}-${section}`;
}

function mapOfferToCourse(offer) {
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
    id: shortIdFromOffer(offer, c),

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
}


export async function fetchCourses() {
  try {
    const { data } = await api.get("/students_conntroller/course");
    const list = pickArray(data);
    return list.map(mapOfferToCourse);
  } catch (error) {
    console.error("Error fetching courses:", error?.response?.data || error);
    return [];
  }
}


export async function fetchCoursesWithMeta() {
  try {
    const { data } = await api.get("/students_conntroller/course");

    const list = pickArray(data);
    const courses = list.map(mapOfferToCourse);

    let academicTermId =
      data?.academicTermId ??
      data?.term ??
      data?.termId ??
      data?.academicTerm?.id ??
      data?.meta?.academicTermId ??
      data?.meta?.termId ??
      null;

    if (!academicTermId && Array.isArray(list) && list.length > 0) {
      const first = list[0];
      academicTermId =
        first?.academicTermId ?? first?.term ?? first?.termId ?? first?.academicTerm ?? null;
      if (academicTermId && typeof academicTermId === "object") {
        academicTermId = academicTermId?.id ?? academicTermId?.code ?? null;
      }
    }

    academicTermId = academicTermId != null ? String(academicTermId) : null;

    return { courses, academicTermId };
  } catch (error) {
    console.error("Error fetching courses with meta:", error?.response?.data || error);
    return { courses: [], academicTermId: null };
  }
}