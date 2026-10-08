/**
 * Kinetics Hackathon 2026 - Admin Authentication Service
 * Controls access to sensitive features: Telemetry Settings & Live Event Simulator.
 */

const AUTH_STORAGE_KEY = 'kinetics_admin_auth_session';

/**
 * Safely extracts environment variables with fallback support.
 */
const getEnvVar = (keys: string[], fallback: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      for (const key of keys) {
        const val = import.meta.env[key];
        if (typeof val === 'string' && val.trim().length > 0) {
          return val.trim();
        }
      }
    }
  } catch {
    // Non-Vite execution context fallback
  }
  return fallback;
};

export const getAdminCredentials = () => {
  const adminId = getEnvVar(
    ['VITE_ADMIN_ID', 'VITE_ADMIN_USERNAME', 'VITE_ADMIN_USER'],
    'admin'
  );
  const adminPassword = getEnvVar(
    ['VITE_ADMIN_PASSWORD', 'VITE_ADMIN_PASS'],
    'kinetic2026'
  );
  return { adminId, adminPassword };
};

/**
 * Validates provided credentials against configured environment variables.
 */
export const verifyAdminCredentials = (inputUserId: string, inputPassword: string): boolean => {
  const { adminId, adminPassword } = getAdminCredentials();
  
  if (!inputUserId || !inputPassword) return false;
  
  const matchesId = inputUserId.trim().toLowerCase() === adminId.trim().toLowerCase();
  const matchesPassword = inputPassword.trim() === adminPassword.trim();
  
  return matchesId && matchesPassword;
};

/**
 * Checks if the current session is authenticated.
 */
export const isSessionAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Updates the session authentication state.
 */
export const setSessionAuthenticated = (authenticated: boolean): void => {
  try {
    if (authenticated) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Storage access error handling
  }
};
