// src/pages/cart.js
import { useCart } from '@/context/CartContext'; //
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Importar useState e useEffect
import '@/styles/cart.css'; 

export default function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();

  // Estado para verificar se estamos no cliente
  const [isClient, setIsClient] = useState(false);

  // useEffect para garantir que o código só corre no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enquanto não estivermos no cliente, mostramos um estado de carregamento
  // para evitar o erro de hidratação.
  if (!isClient) {
    return (
        <div className="container mx-auto p-8">
            <h1 className="section-title">Carrinho de Compras</h1>
            <p>A carregar...</p>
        </div>
    );
  }

  // Quando isClient for true, renderizamos o conteúdo real do carrinho
  return (
    <div className="container mx-auto p-8">
      <h1 className="section-title">Carrinho de Compras</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>O seu carrinho está vazio.</p>
          <Link href="/" className="back-to-shop-link">
            Voltar à loja
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-artist">{item.artist}</p>
                </div>
                <div className="item-price-actions">
                  <p className="item-price">€{item.price.toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Resumo do Pedido</h2>
            <div className="summary-line">
              <span>Total</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="checkout-btn">
              Finalizar Compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}