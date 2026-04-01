import { useState, useRef } from 'react';
import { AcademicCapIcon, TrashIcon, ArrowLeftIcon, CheckCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import {
  useGetKnowledgeQuery,
  useUploadKnowledgeMutation,
  useDeleteKnowledgeMutation,
} from '../features/admin/adminApi';

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { data: entries = [], isLoading } = useGetKnowledgeQuery();
  const [uploadKnowledge, { isLoading: saving }] = useUploadKnowledgeMutation();
  const [deleteKnowledge] = useDeleteKnowledgeMutation();

  const handleFileSelect = (selected) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (!allowed.includes(selected.type)) {
      setError('Faqat PDF yoki DOC/DOCX fayl qabul qilinadi');
      return;
    }
    if (selected.size > 20 * 1024 * 1024) {
      setError('Fayl hajmi 20MB dan oshmasligi kerak');
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) { setError('Fayl tanlanmagan'); return; }
    setError('');
    setSuccess('');
    try {
      const result = await uploadKnowledge(file).unwrap();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess(result.message || 'Fayl muvaffaqiyatli saqlandi!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.data?.error || "Yuklashda xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu ma'lumotni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await deleteKnowledge(id).unwrap();
    } catch {
      setError("O'chirishda xatolik");
    }
  };

  const formatDate = (ts) => new Date(ts).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const formatSize = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="admin-layout">
      <div className="admin-container">
        <div className="admin-header">
          <Link to="/" className="back-link">
            <ArrowLeftIcon className="back-icon" />
            Chatga qaytish
          </Link>
          <div className="admin-logo">
            <AcademicCapIcon className="admin-logo-icon" />
            <div>
              <h1>CEO Admin Panel</h1>
              <p>AI bilim bazasini boshqarish</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="admin-card">
          <h2 className="card-title">📚 Yangi hujjat yuklash</h2>
          <p className="card-desc">
            PDF yoki Word hujjatini yuklang. AI chatbot foydalanuvchilarga javob berishda
            faqat shu hujjatlardan foydalanadi.
          </p>

          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
            />
            {file ? (
              <div className="file-selected">
                <DocumentArrowUpIcon className="file-icon" />
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatSize(file.size)}</span>
                </div>
                <button
                  className="file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="drop-zone-placeholder">
                <DocumentArrowUpIcon className="drop-icon" />
                <p>PDF yoki DOC/DOCX faylni bu yerga tashlang</p>
                <span>yoki bosib tanlang</span>
                <small>Maksimal hajm: 20MB</small>
              </div>
            )}
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}
          {success && (
            <div className="success-msg">
              <CheckCircleIcon className="success-icon" />
              {success}
            </div>
          )}

          <div className="admin-actions">
            <span className="char-count">
              {file ? `${file.name.split('.').pop().toUpperCase()} fayl tanlandi` : 'Fayl tanlanmagan'}
            </span>
            <button
              className={`save-btn ${saving ? 'saving' : ''}`}
              onClick={handleUpload}
              disabled={saving || !file}
            >
              {saving ? <><span className="btn-spinner" /> Yuklanmoqda...</> : '📤 Yuklash'}
            </button>
          </div>
        </div>

        {/* Knowledge List */}
        <div className="admin-card">
          <h2 className="card-title">
            📋 Yuklangan hujjatlar
            <span className="badge">{entries.length} ta fayl</span>
          </h2>

          {isLoading ? (
            <div className="loading-entries">
              {[1, 2, 3].map(i => <div key={i} className="entry-skeleton" />)}
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-entries">
              <p>Hali hech qanday hujjat yuklanmagan</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map(entry => (
                <div key={entry._id} className="entry-card">
                  <div className="entry-header">
                    <span className="entry-filename">📄 {entry.fileName || "Noma'lum fayl"}</span>
                  </div>
                  <div className="entry-content">{entry.content?.substring(0, 200)}...</div>
                  <div className="entry-footer">
                    <span className="entry-date">📅 {formatDate(entry.uploadedAt)}</span>
                    <button className="delete-btn" onClick={() => handleDelete(entry._id)}>
                      <TrashIcon className="delete-icon" />
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
