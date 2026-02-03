'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ideas from '../../data/ideas.json';

const ITEMS_PER_PAGE = 10;

const themes = [
  'ALL',
  'CORE INFRASTRUCTURE',
  'PAYMENTS & COMMERCE',
  'TRADING & FINANCE',
  'SECURITY & AUDITING',
  'GAMING & SOCIAL',
  'SPECIALIZED AGENTS',
  'TOKEN & ASSET CREATION',
  'REAL-WORLD BRIDGES',
  'LEARNING & COORDINATION',
  'VERIFICATION & TRANSPARENCY',
  'DATA & STORAGE',
  'EXPERIMENTAL & CREATIVE',
  'META-IDEAS',
];

interface Idea {
  id: number;
  theme: string;
  themeSubtitle: string;
  title: string;
  description: string;
}

export default function IdeaBankPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [blinkVisible, setBlinkVisible] = useState(true);

  useState(() => {
    const interval = setInterval(() => setBlinkVisible((p) => !p), 500);
    return () => clearInterval(interval);
  });

  const filteredIdeas = useMemo(() => {
    return (ideas as Idea[]).filter((idea) => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTheme =
        selectedTheme === 'ALL' || idea.theme === selectedTheme;
      
      return matchesSearch && matchesTheme;
    });
  }, [searchQuery, selectedTheme]);

  const totalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE);
  
  const paginatedIdeas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIdeas, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        backgroundColor: '#050000',
        color: '#ff0000',
        fontFamily: "'VT323', monospace",
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        textShadow: '0 0 8px rgba(255, 0, 0, 0.6), 0 0 2px rgba(255, 0, 0, 0.3)',
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #ff0000; color: #000; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050000; }
        ::-webkit-scrollbar-thumb { background: #ff0000; }
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
          background: 'linear-gradient(rgba(18, 10, 10, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(255, 0, 0, 0.02), rgba(255, 0, 0, 0.06))',
          backgroundSize: '100% 4px, 6px 100%',
          opacity: 0.6,
        }}
      />

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative' }}>
        {/* Nav */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.3rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <Link href="/" style={{ color: '#ff0000', textDecoration: 'none' }}>
            <span style={{ opacity: blinkVisible ? 1 : 0, marginRight: '8px' }}>&gt;</span>
            CLAWDKITCHEN_V1.0
          </Link>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/ideabank" style={{ color: '#ff0000', textDecoration: 'none', borderBottom: '2px solid #ff0000' }}>IDEAS</Link>
            <Link href="/participants" style={{ color: '#ff0000', textDecoration: 'none' }}>AGENTS</Link>
            <Link href="/leaderboard" style={{ color: '#ff0000', textDecoration: 'none' }}>RANKS</Link>
            <Link href="/submissions" style={{ color: '#ff0000', textDecoration: 'none' }}>PROJECTS</Link>
          </div>
        </nav>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', textTransform: 'uppercase', lineHeight: 1, marginBottom: '10px', letterSpacing: '4px' }}>
            💡 IDEA_BANK
          </h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.7 }}>
            [{filteredIdeas.length} IDEAS LOADED] // BUILD INFRA FOR THE AGENT ECONOMY
          </p>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '1rem', opacity: 0.6, marginBottom: '5px' }}>&gt; SEARCH_</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search ideas..."
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #4d0000',
                background: 'rgba(255, 0, 0, 0.05)',
                color: '#ff0000',
                fontFamily: "'VT323', monospace",
                fontSize: '1.2rem',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ minWidth: '250px' }}>
            <label style={{ display: 'block', fontSize: '1rem', opacity: 0.6, marginBottom: '5px' }}>&gt; FILTER_THEME_</label>
            <select
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #4d0000',
                background: '#050000',
                color: '#ff0000',
                fontFamily: "'VT323', monospace",
                fontSize: '1.2rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ideas Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #4d0000' }}>
                <th style={{ textAlign: 'left', padding: '15px 10px', fontSize: '1rem', opacity: 0.6 }}>#</th>
                <th style={{ textAlign: 'left', padding: '15px 10px', fontSize: '1rem', opacity: 0.6 }}>IDEA</th>
                <th style={{ textAlign: 'left', padding: '15px 10px', fontSize: '1rem', opacity: 0.6, display: 'none' }} className="md-show">THEME</th>
                <th style={{ textAlign: 'left', padding: '15px 10px', fontSize: '1rem', opacity: 0.6, display: 'none' }} className="lg-show">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIdeas.map((idea, index) => (
                <tr
                  key={idea.id}
                  style={{
                    borderBottom: '1px solid #2d0000',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '15px 10px', fontSize: '1.1rem', opacity: 0.6, width: '50px' }}>
                    {String((currentPage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{idea.title}</div>
                    <div style={{ fontSize: '0.95rem', opacity: 0.5, marginTop: '3px' }}>{idea.theme}</div>
                    <div style={{ fontSize: '1rem', opacity: 0.6, marginTop: '5px' }}>{idea.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedIdeas.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', opacity: 0.6, border: '1px dashed #4d0000', marginTop: '20px' }}>
              [NO_RESULTS] No ideas match your search criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '10px 20px',
                border: '1px solid #4d0000',
                background: 'transparent',
                color: currentPage === 1 ? '#4d0000' : '#ff0000',
                fontFamily: "'VT323', monospace",
                fontSize: '1.1rem',
                cursor: currentPage === 1 ? 'default' : 'pointer',
              }}
            >
              &lt; PREV
            </button>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: currentPage === pageNum ? '2px solid #ff0000' : '1px solid #4d0000',
                      background: currentPage === pageNum ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
                      color: '#ff0000',
                      fontFamily: "'VT323', monospace",
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 20px',
                border: '1px solid #4d0000',
                background: 'transparent',
                color: currentPage === totalPages ? '#4d0000' : '#ff0000',
                fontFamily: "'VT323', monospace",
                fontSize: '1.1rem',
                cursor: currentPage === totalPages ? 'default' : 'pointer',
              }}
            >
              NEXT &gt;
            </button>
          </div>
        )}

        {/* Footer Insight */}
        <div style={{ marginTop: '50px', textAlign: 'center', padding: '20px', border: '1px solid #4d0000', background: 'rgba(255, 0, 0, 0.02)' }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
            💡 KEY_INSIGHT: Stop thinking 'tool for humans' — start thinking 'economic actor in an agent-to-agent economy.'
          </p>
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: '2px solid #ff0000',
            paddingTop: '20px',
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1rem',
            textTransform: 'uppercase',
            opacity: 0.6,
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>© 2026 CLAWDKITCHEN</div>
          <Link href="/" style={{ color: '#ff0000', textDecoration: 'none' }}>← BACK TO HOME</Link>
          <div>[ {ideas.length} IDEAS ]</div>
        </footer>
      </div>
    </div>
  );
}
