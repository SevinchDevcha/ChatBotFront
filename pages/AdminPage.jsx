import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, statsApi } from '../services/api';
import {
  ArrowLeftIcon, AcademicCapIcon, TrashIcon,
  CheckCircleIcon, DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

export default function AdminPage() {
  const [tab, setTab]           = useState('knowledge'); // 'knowledge' | 'stats'
  const [content, setContent]   = useState('');
  const [entries, setEntries]   = useState([]);
  const [stats, setStats]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const fileInputRef            = useRef(null);

  const loadEntries = async () => {
    try { setEntries(await adminApi.getKnowledge()); } catch {}
  };

  const loadStats = async () => {
    try { setStats(await statsApi.getTopQuestions()); } catch {}
  };

  useEffect(() => { loadEntries(); }, []);
  useEffect(() => { if (tab === 'stats') loadStats(); }, [tab]);

  const showSuccess = (msg) => {
    setSuccess(msg); setTimeout(() => setSuccess(''), 3000);
  };

  // Matn saqlash
  const handleSaveText = async () => {
    if (!content.trim()) { setError('Matn bo\'sh bo\'lishi mumkin emas'); return; }
    setSaving(true); setError('');
    try {
      await adminApi.uploadText(content);
      setContent('');
      showSuccess("Ma'lumot muvaffaqiyatli saqlandi!");
      await loadEntries();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  // Fayl yuklash
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError('');
    try {
      const res = await adminApi.uploadFile(file);
      showSuccess(res.message);
      await loadEntries();
    } catch (err) { setError(err.message); }
    finally { setUploading(false); e.target.value = ''; }
  };

  // O'chirish
  const handleDelete = async (id) => {
    if (!confirm("Bu ma'lumotni o'chirishni tasdiqlaysizmi?")) return;
    try { await adminApi.deleteKnowledge(id); await loadEntries(); }
    catch (err) { setError(err.message); }
  };

  const formatDate = (ts) =>
    new Date(ts).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="admin-layout">
      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">
          <Link to="/" className="back-link">
            <ArrowLeftIcon className="back-icon" /> Chatga qaytish
          </Link>
          <div className="admin-logo">
            <AcademicCapIcon className="admin-logo-icon" />
            <div><h1>CEO Admin Panel</h1><p>AI tizimini boshqarish</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab-btn ${tab === 'knowledge' ? 'active' : ''}`} onClick={() => setTab('knowledge')}>
            📚 Bilim bazasi
          </button>
          <button className={`admin-tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
            📊 Statistika
          </button>
        </div>

        {/* ── KNOWLEDGE TAB ── */}
        {tab === 'knowledge' && (
          <>
            {/* Matn yuklash */}
            <div className="admin-card">
              <h2 className="card-title">Matn qo'shish</h2>
              <p className="card-desc">Vazirlik tartib-qoidalari, talablar va ma'lumotlarni kiriting.</p>
              <textarea
                className="admin-textarea"
                placeholder="Masalan: Magistraturaga qabul tartibi: ..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
              />
              <div className="admin-actions">
                <span className="char-count">{content.length} belgi</span>
                <button className="save-btn" onClick={handleSaveText} disabled={saving}>
                  {saving ? <><span className="btn-spinner" /> Saqlanmoqda...</> : '💾 Saqlash'}
                </button>
              </div>
            </div>

            {/* Fayl yuklash */}
            <div className="admin-card">
              <h2 className="card-title">Fayl yuklash <span className="badge">PDF · DOCX</span></h2>
              <p className="card-desc">PDF yoki DOCX faylni yuklang — tarkibi avtomatik o'qiladi va bilim bazasiga qo'shiladi.</p>
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button
                className="file-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <DocumentArrowUpIcon className="upload-icon" />
                {uploading ? 'Yuklanmoqda...' : 'Fayl tanlash'}
              </button>
            </div>

            {/* Xabar */}
            {error   && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg"><CheckCircleIcon className="success-icon" />{success}</div>}

            {/* Mavjud yozuvlar */}
            <div className="admin-card">
              <h2 className="card-title">
                Mavjud ma'lumotlar
                <span className="badge">{entries.length} ta</span>
              </h2>
              <div className="entries-list">
                {entries.length === 0 ? (
                  <div className="empty-entries">Hali ma'lumot yuklanmagan</div>
                ) : entries.map((e) => (
                  <div key={e._id} className="entry-card">
                    <div className="entry-meta-top">
                      <span className={`source-badge source-${e.source}`}>{e.source}</span>
                      {e.filename && <span className="entry-filename">📎 {e.filename}</span>}
                    </div>
                    <div className="entry-content">{e.content}</div>
                    <div className="entry-footer">
                      <span className="entry-date">📅 {formatDate(e.uploadedAt)}</span>
                      <button className="delete-btn" onClick={() => handleDelete(e._id)}>
                        <TrashIcon className="delete-icon" /> O'chirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && stats && (
          <>
            {/* Summary cards */}
            <div className="stats-summary">
              <div className="stat-card">
                <div className="stat-num">{stats.totalQuestions}</div>
                <div className="stat-label">Jami savollar (30 kun)</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{stats.uniqueUsers}</div>
                <div className="stat-label">Faol foydalanuvchilar</div>
              </div>
            </div>

            {/* Kunlik faollik */}
            <div className="admin-card">
              <h2 className="card-title">📈 Kunlik faollik (7 kun)</h2>
              <div className="bar-chart">
                {stats.dailyActivity.map((d) => {
                  const maxCount = Math.max(...stats.dailyActivity.map((x) => x.count), 1);
                  const pct = Math.round((d.count / maxCount) * 100);
                  return (
                    <div key={d._id} className="bar-item">
                      <div className="bar-fill" style={{ height: `${pct}%` }} title={`${d.count} ta`} />
                      <div className="bar-label">{d._id.slice(5)}</div>
                      <div className="bar-val">{d.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top savollar */}
            <div className="admin-card">
              <h2 className="card-title"><FireIcon className="fire-icon" /> Eng ko'p berilgan savollar</h2>
              <div className="top-questions-list">
                {stats.topQuestions.map((q, i) => (
                  <div key={i} className="top-q-item">
                    <div className="top-q-rank">#{i + 1}</div>
                    <div className="top-q-text">{q.question}</div>
                    <div className="top-q-count">{q.count}x</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top kalit so'zlar */}
            <div className="admin-card">
              <h2 className="card-title">🔑 Eng ko'p uchraydigan so'zlar</h2>
              <div className="keyword-cloud">
                {stats.topKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="keyword-tag"
                    style={{ fontSize: `${Math.max(12, Math.min(22, 12 + k.count))}px` }}
                  >
                    {k.keyword}
                    <sup>{k.count}</sup>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'stats' && !stats && (
          <div className="center-state"><div className="spinner" /></div>
        )}
      </div>
    </div>
  );
}
