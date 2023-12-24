import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtTokensResponse, useJwt } from '@/lib/jwt';

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(
  async (config) => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    if (!access_token && refresh_token) {
      try {
        const response = await axios.post<JwtTokensResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refresh_token}`,
            },
          }
        );

        const { accessToken, refreshToken } = response.data;
        useJwt().setTokens(accessToken, refreshToken);

        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }

    if (access_token) {
      const decodedToken = jwt.decode(access_token) as JwtPayload;
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp && currentTime > decodedToken.exp) {
        try {
          const response = await axios.post<JwtTokensResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refresh_token}`,
              },
            }
          );

          const { accessToken, refreshToken } = response.data;
          useJwt().setTokens(accessToken, refreshToken);

          config.headers['Authorization'] = `Bearer ${accessToken}`;
          return config;
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
