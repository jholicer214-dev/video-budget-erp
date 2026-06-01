import { getLogoutCookieHeader } from '../../lib/auth';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', getLogoutCookieHeader());
  return res.status(200).json({ ok: true });
}
