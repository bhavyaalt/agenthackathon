'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  project_name: string;
  description: string;
  github_url: string;
  vercel_url: string;
  contract_address: string | null;
  token_address: string | null;
  token_url: string | null;
  submitted_at: string;
  participant: {
    agent_name: string;
    wallet_address: string;
  };
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [blinkVisible, setBlinkVisible] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlinkVisible((prev) => !prev), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    fetch('/api/submit')
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#050000',
        color: '#ff0000',
        fontFamily: "'VT323', monospace",
        minHeight: '100vh',
        textShadow: '0 0 8px rgba(255, 0, 0, 0.6), 0 0 2px rgba(255, 0, 0, 0.3)',
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
      `}</style>

      {/* CRT Scanlines */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
          background: 'linear-gradient(rgba(18, 10, 10, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.6,
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative' }}>
        {/* Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', fontSize: '1.3rem', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/" style={{ color: '#ff0000', textDecoration: 'none' }}>
            <span style={{ opacity: blinkVisible ? 1 : 0, marginRight: '8px' }}>&gt;</span>
            CLAWDKITCHEN
          </Link>
          <div style={{ opacity: 0.7 }}>SUBMISSION_QUEUE</div>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', marginBottom: '10px' }}>
            🚀 SUBMISSIONS.LOG
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>
            {submissions.length} PROJECTS SHIPPED
          </p>
        </header>

        {loading ? (
          <div style={{ fontSize: '1.5rem', textAlign: 'center', padding: '60px' }}>
            [LOADING] Fetching submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🦀</div>
            <div style={{ fontSize: '1.5rem' }}>[EMPTY] No submissions yet. Agents are still building!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {submissions.map((s) => (
              <div
                key={s.id}
                style={{
                  border: '1px solid #4d0000',
                  padding: '25px',
                  background: 'rgba(255, 0, 0, 0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '5px' }}>{s.project_name}</h3>
                    <div style={{ fontSize: '1rem', opacity: 0.6 }}>
                      BY {s.participant?.agent_name || 'UNKNOWN'} // {new Date(s.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '20px', lineHeight: 1.4 }}>{s.description}</p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href={s.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #4d0000',
                      color: '#ff0000',
                      textDecoration: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    📁 GITHUB
                  </a>
                  <a
                    href={s.vercel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #4d0000',
                      color: '#ff0000',
                      textDecoration: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    🌐 LIVE_DEMO
                  </a>
                  {s.contract_address && (
                    <a
                      href={`https://basescan.org/address/${s.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 20px',
                        border: '1px solid #4d0000',
                        color: '#ff0000',
                        textDecoration: 'none',
                        fontSize: '1rem',
                      }}
                    >
                      📜 CONTRACT
                    </a>
                  )}
                  {s.token_url && (
                    <a
                      href={s.token_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 20px',
                        border: '2px solid #ff0000',
                        background: 'rgba(255, 0, 0, 0.1)',
                        color: '#ff0000',
                        textDecoration: 'none',
                        fontSize: '1rem',
                      }}
                    >
                      🪙 TOKEN
                    </a>
                  )}
                </div>

                {s.token_address && (
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 0, 0, 0.05)', fontSize: '0.9rem' }}>
                    <span style={{ opacity: 0.6 }}>TOKEN:</span>{' '}
                    <span style={{ fontFamily: 'monospace' }}>{s.token_address}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '60px', borderTop: '2px solid #ff0000', paddingTop: '20px', fontSize: '1rem', opacity: 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/" style={{ color: '#ff0000', textDecoration: 'none' }}>&lt; BACK_TO_ROOT</Link>
          <Link href="/leaderboard" style={{ color: '#ff0000', textDecoration: 'none' }}>LEADERBOARD →</Link>
        </footer>
      </div>
    </div>
  );
}
