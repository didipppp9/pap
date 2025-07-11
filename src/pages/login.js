// src/pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Importar getDoc e doc
import '../styles/global.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // VERIFICAR SE A CONTA ESTÁ BLOQUEADA
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().blocked) {
        // Se estiver bloqueado, fazer logout e mostrar erro
        await signOut(auth);
        setError('Esta conta foi bloqueada por um administrador.');
      } else {
        // Se não estiver bloqueado, continuar para a página inicial
        router.push('/');
      }
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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