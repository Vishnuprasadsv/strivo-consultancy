import { commonAPI } from "./commonApi";
import { SERVER_URL } from "./serverUrl";

/**
 * Submit a client review
 * @param {object} reqBody - The review details { fullName, company, rating, title, review }
 * @returns {Promise<any>}
 */
export const submitReviewAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/api/reviews`, reqBody, "");
};

/**
 * Fetch all approved client reviews (public display)
 * @returns {Promise<any>}
 */
export const getApprovedReviewsAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/api/reviews`, "", "");
};

/**
 * Submit a job application (with resume upload)
 * @param {FormData} formData - FormData containing fullName, email, mobile, appliedPosition, roleDescription, resume
 * @returns {Promise<any>}
 */
export const applyJobAPI = async (formData) => {
  return await commonAPI(
    "POST",
    `${SERVER_URL}/api/career/apply`,
    formData,
    { "Content-Type": "multipart/form-data" }
  );
};

/**
 * Submit to talent network (with resume upload)
 * @param {FormData} formData - FormData containing fullName, email, mobile, category, resume
 * @returns {Promise<any>}
 */
export const submitTalentAPI = async (formData) => {
  return await commonAPI(
    "POST",
    `${SERVER_URL}/api/talent/submit`,
    formData,
    { "Content-Type": "multipart/form-data" }
  );
};

/**
 * Fetch all job applications (admin dashboard use)
 * @returns {Promise<any>}
 */
export const getAllApplicantsAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/api/career/applications`, "", "");
};

/**
 * Refer a candidate to HR
 * @param {string} id - The applicant's database ID
 * @returns {Promise<any>}
 */
export const referApplicantAPI = async (id) => {
  return await commonAPI(
    "POST",
    `${SERVER_URL}/api/career/applications/${id}/refer`,
    {},
    ""
  );
};

/**
 * Delete a job application (Not Eligible)
 * @param {string} id - The applicant's database ID
 * @returns {Promise<any>}
 */
export const deleteApplicantAPI = async (id) => {
  return await commonAPI(
    "DELETE",
    `${SERVER_URL}/api/career/applications/${id}`,
    {},
    ""
  );
};
