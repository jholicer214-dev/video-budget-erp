import crypto from 'crypto';

export const AUTH_COOKIE = 'budget_auth';

function getPassword() {
  return process.env.APP_PASSWORD || '';
}

export function getAuthToken() {
  const password = getPassword();
  if (!password) return '';
  return crypto.createHmac('sha256', password).update('budget-session').digest('hex');
}

export function isPasswordValid(password) {
  const appPassword = getPassword();
  if (!appPassword || !password) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(appPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isRequestAuthenticated(req) {
  const token = getAuthToken();
  return Boolean(token && req.cookies?.[AUTH_COOKIE] === token);
}

export function getAuthCookieHeader() {
  return `${AUTH_COOKIE}=${getAuthToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export function getLogoutCookieHeader() {
  return `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
