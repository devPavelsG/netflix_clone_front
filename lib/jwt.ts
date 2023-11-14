import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

type UseJwtType = {
    setTokens: Function;
    decodeJWT: Function;
}

export type JwtTokensResponse = {
    accessToken: string,
    refreshToken: string,
}

export type Token = {
    role: string;
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
    }


    const decodeJWT = (token?: string) => {
        try {
            if (!token) return;
            return jwt.decode(token) as Token;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };


    return { setTokens, decodeJWT };
}
