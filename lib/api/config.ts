// Configuration pour les appels API
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        NGO_REGISTER: '/auth/ngo/register',
        NGO_LOGIN: '/auth/ngo/login',
        CONTRIBUTOR_REGISTER: '/auth/contributor/register',
        CONTRIBUTOR_LOGIN: '/auth/contributor/login',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },

    // User Management
    USER: {
        PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        STATS: '/user/stats',
    },

    // Missions
    MISSIONS: {
        LIST: '/missions',
        CREATE: '/missions',
        DETAIL: (id: string) => `/missions/${id}`,
        UPDATE: (id: string) => `/missions/${id}`,
        DELETE: (id: string) => `/missions/${id}`,
        ACCEPT: (id: string) => `/missions/${id}/accept`,
        COMPLETE: (id: string) => `/missions/${id}/complete`,
        REWARD: (id: string) => `/missions/${id}/reward`,
        MY_MISSIONS: '/missions/my-missions',
        NGO_MISSIONS: '/missions/ngo-missions',
    },

    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        UNREAD_COUNT: '/notifications/unread-count',
        MARK_ALL_READ: '/notifications/mark-all-read',
    },

    // Upload
    UPLOAD: {
        SINGLE: '/upload',
        MULTIPLE: '/upload',
    },

    // Statistics
    STATS: {
        GLOBAL: '/stats/global',
        MISSIONS_BY_STATUS: '/stats/missions-by-status',
        TOP_CONTRIBUTORS: '/stats/top-contributors',
        TOP_NGOS: '/stats/top-ngos',
    },
} as const;
