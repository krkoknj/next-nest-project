import { useAuthStore } from "../store/auth";
import { createApi } from "./api";
import { ServiceKey } from "./service";

export const useApi = (service: ServiceKey = "API") => {
    const logout = useAuthStore((state: any) => state.logout);
    return createApi(logout, service);
};