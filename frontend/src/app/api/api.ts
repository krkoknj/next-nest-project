import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";

import { ServiceKey, SERVICE_URLS } from "./service";

export const createApi = (logoutFn: () => void, service: ServiceKey = "API") => {
    const instance: AxiosInstance = axios.create({
        baseURL: SERVICE_URLS[service],
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (
        error: AxiosError | null,
        token: string | null = null
    ) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError): Promise<AxiosError | AxiosResponse> => {
            const originalRequest = error.config as AxiosRequestConfig & {
                _retry?: boolean;
            };

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            return instance(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
                isRefreshing = true;

                try {
                    console.log("토큰 재발급 요청");
                    const response = await instance.post("/auth/rotate", {});
                    if (response.status === 201) {
                        isRefreshing = false;
                        processQueue(null);
                        console.log("토큰 재발급 성공");
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    isRefreshing = false;
                    processQueue(refreshError as AxiosError);
                    console.log("토큰 재발급 실패");
                    await instance.post("/auth/logout", {});
                    logoutFn();
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return {
        get: <T = any>(
            url: string,
            config: AxiosRequestConfig = {}
        ): Promise<AxiosResponse<T>> => instance.get<T>(url, config),
        post: <T = any>(
            url: string,
            data?: any,
            config: AxiosRequestConfig = {}
        ): Promise<AxiosResponse<T>> => instance.post<T>(url, data, config),
        put: <T = any>(
            url: string,
            data?: any,
            config: AxiosRequestConfig = {}
        ): Promise<AxiosResponse<T>> => instance.put<T>(url, data, config),
        delete: <T = any>(
            url: string,
            config: AxiosRequestConfig = {}
        ): Promise<AxiosResponse<T>> => instance.delete<T>(url, config),
    };
};