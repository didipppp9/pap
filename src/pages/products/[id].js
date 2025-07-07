// src/pages/products/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.js';
import Header from '@/components/Header.js';
import '../../styles/global.css';
import { useCart } from '@/context/CartContext'; // 1. Importar o hook useCart

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { addToCart } = useCart(); // 2. Obter a função addToCart a partir do hook

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
            {/* ... */}
          </div>
          {/* 3. Chamar a função no clique do botão */}
          <button onClick={() => addToCart(product)} className="add-to-cart-btn large">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </main>
  );
}