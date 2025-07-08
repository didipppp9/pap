// src/pages/admin/users.js
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import useAdminAuth from '@/hooks/useAdminAuth';
import '@/styles/admin-users.css'; // Importar o novo CSS

export default function ManageUsers() {
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role !== 'admin'); // Não mostrar outros admins
      setUsers(usersList);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar utilizadores:", err);
      setError("Não foi possível carregar a lista de utilizadores.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Tem a certeza que quer apagar a conta de ${userName}? Esta ação é irreversível.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      setSuccessMessage(`Utilizador ${userName} apagado com sucesso.`);
      // NOTA: Isto remove o utilizador da base de dados, mas não da Autenticação do Firebase.
      // Para uma remoção completa, seria necessário usar Firebase Functions para apagar o registo de autenticação.
    } catch (err) {
      console.error("Erro ao apagar utilizador:", err);
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

      <div className="card">
        <h2 className="card-title">Contas Criadas</h2>
        {loading ? (
          <p>A carregar utilizadores...</p>
        ) : (
          <div className="user-list">
            {users.length > 0 ? (
              users.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                    <p className="user-id">ID: {user.uid}</p>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="btn btn-danger"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Não existem utilizadores registados (excluindo administradores).</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}