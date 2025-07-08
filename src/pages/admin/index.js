// src/pages/admin/index.js
import useAdminAuth from '@/hooks/useAdminAuth';
import Link from 'next/link';
import '@/styles/admin.css'; // Adicione a importação do CSS se ainda não existir

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <p className="info-text">A verificar autorização...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Painel de Administração</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/products" className="card-link">
            <h2 className="text-2xl font-semibold text-gray-800">Gerir Produtos</h2>
            <p className="text-gray-600 mt-2">Adicionar, visualizar e remover produtos da loja.</p>
        </Link>
        {/* --- NOVO LINK ADICIONADO AQUI --- */}
        <Link href="/admin/users" className="card-link">
            <h2 className="text-2xl font-semibold text-gray-800">Gerir Utilizadores</h2>
            <p className="text-gray-600 mt-2">Visualizar e remover contas de utilizadores.</p>
        </Link>
      </div>
    </div>
  );
}