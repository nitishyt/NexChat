import axios from "axios";
import { useAuthStore } from "../src/store/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // required so the httpOnly refresh cookie reaches /auth/refresh
});

axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Dedupe concurrent refreshes if multiple requests 401 at once.
let refreshPromise = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

        if (status === 401 && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = axiosInstance
                        .post("/auth/refresh")
                        .then((res) => {
                            useAuthStore.getState().setAccessToken(res.data.accessToken);
                            return res.data.accessToken;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                const newToken = await refreshPromise;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAccessToken();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);