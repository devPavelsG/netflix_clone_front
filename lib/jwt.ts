import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

type UseJwtType = {
  setTokens: Function;
  decodeJWT: (token?: string) => Token | null;
  removeTokens: Function;
  decodedToken: Token | undefined | null;
};

export type JwtTokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export type Token = {
  role: string;
  fullname: string;
  sub: string;
  iat: number;
  exp: number;
};

export function useJwt(): UseJwtType {
  const setTokens = (accessToken: string, refreshToken: string) => {
    // Set access token
    const accessTokenDecoded = decodeJWT(accessToken);
    if (accessTokenDecoded && accessTokenDecoded.exp) {
      const expirationDate = new Date(accessTokenDecoded.exp * 1000);
      Cookies.set('access_token', accessToken, { expires: expirationDate });
    }

    // Set refresh token
    const refreshTokenDecoded = decodeJWT(refreshToken);
    if (refreshTokenDecoded && refreshTokenDecoded.exp) {
      const expirationDate = new Date(refreshTokenDecoded.exp * 1000);
      Cookies.set('refresh_token', refreshToken, { expires: expirationDate });
    }
  };

  const decodeJWT = (token?: string): Token | null => {
    if (!token) return null;
    return jwt.decode(token) as Token;
  };

  const decodedToken = () => {
    const token = Cookies.get('access_token');
    try {
      if (!token) return;
      return jwt.decode(token) as Token;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const removeTokens = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  };

  return { setTokens, decodeJWT, decodedToken: decodedToken(), removeTokens };
}
