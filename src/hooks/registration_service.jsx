
import api from "../services/api";

const REGISTRATION_ENDPOINT = "/Registration";

export async function submitRegistration(payload) {
  const { data } = await api.post(REGISTRATION_ENDPOINT, payload);
  return data;
}

export async function removeRegistrationByOfferingId(courseOfferingId) {
  const id = String(courseOfferingId ?? "").trim();
  if (!id) throw new Error("courseOfferingId is required");

  const { data } = await api.delete(`${REGISTRATION_ENDPOINT}/${encodeURIComponent(id)}`);
  return data;
}


export async function removeRegistrationByOfferingId_Query(courseOfferingId) {
  const id = String(courseOfferingId ?? "").trim();
  if (!id) throw new Error("courseOfferingId is required");

  const { data } = await api.delete(`${REGISTRATION_ENDPOINT}/courseOfferingId`, {
    params: { courseOfferingId: id },
  });
  return data;
}


export async function removeRegistrationSmart(courseOfferingId) {
  try {
    return await removeRegistrationByOfferingId(courseOfferingId);
  } catch (e) {
    const status = e?.response?.status;
    if (status === 404 || status === 405) {
      return await removeRegistrationByOfferingId_Query(courseOfferingId);
    }
    throw e;
  }
}