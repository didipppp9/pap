// src/pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/global.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ... (a função handleLogin continua a mesma)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError('Email ou senha incorretos. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {/* BOTÃO ATUALIZADO COM ESTILO DIRETO */}
        <button
            onClick={() => router.back()}
            style={{
            position: 'absolute',
            top: '25px',    // Ajuste aqui
            right: '10px',   // E aqui
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#aaaaaa',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
        }}
        >
        &times;
        </button>
        
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          {/* ... resto do formulário ... */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-switch">
          Não tem uma conta? <Link href="/signup">Crie uma aqui</Link>
        </p>
      </div>
    </div>
  );
}