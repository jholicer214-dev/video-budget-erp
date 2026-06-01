import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { isRequestAuthenticated } from '../lib/auth';
import { budgetMarkup, budgetScript, budgetStyles } from '../lib/budgetContent';

export async function getServerSideProps({ req }) {
  if (!isRequestAuthenticated(req)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return { props: {} };
}

export default function BudgetPage() {
  const router = useRouter();

  useEffect(() => {
    if (window.__budgetCalculatorLoaded) {
      if (typeof window.init === 'function') window.init();
      return;
    }
    window.__budgetCalculatorLoaded = true;
    const script = document.createElement('script');
    script.text = budgetScript;
    document.body.appendChild(script);
  }, []);

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>영상 제작 예산 관리 시스템</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js" strategy="afterInteractive" />
      <style dangerouslySetInnerHTML={{ __html: budgetStyles }} />
      <style jsx global>{`
        .logout-floating-button {
          position: fixed;
          top: 22px;
          left: 22px;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.94);
          color: #1e3a8a;
          border: 1px solid rgba(30, 58, 138, 0.22);
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
        }

        .dark-mode .logout-floating-button {
          background: #111827;
          color: #e2e8f0;
          border-color: #334155;
        }
      `}</style>
      <button className="btn-secondary logout-floating-button" type="button" onClick={handleLogout}>
        로그아웃
      </button>
      <div dangerouslySetInnerHTML={{ __html: budgetMarkup }} />
    </>
  );
}
