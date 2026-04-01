import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { useSendMessageMutation, useLazyGetHistoryQuery } from '../features/chat/chatApi';
import { PaperAirplaneIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

const getUserId = () => {
  let id = localStorage.getItem('edu_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('edu_user_id', id);
  }
  return id;
};

export default function ChatPage() {
  const userId = getUserId();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [getHistory, { isFetching: historyLoading }] = useLazyGetHistoryQuery();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSelectChat = async (id) => {
    setChatId(id);
    const history = await getHistory(id).unwrap();
    setMessages(history.map(h => ({
      role: h.role,
      message: h.message,
      timestamp: h.timestamp,
    })));
  };

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', message: text, timestamp: new Date() }]);

    try {
      const data = await sendMessage({ userId, message: text, chatId }).unwrap();
      if (!chatId) setChatId(data.chatId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: data.response,
        timestamp: data.timestamp,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: '❌ Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.',
        timestamp: new Date(),
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        userId={userId}
        currentChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <main className="chat-main">
        <div className="chat-header">
          <AcademicCapIcon className="header-icon" />
          <div>
            <div className="header-title">Oliy ta'lim vazirligi AI Maslahatchisi</div>
            <div className="header-sub">Rasmiy savollaringizga yordam beraman</div>
          </div>
          <div className="status-badge">
            <span className="status-dot" />
            Faol
          </div>
        </div>

        <div className="messages-area">
          {historyLoading ? (
            <div className="center-state">
              <div className="spinner" />
            </div>
          ) : messages.length === 0 ? (
            <div className="welcome-state">
              <div className="welcome-icon-wrap">
                <AcademicCapIcon className="welcome-icon" />
              </div>
              <h2>Salom! Men EduBot AI</h2>
              <p>Oliy ta'lim, fan va innovatsiyalar vazirligi bo'yicha savollaringizga javob beraman.</p>
              <div className="suggestion-chips">
                {[
                  "Oliy ta'limga qabul qilish tartibi?",
                  "Magistratura uchun hujjatlar?",
                  "Ilmiy grantlar haqida ma'lumot",
                  "Transfer qilish mumkinmi?"
                ].map(s => (
                  <button key={s} className="chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} {...msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-box">
            <textarea
              ref={inputRef}
              className="message-input"
              placeholder="Savolingizni yozing... (Enter — yuborish, Shift+Enter — yangi qator)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`send-btn ${isLoading || !input.trim() ? 'disabled' : ''}`}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <PaperAirplaneIcon className="send-icon" />
            </button>
          </div>
          <div className="input-hint">EduBot AI ma'lumotlar bazasi asosida javob beradi</div>
        </div>
      </main>
    </div>
  );
}
