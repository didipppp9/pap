// src/pages/checkout.js
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';
import AddressForm from '@/components/AddressForm';
import MbwayPayment from '@/components/MbwayPayment';
import '@/styles/checkout.css';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Adicionar firstName e lastName ao estado inicial
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    doorNumber: '',
    floor: '',
    apartmentNumber: '',
    postalCode: '',
    phone: '',
  });

  const handleProcessOrder = () => {
    // Adicionar validação para firstName e lastName
    if (!address.firstName || !address.lastName || !address.street || !address.doorNumber || !address.postalCode || !address.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    console.log('Encomenda a ser processada:', {
      products: cart,
      total: totalPrice,
      shippingAddress: address,
    });

    alert('Encomenda finalizada com sucesso! Obrigado pela sua compra.');
    
    clearCart();
    router.push('/');
  };
  
  if (!isClient) {
    return (
        <div className="container checkout-container">
            <h1 className="section-title">Finalizar Compra</h1>
            <p>A carregar...</p>
        </div>
    );
  }

  if (cart.length === 0) {
    router.push('/');
    return null;
  }

  return (
    <div className="container checkout-container">
      <h1 className="section-title">Finalizar Compra</h1>
      <div className="checkout-layout">
        <div className="forms-section">
          <AddressForm address={address} setAddress={setAddress} />
          <MbwayPayment address={address} setAddress={setAddress} />
        </div>

        <div className="order-summary-section">
          <div className="cart-summary">
            <h2 className="summary-title">Resumo da Encomenda</h2>
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="summary-item">
                <span>{item.name}</span>
                <span>€{item.price.toFixed(2)}</span>
              </div>
            ))}
            <hr className="summary-divider" />
            <div className="summary-line total">
              <span>Total</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={handleProcessOrder} className="checkout-btn">
              Pagar com MB Way
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}