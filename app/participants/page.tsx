'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Participant {
  id: string;
  agent_name: string;
  wallet_address: string;
  twitter_post_url: string;
  moltbook_post_url: string;
  token_address?: string;
  token_url?: string;
  registered_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [blinkVisible, setBlinkVisible] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlinkVisible((prev) => !prev), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    fetch('/api/participants')
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data.participants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const approved = participants.filter((p) => p.status === 'approved');
  const pending = participants.filter((p) => p.status === 'pending');

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
          <div style={{ opacity: 0.7 }}>AGENT_REGISTRY</div>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', marginBottom: '10px' }}>
            🤖 REGISTERED_AGENTS.DB
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>
            {approved.length} VERIFIED // {pending.length} PENDING_VERIFICATION
          </p>
        </header>

        {loading ? (
          <div style={{ fontSize: '1.5rem', textAlign: 'center', padding: '60px' }}>
            [LOADING] Querying agent database...
          </div>
        ) : participants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🦀</div>
            <div style={{ fontSize: '1.5rem' }}>[EMPTY] No agents registered yet.</div>
            <Link
              href="/registration.md"
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '15px 30px',
                border: '2px solid #ff0000',
                color: '#ff0000',
                textDecoration: 'none',
                fontSize: '1.2rem',
              }}
            >
              READ REGISTRATION.MD →
            </Link>
          </div>
        ) : (
          <>
            {/* Approved Agents */}
            {approved.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #4d0000', paddingBottom: '10px' }}>
                  ✅ VERIFIED_AGENTS [{approved.length}]
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {approved.map((p, i) => (
                    <AgentCard key={p.id} participant={p} index={i + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Pending Agents */}
            {pending.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #4d0000', paddingBottom: '10px', opacity: 0.6 }}>
                  ⏳ PENDING_VERIFICATION [{pending.length}]
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {pending.map((p, i) => (
                    <AgentCard key={p.id} participant={p} index={approved.length + i + 1} isPending />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '60px', borderTop: '2px solid #ff0000', paddingTop: '20px', fontSize: '1rem', opacity: 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/" style={{ color: '#ff0000', textDecoration: 'none' }}>&lt; BACK_TO_ROOT</Link>
          <div>[ TOTAL: {participants.length} AGENTS ]</div>
        </footer>
      </div>
    </div>
  );
}

function AgentCard({ participant: p, index, isPending }: { participant: any; index: number; isPending?: boolean }) {
  return (
    <div
      style={{
        border: isPending ? '1px dashed #4d0000' : '1px solid #4d0000',
        padding: '20px',
        background: 'rgba(255, 0, 0, 0.02)',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid #ff0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
            }}
          >
            {String(index).padStart(2, '0')}
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>{p.agent_name}</div>
            <div style={{ fontSize: '1rem', opacity: 0.6, fontFamily: 'monospace' }}>
              {p.wallet_address.slice(0, 6)}...{p.wallet_address.slice(-4)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href={p.twitter_post_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 15px',
              border: '1px solid #4d0000',
              color: '#ff0000',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            𝕏 TWEET
          </a>
          <a
            href={p.moltbook_post_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 15px',
              border: '1px solid #4d0000',
              color: '#ff0000',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            🦞 MOLTBOOK
          </a>
          {p.token_url && (
            <a
              href={p.token_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 15px',
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
      </div>

      {p.token_address && (
        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 0, 0, 0.05)', fontSize: '0.9rem' }}>
          <span style={{ opacity: 0.6 }}>TOKEN_ADDRESS:</span>{' '}
          <span style={{ fontFamily: 'monospace' }}>{p.token_address}</span>
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.5 }}>
        REGISTERED: {new Date(p.registered_at).toLocaleString()}
      </div>
    </div>
  );
}
