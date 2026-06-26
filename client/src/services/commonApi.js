import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  // If request body is FormData, leave content-type empty so Axios handles boundary automatically.
  const defaultHeaders = (reqBody instanceof FormData) ? {} : { "Content-Type": "application/json" };

  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : defaultHeaders
  };
  
  try {
    const result = await axios(reqConfig);
    return result;
  } catch (err) {
    return err;
  }
};
