import { AcademicCapIcon, UserIcon } from '@heroicons/react/24/solid';

export default function MessageBubble({ role, message, timestamp }) {
  const isUser = role === 'user';

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      {!isUser && (
        <div className="avatar assistant-avatar">
          <AcademicCapIcon className="avatar-icon" />
        </div>
      )}
      <div className={`bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        <div className="bubble-text">{message}</div>
        {timestamp && <div className="bubble-time">{formatTime(timestamp)}</div>}
      </div>
      {isUser && (
        <div className="avatar user-avatar">
          <UserIcon className="avatar-icon" />
        </div>
      )}
    </div>
  );
}
