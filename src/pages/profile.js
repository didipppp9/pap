// src/pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import useOrders from '@/hooks/useOrders';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import '../styles/profile.css';
import { FaMapMarkerAlt, FaCreditCard, FaClock } from 'react-icons/fa'; // Adicionar ícone de relógio

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date()); // Estado para a hora atual

  // Efeito para atualizar a hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    // Limpa o intervalo quando o componente é desmontado para evitar fugas de memória
    return () => clearInterval(timer);
  }, []);

  // ... (useEffect e handlePasswordReset existentes) ...
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setError('Email do utilizador não encontrado.');
      return;
    }
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage('Foi enviado um email para a sua conta para redefinir a palavra-passe.');
    } catch (err) {
      setError('Ocorreu um erro ao enviar o email.');
    }
  };

  // Função que calcula o estado e o tempo restante
  const getOrderStatus = (order) => {
    if (!order.createdAt) {
      return { text: "Pendente", className: "pendente", timeRemaining: null };
    }
    
    const orderDate = new Date(order.createdAt);
    const deliveryTimeInMinutes = 4; // Simulação: 2 dias = 4 minutos
    const deliveryDate = new Date(orderDate.getTime() + deliveryTimeInMinutes * 60 * 1000);

    const totalSecondsRemaining = (deliveryDate.getTime() - currentTime.getTime()) / 1000;

    if (totalSecondsRemaining <= 0) {
      return { text: "Entregue", className: "entregue", timeRemaining: null };
    }

    // Calcula os minutos e segundos restantes
    const minutes = Math.floor(totalSecondsRemaining / 60);
    const seconds = Math.floor(totalSecondsRemaining % 60);
    const timeRemaining = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

    const minutesPassed = (currentTime.getTime() - orderDate.getTime()) / (1000 * 60);
    if (minutesPassed < 2) {
      return { text: "Empacotando", className: "empacotando", timeRemaining };
    }
    
    return { text: "A caminho", className: "a-caminho", timeRemaining };
  };


  if (authLoading || ordersLoading || !user) {
    return <p className="info-text">A carregar perfil...</p>;
  }

  return (
    <div className="profile-container container">
      <h1 className="section-title">O Meu Perfil</h1>
      
      {/* ... (card de informações do utilizador) ... */}
      <div className="profile-card">
        <h2 className="profile-card-title">As minhas informações</h2>
        {message && <p className="profile-message success">{message}</p>}
        {error && <p className="profile-message error">{error}</p>}
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nome:</span>
            <span className="info-value">{user.name || 'Não definido'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tipo de Conta:</span>
            <span className="info-value">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
          </div>
        </div>
        <button onClick={handlePasswordReset} className="change-password-btn">
          Mudar Palavra-passe por Email
        </button>
      </div>

      <div className="profile-card">
        <h2 className="profile-card-title">Histórico de Compras</h2>
        <div className="purchase-history">
          {orders.length === 0 ? (
            <p className="info-text">Ainda não realizou nenhuma compra.</p>
          ) : (
            <div className="order-list">
              {orders.map(order => {
                const currentStatus = getOrderStatus(order);
                const { shippingAddress: addr } = order;
                
                return (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-date">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-PT') : 'Data indisponível'}
                      </span>
                      <span className={`order-status status-${currentStatus.className}`}>
                        {currentStatus.text}
                      </span>
                    </div>

                    {/* ... (lista de produtos) ... */}
                    <ul className="order-products">
                      {order.products.map(product => (
                      <li key={product.id} className="order-product">
                        <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="order-product-image" />
                        <div className="order-product-details">
                            <span className="product-name">{product.name}</span>
                            <span className="product-artist">{product.artist}</span>
                            <span className="product-meta">{product.type} / {product.genre}</span>
                        </div>
                        <div className="order-product-pricing">
                            <span className="product-quantity">{product.quantity}x</span>
                            <span className="product-price">€{product.price.toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                    <div className="order-extra-details">
                      <div className="detail-block">
                        <h4 className="detail-title"><FaMapMarkerAlt /> Entregue em</h4>
                        <p>{addr.firstName} {addr.lastName}</p>
                        <p>{addr.street}, {addr.doorNumber}{addr.floor && `, ${addr.floor}`}{addr.apartmentNumber && ` - ${addr.apartmentNumber}`}</p>
                        <p>{addr.postalCode}</p>
                      </div>
                      <div className="detail-block">
                        <h4 className="detail-title"><FaCreditCard /> Pagamento</h4>
                        <p>Pago com MB Way</p>
                        <p>Telemóvel: {addr.phone}</p>
                      </div>
                      {/* Bloco para o tempo de entrega */}
                      {currentStatus.timeRemaining && (
                        <div className="detail-block">
                          <h4 className="detail-title"><FaClock /> Tempo de Entrega</h4>
                          <p>A sua encomenda chega em aproximadamente:</p>
                          <p className="time-remaining">{currentStatus.timeRemaining}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="order-footer">
                      <span className="order-total">
                        Total: €{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}