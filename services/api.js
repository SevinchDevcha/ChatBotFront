const BASE_URL = import.meta.env.VITE_API_URL || '';

// Token ni localStorage dan olish
const getToken = () => localStorage.getItem('edu_token');

// Umumiy fetch wrapper
const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server xatosi');
  return data;
};

// FormData uchun (fayl va audio upload)
const requestForm = async (path, formData) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server xatosi');
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────
export const authApi = {
  signUp: (firstname, lastname) =>
    request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ firstname, lastname }) }),

  signIn: (firstname) =>
    request('/api/auth/signin', { method: 'POST', body: JSON.stringify({ firstname }) }),

  getMe: () => request('/api/auth/me'),
};

// ─── CHAT ─────────────────────────────────────────────────────
export const chatApi = {
  sendMessage: (message, chatId = null) =>
    request('/api/chat', { method: 'POST', body: JSON.stringify({ message, chatId }) }),

  getHistory: (chatId) => request(`/api/history/${chatId}`),

  getUserChats: (userId) => request(`/api/chats/${userId}`),
};

// ─── VOICE ────────────────────────────────────────────────────
export const voiceApi = {
  transcribe: (audioBlob) => {
    const form = new FormData();
    form.append('audio', audioBlob, 'audio.webm');
    return requestForm('/api/voice/transcribe', form);
  },
};

// ─── ADMIN ────────────────────────────────────────────────────
export const adminApi = {
  uploadText: (content) =>
    request('/api/admin/upload', { method: 'POST', body: JSON.stringify({ content }) }),

  uploadFile: (file) => {
    const form = new FormData();
    form.append('file', file);
    return requestForm('/api/admin/upload-file', form);
  },

  getKnowledge: () => request('/api/admin/knowledge'),

  deleteKnowledge: (id) =>
    request(`/api/admin/knowledge/${id}`, { method: 'DELETE' }),
};

// ─── STATS ────────────────────────────────────────────────────
export const statsApi = {
  getTopQuestions: () => request('/api/stats/top-questions'),
  getPopular: () => request('/api/stats/popular'),
};
