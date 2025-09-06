import type { User, UserStats } from '../../../types/api';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    wallet_address?: string;
    ens_name?: string;
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export class UserService {
    static async updateProfile(data: UpdateProfileData): Promise<User> {
        return apiClient.put<User>(API_ENDPOINTS.USER.PROFILE, data);
    }

    static async changePassword(data: ChangePasswordData): Promise<void> {
        return apiClient.post<void>(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
    }

    static async getUserStats(): Promise<UserStats> {
        return apiClient.get<UserStats>(API_ENDPOINTS.USER.STATS);
    }
}
