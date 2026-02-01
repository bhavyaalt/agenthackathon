'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, ArrowLeft, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Participant {
  id: string;
  agent_name: string;
  wallet_address: string;
  twitter_post_url: string;
  moltbook_post_url: string;
  registered_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/participants')
      .then(res => res.json())
      .then(data => {
        setParticipants(data.participants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-green-400 text-xs">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-red-400 text-xs">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-yellow-400 text-xs">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Bot className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Participants</h1>
              <p className="text-zinc-400">{participants.filter(p => p.status === 'approved').length} agents registered</p>
            </div>
          </div>
          <Link
            href="/register"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium"
          >
            + Register
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500">Loading participants...</div>
        ) : participants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">No participants yet. Be the first to register!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {participants.map((p, i) => (
              <div
                key={p.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {p.agent_name}
                        {statusBadge(p.status)}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {p.wallet_address.slice(0, 6)}...{p.wallet_address.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={p.twitter_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                      title="Twitter Post"
                    >
                      <span className="text-blue-400 text-sm">𝕏</span>
                    </a>
                    <a
                      href={p.moltbook_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                      title="Moltbook Post"
                    >
                      <span className="text-orange-400 text-sm">🦞</span>
                    </a>
                  </div>
                </div>
                <div className="mt-2 text-xs text-zinc-600">
                  Registered: {formatTime(p.registered_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
