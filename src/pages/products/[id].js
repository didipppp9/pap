// src/pages/products/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.js';
import Header from '@/components/Header.js';
import '../../styles/global.css';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        setProduct(productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null);
        setLoading(false);
      };
      fetchProduct();
    }
  }, [id]);

  if (loading) return <div className="info-text">A carregar produto...</div>;
  if (!product) return <div className="info-text">Produto não encontrado.</div>;

return (

      <main className="page-container">
        <div className="product-page-container">
          <div className="product-info-column">
            {/* Título e Preço */}
            <h1 className="product-page-title">{product.name} - {product.category === 'CDs' ? 'CD' : 'LP'}</h1>
            <p className="product-page-price">€{product.price.toFixed(2)}</p>
            {/* Secção de Características */}
            <div className="product-characteristics">
              <h2>Características</h2>
              <div className="characteristic-row">
                <span className="characteristic-label">Interprete(s)</span>
                <span className="characteristic-value">{product.artist}</span>
              </div>
              <div className="characteristic-row">
                <span className="characteristic-label">Género</span>
                <span className="characteristic-value">{product.genre}</span>
              </div>
              <div className="characteristic-row">
                <span className="characteristic-label">Tipo</span>
                <span className="characteristic-value">{product.category}</span>
              </div>
            </div>
            {/* Botão Adicionar ao Carrinho */}
            <button className="add-to-cart-btn large">Adicionar ao Carrinho</button>
          </div>
        </div>
      </main>
  );
}