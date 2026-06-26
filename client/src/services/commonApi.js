


// by namitha


import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {

  const defaultHeaders = (reqBody instanceof FormData) ? {} : { "Content-Type": "application/json" };

  const reqConfig = {
    method: httpRequest,
    url,
   
    data: reqBody ? reqBody : undefined,
    
    headers: reqHeader ? reqHeader : (reqBody ? defaultHeaders : {})
  };
  
  try {
    const result = await axios(reqConfig);
    return result;
  } catch (err) {
    return err;
  }
};
