const BASE_URL = '/api';

export const api = {
  // Send a chat message
  async sendMessage(userId, message, chatId = null) {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message, chatId })
    });
    if (!res.ok) throw new Error('Xabar yuborishda xatolik');
    return res.json();
  },

  // Get chat history by chatId
  async getHistory(chatId) {
    const res = await fetch(`${BASE_URL}/history/${chatId}`);
    if (!res.ok) throw new Error('Tarixni yuklashda xatolik');
    return res.json();
  },

  // Get all chats for a user
  async getUserChats(userId) {
    const res = await fetch(`${BASE_URL}/chats/${userId}`);
    if (!res.ok) throw new Error('Chatlarni yuklashda xatolik');
    return res.json();
  },

  // Admin: upload knowledge (PDF yoki DOCX fayl)
  async uploadKnowledge(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ma'lumot yuklashda xatolik");
    return data;
  },

  // Admin: get all knowledge
  async getKnowledge() {
    const res = await fetch(`${BASE_URL}/admin/knowledge`);
    if (!res.ok) throw new Error("Ma'lumotlarni yuklashda xatolik");
    return res.json();
  },

  // Admin: delete knowledge entry
  async deleteKnowledge(id) {
    const res = await fetch(`${BASE_URL}/admin/knowledge/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("O'chirishda xatolik");
    return res.json();
  }
};
