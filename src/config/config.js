/**
 * Global configuration for the application
 */

// Base URL for API requests
export const BASE_URL = 'http://localhost:3000';

// Default avatar image
export const DEFAULT_AVATAR = '/assets/images/avatar_default.jpg';

// File size limits
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB

// Supported file types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']; 