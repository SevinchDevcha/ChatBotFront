import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, clearError } from './authSlice';
import { AcademicCapIcon } from '@heroicons/react/24/solid';

export default function AuthPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [mode, setMode]           = useState('signin'); // 'signin' | 'signup'
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname]   = useState('');

  const handleSubmit = () => {
    if (!firstname.trim()) return;
    if (mode === 'signup') {
      if (!lastname.trim()) return;
      dispatch(signUp({ firstname: firstname.trim(), lastname: lastname.trim() }));
    } else {
      dispatch(signIn(firstname.trim()));
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setFirstname('');
    setLastname('');
    dispatch(clearError());
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <AcademicCapIcon />
          </div>
          <h1>EduBot AI</h1>
          <p>Oliy ta'lim, fan va innovatsiyalar vazirligi</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => switchMode('signin')}
          >
            Kirish
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Form */}
        <div className="auth-form">
          <div className="form-group">
            <label>Ism (login)</label>
            <input
              type="text"
              placeholder="Masalan: Jasur"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="auth-input"
              autoFocus
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label>Familiya</label>
              <input
                type="text"
                placeholder="Masalan: Toshmatov"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="auth-input"
              />
            </div>
          )}

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> Yuklanmoqda...</>
            ) : mode === 'signin' ? (
              'Kirish →'
            ) : (
              "Ro'yxatdan o'tish →"
            )}
          </button>
        </div>

        {mode === 'signin' && (
          <p className="auth-hint">
            Hali ro'yxatdan o'tmaganmisiz?{' '}
            <button className="auth-link" onClick={() => switchMode('signup')}>
              Ro'yxatdan o'ting
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
