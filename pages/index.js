import { useState } from 'react';
import { useRouter } from 'next/router';
import { isRequestAuthenticated } from '../lib/auth';

export async function getServerSideProps({ req }) {
  if (isRequestAuthenticated(req)) {
    return {
      redirect: {
        destination: '/budget',
        permanent: false
      }
    };
  }

  return { props: {} };
}

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    setLoading(false);
    if (!response.ok) {
      setError('비밀번호가 올바르지 않습니다.');
      return;
    }

    router.push('/budget');
  }

  return (
    <main className="loginPage">
      <form className="loginCard" onSubmit={handleSubmit}>
        <div>
          <h1>영상 제작 예산 ERP</h1>
          <p>비밀번호를 입력하면 예산표로 이동합니다.</p>
        </div>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호 입력"
            autoFocus
          />
        </label>
        {error ? <div className="errorText">{error}</div> : null}
        <button type="submit" disabled={loading}>
          {loading ? '확인 중...' : '접속'}
        </button>
      </form>
      <style jsx>{`
        .loginPage {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f8fafc;
          font-family: 'Segoe UI', 'Noto Sans KR', sans-serif;
          color: #1f2937;
        }

        .loginCard {
          width: min(420px, 100%);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 28px;
          box-shadow: 0 12px 34px rgba(15, 23, 42, 0.12);
          display: grid;
          gap: 18px;
        }

        h1 {
          margin: 0 0 8px;
          color: #1e3a8a;
          font-size: 1.55rem;
        }

        p {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        label {
          display: grid;
          gap: 8px;
          font-weight: 700;
          font-size: 0.92rem;
        }

        input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font: inherit;
        }

        button {
          border: 0;
          border-radius: 6px;
          padding: 13px 16px;
          background: #1e3a8a;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.65;
          cursor: default;
        }

        .errorText {
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
