export type ServiceKey = "API" | "AUTH" | "BOARD";

export const SERVICE_URLS: Record<ServiceKey, string> = {
    API: process.env.NEXT_PUBLIC_API_URL!,    // user service
    AUTH: process.env.NEXT_PUBLIC_AUTH_URL!,   // auth service
    BOARD: process.env.NEXT_PUBLIC_BOARD_URL!,  // board service
};