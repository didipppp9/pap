// Exemplo em src/pages/index.js
import { auth } from '@/lib/firebase'; // Importe a instância do auth
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import '../styles/global.css';
import Header from '@/components/Header';

export default function Home() {
  const [user, setUser] = useState(null);

  // Exemplo para observar o estado da autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Utilizador autenticado:", currentUser);
        setUser(currentUser);
      } else {
        console.log("Nenhum utilizador autenticado.");
        setUser(null);
      }
    });

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);


  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 text-gray-900">
        {/* Conteúdo da página aqui */}
        {user ? <p>Bem-vindo, {user.email}!</p> : <p>Por favor, faça login.</p>}
      </main>
    </>
  );
}