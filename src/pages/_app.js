// src/pages/_app.js
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importar o useRouter
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import Header from '@/components/Header.js';
import Footer from '@/components/Footer.js';
import Head from 'next/head';
import FeedbackModal from '@/components/FeedbackModal'; // Importar o novo modal
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter(); // Usar o router

  // ... (código existente para os filtros)

  // Efeito para verificar se o modal deve ser mostrado
  useEffect(() => {
    // Verifica se a "bandeira" do sessionStorage existe
    const shouldShow = sessionStorage.getItem('showFeedbackModal');
    // Verifica se o utilizador já pediu para não ver o modal
    const isHidden = localStorage.getItem('hideFeedbackModal') === 'true';
    
    if (shouldShow && !isHidden) {
      setShowFeedback(true);
      // Remove a bandeira para não mostrar novamente na mesma sessão
      sessionStorage.removeItem('showFeedbackModal');
    }
  }, [router.asPath]); // Executa este efeito sempre que a rota muda

  const handleCloseModal = () => {
    setShowFeedback(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Head>
          {/* ... */}
        </Head>
        
        {/* Adiciona o Modal à aplicação */}
        <FeedbackModal show={showFeedback} onClose={handleCloseModal} />

        <div className="app-wrapper">
          <Header
            // ... (props existentes)
          />
          <main className="main-content">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;