// Base API URL
export const API_BASE_URL = 'http://localhost:5000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/users/login`,
    SIGNUP: `${API_BASE_URL}/users/signup`,
} as const;

// Type for API Response
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}