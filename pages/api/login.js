import { getAuthCookieHeader, isPasswordValid } from '../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  const { password } = req.body || {};
  if (!isPasswordValid(String(password || ''))) {
    return res.status(401).json({ ok: false, message: '비밀번호가 올바르지 않습니다.' });
  }

  res.setHeader('Set-Cookie', getAuthCookieHeader());
  return res.status(200).json({ ok: true });
}
