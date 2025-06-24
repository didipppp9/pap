// src/pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import '../styles/global.css';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ... (a função handleSignUp continua a mesma)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name) {
      setError('Por favor, preencha o seu nome.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: new Date(),
      });
      router.push('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está a ser utilizado.');
      } else if (err.code === 'auth/invalid-email') {
        setError('O formato do email é inválido.');
      } else {
        setError('Ocorreu um erro ao criar a conta. Tente novamente.');
      }
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
            right: '25px',   // E aqui
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

        <h2>Criar Conta</h2>
        <form onSubmit={handleSignUp}>
          {/* ... resto do formulário ... */}
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
        </form>
        <p className="auth-switch">
          Já tem uma conta? <Link href="/login">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}