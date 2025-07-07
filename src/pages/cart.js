// src/pages/cart.js
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import '@/styles/global.css';

export default function CartPage() {
  // Usamos o nosso hook para aceder aos dados e funções do carrinho
  const { cart, removeFromCart, totalPrice } = useCart();

  const handleCheckout = () => {
    // No futuro, esta função irá iniciar o processo de pagamento
    alert('Funcionalidade de Finalizar Compra ainda não implementada!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="section-title">Carrinho de Compras</h1>
      
      {/* Se o carrinho estiver vazio, mostra uma mensagem */}
      {cart.length === 0 ? (
        <div className="text-center">
          <p>O seu carrinho está vazio.</p>
          <Link href="/" className="text-cyan-600 hover:underline mt-4 inline-block">
            Voltar à loja
          </Link>
        </div>
      ) : (
        // Se houver itens, mostra a lista e o resumo
        <div className="cart-layout">
          {/* Coluna dos Itens */}
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

          {/* Coluna do Resumo */}
          <div className="cart-summary">
            <h2 className="summary-title">Resumo do Pedido</h2>
            <div className="summary-line">
              <span>Total</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}