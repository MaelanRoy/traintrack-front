import { type JwtPayload, jwtDecode } from "jwt-decode";

interface MyJwtPayload extends JwtPayload {
  profile: string;
}

export const decodeJwt = (token: string): MyJwtPayload => {
  const decoded = jwtDecode<MyJwtPayload>(token);
  return decoded;
};

/**
 * Checks if the user is authenticated.
 *
 * @returns {boolean} true if the user is authenticated, otherwise false.
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null;
};

/**
 * Checks if the profile associated with the current JWT token is that of an administrator.
 *
 * @returns {boolean} true if the profile is "Administrator", otherwise false.
 */
export const isAdministratorProfile = (): boolean => {
  const decodedJwt = decodeJwt(localStorage.getItem("token")!);
  return decodedJwt.profile === "ADMINISTRATOR";
};

/**
 * Checks if the profile associated with the current JWT token is that of an normal user.
 *
 * @returns {boolean} true if the profile is "Normal", otherwise false.
 */
export const isNormalProfil = (): boolean => {
  const decodedJwt = decodeJwt(localStorage.getItem("token")!);
  return decodedJwt.profile === "NORMAL";
};
