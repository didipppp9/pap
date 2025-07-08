// src/pages/products/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import '../../styles/global.css';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
        <div className="product-image-gallery">
          <div className="product-main-image-container">
            <img 
              src={product.imageUrl || '/placeholder.png'} 
              alt={product.name}
              className="product-main-image"
            />
          </div>
        </div>

        <div className="product-info-column">
          <h1 className="product-page-title">{product.name}</h1>
          {/* INDICADOR DE EDIÇÃO ESPECIAL */}
          {product.isSpecialEdition && <div className="special-edition-tag-detail">Edição Especial</div>}
          
          <p className="product-page-price">€{product.price.toFixed(2)}</p>
          
          <button onClick={() => addToCart(product)} className="add-to-cart-btn large">
            Adicionar ao Carrinho
          </button>

          <div className="product-characteristics">
            <h2>Características</h2>
            <div className='characteristic-row'>
              <span className='characteristic-label'>Artista</span>
              <span className='characteristic-value'>{product.artist}</span>
            </div>
            <div className='characteristic-row'>
              <span className='characteristic-label'>Género</span>
              <span className='characteristic-value'>{product.genre}</span>
            </div>
            <div className='characteristic-row'>
              <span className='characteristic-label'>Tipo</span>
              <span className='characteristic-value'>{product.type}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}