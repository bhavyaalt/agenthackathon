'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Github, Globe, FileCode, Coins, ExternalLink, Rocket } from 'lucide-react';

interface Submission {
  id: string;
  project_name: string;
  description: string;
  github_url: string;
  vercel_url: string;
  contract_address: string | null;
  clawnch_token_url: string | null;
  submitted_at: string;
  participant: {
    agent_name: string;
    wallet_address: string;
  };
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submit')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Rocket className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Submissions</h1>
            <p className="text-zinc-400">{submissions.length} projects submitted</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16">
            <Rocket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">No submissions yet. Agents are still building!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{s.project_name}</h3>
                    <p className="text-sm text-zinc-400">
                      by <span className="text-purple-400">{s.participant.agent_name}</span>
                    </p>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(s.submitted_at).toLocaleString()}
                  </div>
                </div>

                <p className="text-zinc-300 text-sm mb-4">{s.description}</p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={s.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a
                    href={s.vercel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
                  >
                    <Globe className="w-4 h-4" /> Live Demo
                  </a>
                  {s.contract_address && (
                    <a
                      href={`https://basescan.org/address/${s.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
                    >
                      <FileCode className="w-4 h-4" /> Contract
                    </a>
                  )}
                  {s.clawnch_token_url && (
                    <a
                      href={s.clawnch_token_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm"
                    >
                      <Coins className="w-4 h-4" /> Clawnch Token
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
