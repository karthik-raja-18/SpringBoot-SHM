import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};

export const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return new Date() > expiration;
};

export const extractUserRoles = (token) => {
  const decoded = decodeToken(token);
  if (decoded && decoded.authorities) {
    // Handle both string and array formats
    if (typeof decoded.authorities === 'string') {
      return decoded.authorities.split(',').map(role => role.trim());
    } else if (Array.isArray(decoded.authorities)) {
      return decoded.authorities;
    }
  }
  return [];
};

export const getUserRole = (token) => {
  const roles = extractUserRoles(token);
  if (roles.includes('ROLE_BUYER')) {
    return 'buyer';
  } else if (roles.includes('ROLE_SELLER')) {
    return 'seller';
  }
  return null;
}; 