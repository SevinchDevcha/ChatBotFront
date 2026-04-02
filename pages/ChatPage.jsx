import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addUserMessage } from '../features/chat/chatSlice';
import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import VoiceButton from '../components/VoiceButton';
import PopularQuestions from '../components/PopularQuestions';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { messages, currentChatId, sending, historyLoading } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);

  const [input, setInput]   = useState('');
  const bottomRef           = useRef(null);
  const inputRef            = useRef(null);

  // Yangi xabar kelganda pastga scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    dispatch(addUserMessage(text));
    dispatch(sendMessage({ message: text, chatId: currentChatId }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Whisper dan kelgan matnni inputga qo'yish
  const handleTranscribed = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  // Ommabop savol bosilganda
  const handlePopularClick = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <AcademicCapIcon className="header-icon" />
          <div>
            <div className="header-title">Oliy ta'lim vazirligi AI Maslahatchisi</div>
            <div className="header-sub">Salom, {user?.firstname}! Rasmiy savollaringizga yordam beraman.</div>
          </div>
          <div className="status-badge">
            <span className="status-dot" /> Faol
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {historyLoading ? (
            <div className="center-state"><div className="spinner" /></div>
          ) : messages.length === 0 ? (
            <div className="welcome-state">
              <div className="welcome-icon-wrap">
                <AcademicCapIcon className="welcome-icon" />
              </div>
              <h2>Salom, {user?.firstname}!</h2>
              <p>Oliy ta'lim, fan va innovatsiyalar vazirligi bo'yicha savollaringizga javob beraman.</p>
              <PopularQuestions onClick={handlePopularClick} />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} {...msg} />
              ))}
              {sending && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-box">
            <textarea
              ref={inputRef}
              className="message-input"
              placeholder="Savolingizni yozing... (Enter — yuborish)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={sending}
            />
            <VoiceButton onTranscribed={handleTranscribed} disabled={sending} />
            <button
              className={`send-btn ${sending || !input.trim() ? 'disabled' : ''}`}
              onClick={handleSend}
              disabled={sending || !input.trim()}
            >
              <PaperAirplaneIcon className="send-icon" />
            </button>
          </div>
          <div className="input-hint">
            🎤 Bosib turing — gapiring &nbsp;|&nbsp; EduBot faqat rasmiy ma'lumotlar asosida javob beradi
          </div>
        </div>
      </main>
    </div>
  );
}
