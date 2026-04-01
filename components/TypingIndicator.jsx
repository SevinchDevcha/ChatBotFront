import { AcademicCapIcon } from '@heroicons/react/24/solid';

export default function TypingIndicator() {
  return (
    <div className="message-row assistant-row">
      <div className="avatar assistant-avatar">
        <AcademicCapIcon className="avatar-icon" />
      </div>
      <div className="bubble assistant-bubble typing-bubble">
        <div className="typing-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="typing-label">EduBot javob yozmoqda...</div>
      </div>
    </div>
  );
}
