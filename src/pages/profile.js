// src/pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import '../styles/profile.css';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setError('Email do utilizador não encontrado.');
      return;
    }

    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage('Foi enviado um email para a sua conta para redefinir a palavra-passe.');
    } catch (err) {
      console.error("Erro ao enviar email de recuperação de palavra-passe:", err);
      setError('Ocorreu um erro ao enviar o email. Por favor, tente novamente mais tarde.');
    }
  };

  if (loading || !user) {
    return <p className="info-text">A carregar perfil...</p>;
  }

  return (
    <div className="profile-container container">
      <h1 className="section-title">O Meu Perfil</h1>
      
      <div className="profile-card">
        <h2 className="profile-card-title">As minhas informações</h2>
        
        {message && <p className="profile-message success">{message}</p>}
        {error && <p className="profile-message error">{error}</p>}

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nome:</span>
            <span className="info-value">{user.name || 'Não definido'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tipo de Conta:</span>
            <span className="info-value">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
          </div>
        </div>

        <button onClick={handlePasswordReset} className="change-password-btn">
          Mudar Palavra-passe por Email
        </button>
      </div>
    </div>
  );
}