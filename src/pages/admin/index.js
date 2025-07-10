// src/pages/admin/index.js
import useAdminAuth from '@/hooks/useAdminAuth';
import Link from 'next/link';
import '@/styles/admin.css';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    // Pode criar um componente de loading mais robusto se desejar
    return <p className="info-text">A verificar autorização...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    // Novo container para o layout de duas colunas
    <div className="admin-dashboard-layout">
      {/* Painel da Esquerda */}
      <Link href="/admin/products" className="dashboard-panel left-panel">
        <div className="panel-content">
          <h2>Gerir Produtos</h2>
        </div>
      </Link>
      
      {/* Painel da Direita */}
      <Link href="/admin/users" className="dashboard-panel right-panel">
        <div className="panel-content">
          <h2>Gerir Utilizadores</h2>
        </div>
      </Link>
    </div>
  );
}