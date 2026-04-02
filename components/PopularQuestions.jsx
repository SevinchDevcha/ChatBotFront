import { useEffect, useState } from 'react';
import { statsApi } from '../services/api';
import { FireIcon } from '@heroicons/react/24/solid';

/**
 * Ommabop savollar — foydalanuvchi welcome ekranida ko'rsatiladi
 * onClick: (question) => void
 */
export default function PopularQuestions({ onClick }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    statsApi.getPopular()
      .then(setQuestions)
      .catch(() => {}); // jimgina muvaffaqiyatsizlik
  }, []);

  if (questions.length === 0) return null;

  return (
    <div className="popular-questions">
      <div className="popular-label">
        <FireIcon className="popular-icon" />
        Ommabop savollar
      </div>
      <div className="popular-list">
        {questions.map((q, i) => (
          <button key={i} className="popular-chip" onClick={() => onClick(q.question)}>
            <span className="popular-rank">#{i + 1}</span>
            {q.question}
          </button>
        ))}
      </div>
    </div>
  );
}
