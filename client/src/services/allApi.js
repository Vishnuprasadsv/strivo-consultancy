// by namitha





import { commonAPI } from "./commonApi";
import { SERVER_URL } from "./serverUrl";
//  ente api calls by namitha
// careers
export const applyJobAPI = async (formData) => {
  return await commonAPI("POST", `${SERVER_URL}/api/career/apply`, formData, {});
};

export const submitTalentAPI = async (formData) => {
  return await commonAPI("POST", `${SERVER_URL}/api/talent/submit`, formData, {});
};

export const getJobsAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/api/career/jobs`, "", "");
};


// admin
export const getAdminStatsAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/api/career/stats`, "", "");
};

export const getAdminApplicationsAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/api/career/applications`, "", "");
};

export const updateApplicationStatusAPI = async (id, status) => {
  return await commonAPI("PUT", `${SERVER_URL}/api/career/applications/${id}/status`, { status }, "");
};

export const referApplicationAPI = async (id) => {
  return await commonAPI("PUT", `${SERVER_URL}/api/career/applications/${id}/refer`, {}, "");
};

export const createJobAPI = async (jobData) => {
  return await commonAPI("POST", `${SERVER_URL}/api/career/jobs`, jobData, "");
};

export const updateJobAPI = async (id, jobData) => {
  return await commonAPI("PUT", `${SERVER_URL}/api/career/jobs/${id}`, jobData, "");
};

export const deleteJobAPI = async (id) => {
  return await commonAPI("DELETE", `${SERVER_URL}/api/career/jobs/${id}`, "", "");
};

export const getTalentSubmissionsAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/api/talent/submissions`, "", "");
};
