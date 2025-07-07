// src/pages/admin/index.js
import useAdminAuth from '@/hooks/useAdminAuth';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <p className="text-center p-8">A verificar autorização...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
      <div className="max-w-md">
        <Link href="/admin/products" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800">Gerir Produtos</h2>
            <p className="text-gray-600 mt-2">Adicionar, visualizar e remover produtos da loja.</p>
        </Link>
      </div>
    </div>
  );
}