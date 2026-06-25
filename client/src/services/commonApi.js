import axios from "axios";

/**
 * Reusable Axios wrapper for API requests.
 * @param {string} httpMethod - HTTP Verb (GET, POST, PUT, DELETE, PATCH)
 * @param {string} url - Target Endpoint URL
 * @param {any} reqBody - Request payload (body data)
 * @param {object} [reqHeader] - Optional request headers
 * @returns {Promise<any>} Axios promise resolving to response or catching error
 */
export const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" },
  };

  return await axios(reqConfig)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};
