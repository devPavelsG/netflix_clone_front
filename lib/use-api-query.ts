import { useEffect, useState, useRef, useCallback } from 'react';
import axios, {
  type AxiosResponse,
  AxiosError,
  type AxiosRequestConfig,
} from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiQueryOptions<R> {
  url: string;
  method?: HttpMethod;
  disableOnMount?: boolean;
  initialData?: R;
  headers?: Record<string, string>;
  onSuccess?: (data: R) => void;
  onError?: (error: AxiosError) => void;
}

export function useApiQuery<R>(options: ApiQueryOptions<R>): {
  data: R | null;
  error: AxiosError | null;
  isLoading: boolean;
  sendRequest: (data?: any) => void;
} {
  const {
    url,
    method = 'GET',
    disableOnMount = false,
    initialData = null,
    headers,
    onSuccess,
    onError,
  } = options;
  const [apiData, setApiData] = useState<R | null>(initialData);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState(!disableOnMount);
  const sendRequestCount = useRef<number>(0);

  const sendRequest = useCallback(
    async (requestData?: any) => {
      try {
        setIsLoading(true);
        const response: AxiosResponse<R> = await axios({
          url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
          method,
          data: requestData,
          headers,
        } as AxiosRequestConfig);

        setApiData(response.data);

        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        setError(err as AxiosError);

        if (onError) {
          onError(err as AxiosError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [headers, method, onError, onSuccess, url]
  );

  useEffect(() => {
    if (!isLoading) return;

    if (!disableOnMount || (disableOnMount && sendRequestCount.current > 0)) {
      sendRequest();
    }
  }, [url, method, isLoading, disableOnMount, headers, sendRequest]);

  return { data: apiData, error, isLoading, sendRequest };
}
