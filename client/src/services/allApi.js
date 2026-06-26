import { commonAPI } from "./commonApi";
import { SERVER_URL } from "./serverUrl";

// careers
export const applyJobAPI = async (formData) => {
  return await commonAPI("POST", `${SERVER_URL}/api/career/apply`, formData, {});
};

export const submitTalentAPI = async (formData) => {
  return await commonAPI("POST", `${SERVER_URL}/api/talent/submit`, formData, {});
};

