import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Send, ThumbsUp, Trash2,
  Search, MessageCircle, ChevronDown, Users
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
  sessionId: string;
}

const STORAGE_KEY = 'ghm_comments';
const SESSION_KEY = 'ghm_session';
const AUTHOR_KEY  = 'ghm_comment_author';

function getSession(): string {
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = Math.random().toString(36).substr(2, 12);
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

function loadComments(): Comment[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

function saveComments(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

const AVATAR_COLORS = [
  '#E53935', '#1E88E5', '#7B1FA2', '#00ACC1',
  '#FB8C00', '#43A047', '#E91E63', '#FF5722',
  '#009688', '#3F51B5', '#795548', '#607D8B',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(iso: string): string {
  const d    = new Date(iso);
  const now  = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60)    return 'Baru saja';
  if (diff < 3600)  return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 2) return 'Kemarin';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

type SortType = 'newest' | 'oldest' | 'popular';

const SORT_LABELS: Record<SortType, string> = {
  newest:  'Terbaru',
  oldest:  'Terlama',
  popular: 'Terpopuler',
};

export function CommentsPage() {
  const { darkMode } = useApp();
  const sessionId    = getSession();

  const [comments,   setComments]   = useState<Comment[]>(loadComments);
  const [author,     setAuthor]     = useState<string>(() => localStorage.getItem(AUTHOR_KEY) || '');
  const [message,    setMessage]    = useState<string>('');
  const [search,     setSearch]     = useState<string>('');
  const [sort,       setSort]       = useState<SortType>('newest');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [showSort,   setShowSort]   = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = comments.filter(c =>
    c.message.toLowerCase().includes(search.toLowerCase()) ||
    c.author.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'newest')  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sort === 'oldest')  return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return b.likes - a.likes;
  });

  const totalLikes  = comments.reduce((s, c) => s + c.likes, 0);
  const todayCount  = comments.filter(c =>
    new Date(c.timestamp).toDateString() === new Date().toDateString()
  ).length;

  // ── Styles ─────────────────────────────────────────────────────────────────
  const card = {
    background: darkMode ? '#111827' : '#ffffff',
    border:     darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    background:   darkMode ? '#1f2937' : '#ffffff',
    color:        darkMode ? '#f3f4f6' : '#1f2937',
    border:       `1.5px solid ${focusField === field ? 'var(--tp, #2E7D32)' : darkMode ? '#374151' : '#e2e8f0'}`,
    fontSize:     '0.875rem',
    transition:   'border-color 0.2s',
    outline:      'none',
    borderRadius: '0.75rem',
    padding:      '0.625rem 0.75rem',
    width:        '100%',
    fontFamily:   'inherit',
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!author.trim() || !message.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));

    const newComment: Comment = {
      id:        Math.random().toString(36).substr(2, 9),
      author:    author.trim(),
      message:   message.trim(),
      timestamp: new Date().toISOString(),
      likes:     0,
      likedBy:   [],
      sessionId,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);
    localStorage.setItem(AUTHOR_KEY, author.trim());
    setMessage('');
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const handleLike = (id: string) => {
    const updated = comments.map(c => {
      if (c.id !== id) return c;
      const liked = c.likedBy.includes(sessionId);
      return {
        ...c,
        likes:   liked ? c.likes - 1 : c.likes + 1,
        likedBy: liked
          ? c.likedBy.filter(s => s !== sessionId)
          : [...c.likedBy, sessionId],
      };
    });
    setComments(updated);
    saveComments(updated);
  };

  const handleDelete = (id: string) => {
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    saveComments(updated);
  };

  const canSubmit = author.trim().length > 0 && message.trim().length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 max-w-screen-md mx-auto space-y-5 pb-10">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-gray-800 dark:text-gray-100"
          style={{ fontWeight: 800, fontSize: '1.5rem' }}>
          Komentar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Bagikan pendapat atau pertanyaan kamu tentang sistem GHM
        </p>
      </motion.div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Komentar', value: comments.length, icon: '💬' },
          { label: 'Total Likes',    value: totalLikes,       icon: '👍' },
          { label: 'Hari Ini',       value: todayCount,       icon: '📅' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl"
            style={card}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--tp, #2E7D32)', lineHeight: 1 }}>
                {s.value}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Input form ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-2xl p-5" style={card}>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--tp-xl, #E8F5E9)' }}>
            <MessageCircle size={16} style={{ color: 'var(--tp, #2E7D32)' }} />
          </div>
          <h2 className="text-gray-800 dark:text-gray-100 text-sm" style={{ fontWeight: 700 }}>
            Tulis Komentar
          </h2>
        </div>

        <div className="space-y-3">
          {/* Author name */}
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5"
              style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Nama Kamu
            </label>
            <input
              type="text"
              placeholder="Masukkan nama kamu..."
              value={author}
              onChange={e => setAuthor(e.target.value)}
              onFocus={() => setFocusField('author')}
              onBlur={() => setFocusField(null)}
              style={inputStyle('author')}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5"
              style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Komentar
            </label>
            <textarea
              ref={textareaRef}
              rows={4}
              placeholder="Tulis komentar, pertanyaan, atau masukan kamu di sini..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onFocus={() => setFocusField('message')}
              onBlur={() => setFocusField(null)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
              }}
              style={{ ...inputStyle('message'), resize: 'none', display: 'block' }}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Tekan <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: darkMode ? '#374151' : '#f1f5f9', fontFamily: 'monospace' }}>Ctrl+Enter</kbd> untuk kirim
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs" style={{ color: message.length > 0 ? 'var(--tp)' : '#9ca3af' }}>
              {message.length} karakter
            </p>
            <motion.button
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              whileTap={{ scale: canSubmit ? 0.97 : 1 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all"
              style={{
                background: submitted
                  ? '#43A047'
                  : !canSubmit
                  ? darkMode ? '#374151' : '#e2e8f0'
                  : `linear-gradient(135deg, var(--tp, #2E7D32), var(--tp-m, #43A047))`,
                color:      !canSubmit && !submitted ? '#9ca3af' : '#ffffff',
                fontWeight: 600,
                cursor:     !canSubmit ? 'not-allowed' : 'pointer',
                boxShadow:  canSubmit && !submitted ? '0 3px 12px rgba(var(--tp-rgb,46,125,50),0.3)' : 'none',
              }}>
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : submitted ? (
                <><span>✓</span> Terkirim!</>
              ) : (
                <><Send size={14} /> Kirim Komentar</>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Search + Sort (hanya jika ada komentar) ── */}
      <AnimatePresence>
        {comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ delay: 0.15 }}
            className="flex gap-3">

            {/* Search */}
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari komentar atau nama..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: darkMode ? '#1f2937' : '#ffffff',
                  color:      darkMode ? '#f3f4f6' : '#1f2937',
                  border:     `1.5px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
                }}
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(o => !o)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
                style={{
                  background: darkMode ? '#1f2937' : '#ffffff',
                  color:      darkMode ? '#f3f4f6' : '#374151',
                  border:     `1.5px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
                  fontWeight: 500,
                }}>
                {SORT_LABELS[sort]} <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {showSort && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0,   scale: 1    }}
                      exit={{ opacity: 0,   y: -8, scale: 0.96 }}
                      className="absolute right-0 mt-1 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                      style={{
                        background: darkMode ? '#1f2937' : '#ffffff',
                        border:     `1.5px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
                        minWidth:   150,
                      }}>
                      {(['newest', 'oldest', 'popular'] as SortType[]).map(s => (
                        <button key={s}
                          onClick={() => { setSort(s); setShowSort(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                          style={{
                            color:      sort === s ? 'var(--tp, #2E7D32)' : darkMode ? '#e5e7eb' : '#374151',
                            fontWeight: sort === s ? 700 : 400,
                          }}>
                          {SORT_LABELS[s]}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Comment list ── */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sorted.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center rounded-2xl"
              style={card}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--tp-xl, #E8F5E9)' }}>
                {search
                  ? <Search size={28} style={{ color: 'var(--tp, #2E7D32)' }} />
                  : <MessageSquare size={28} style={{ color: 'var(--tp, #2E7D32)' }} />}
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                {search ? 'Komentar tidak ditemukan' : 'Belum ada komentar'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {search ? 'Coba kata kunci lain' : 'Jadilah yang pertama berkomentar!'}
              </p>
            </motion.div>
          ) : (
            sorted.map((c, idx) => {
              const isOwn   = c.sessionId === sessionId;
              const liked   = c.likedBy.includes(sessionId);
              const bgColor = getAvatarColor(c.author);

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0   }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                  className="rounded-2xl p-4"
                  style={{
                    background: darkMode ? '#111827' : '#ffffff',
                    border: isOwn
                      ? `1.5px solid var(--tp-l, #C8E6C9)`
                      : darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                  }}>

                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm text-white select-none"
                      style={{ background: bgColor, fontWeight: 700 }}>
                      {getInitials(c.author)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {c.author}
                          </span>
                          {isOwn && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: 'var(--tp-xl, #E8F5E9)', color: 'var(--tp, #2E7D32)' }}>
                              Kamu
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{formatTime(c.timestamp)}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleLike(c.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:scale-105 active:scale-95"
                            style={{
                              background: liked
                                ? 'var(--tp-xl, #E8F5E9)'
                                : darkMode ? 'rgba(255,255,255,0.06)' : '#f8f9fa',
                              color:      liked ? 'var(--tp, #2E7D32)' : '#9ca3af',
                              fontWeight: liked ? 700 : 400,
                            }}>
                            <ThumbsUp size={12} />
                            {c.likes > 0 && <span>{c.likes}</span>}
                          </button>

                          {isOwn && (
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="p-1.5 rounded-lg text-xs transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {c.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer count ── */}
      {sorted.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 pt-2">
          <Users size={13} className="text-gray-400" />
          <p className="text-xs text-gray-400">
            Menampilkan <strong className="text-gray-500 dark:text-gray-300">{sorted.length}</strong> dari{' '}
            <strong className="text-gray-500 dark:text-gray-300">{comments.length}</strong> komentar
          </p>
        </motion.div>
      )}
    </div>
  );
}