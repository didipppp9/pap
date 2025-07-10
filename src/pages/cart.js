// src/pages/cart.js
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import '@/styles/cart.css'; 

export default function CartPage() {
  const { cart, loading, updateQuantity, totalPrice } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="section-title">Carrinho de Compras</h1>
        <p>A carregar carrinho...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="section-title">Carrinho de Compras</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>O seu carrinho está vazio.</p>
          <Link href="/" className="back-to-shop-link">Voltar à loja</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-artist">{item.artist}</p>
                </div>
                <div className="item-price-actions">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="item-price">€{(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => updateQuantity(item.id, 0)} className="remove-btn">
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
            <Link href="/checkout" className="checkout-btn">Finalizar Compra</Link>
          </div>
        </div>
      )}
    </div>
  );
}