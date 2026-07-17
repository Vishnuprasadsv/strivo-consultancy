/**
 * Read the admin token cookie written by the login API.
 * Uses a safe lookup pattern.
 */
export const getCookieToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

/**
 * Remove the admin token cookie by setting its expiry in the past.
 */
export const deleteCookieToken = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
};
