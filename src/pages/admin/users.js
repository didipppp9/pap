// src/pages/admin/users.js
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import useAdminAuth from '@/hooks/useAdminAuth';
import '@/styles/admin.css';
import '@/styles/admin-users.css';

export default function ManageUsers() {
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role !== 'admin');
      setUsers(usersList);
      setLoading(false);
    }, (err) => {
      setError("Não foi possível carregar a lista de utilizadores.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const handleToggleBlockUser = async (userId, userName, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'bloquear' : 'desbloquear';
    if (!window.confirm(`Tem a certeza que quer ${actionText} a conta de ${userName}?`)) {
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { blocked: newStatus });
      setSuccessMessage(`Utilizador ${userName} foi ${newStatus ? 'bloqueado' : 'desbloqueado'} com sucesso.`);
    } catch (err) {
      setError("Ocorreu um erro ao atualizar o estado do utilizador.");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Tem a certeza que quer APAGAR a conta de ${userName}? Esta ação é irreversível.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', userId));
      setSuccessMessage(`Utilizador ${userName} apagado com sucesso.`);
    } catch (err) {
      setError("Ocorreu um erro ao apagar o utilizador.");
    }
  };

  if (adminLoading) return <p className="info-text">A verificar autorização...</p>;
  if (!isAdmin) return null;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Gerir Utilizadores</h1>
      {error && <p className="error-text">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="user-list-container">
        {loading ? <p className="info-text">A carregar utilizadores...</p> : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Utilizador</th>
                <th>Estado</th>
                <th className="user-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(user => (
                <tr key={user.id} className={user.blocked ? 'blocked-user' : ''}>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-tag ${user.blocked ? 'status-blocked' : 'status-active'}`}>
                      {user.blocked ? 'Bloqueado' : 'Ativo'}
                    </span>
                  </td>
                  <td className="user-actions">
                    <button
                      onClick={() => handleToggleBlockUser(user.id, user.name, user.blocked)}
                      className={`btn ${user.blocked ? 'btn-success' : 'btn-warning'}`}
                    >
                      {user.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="btn btn-danger"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                    Não existem utilizadores registados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}