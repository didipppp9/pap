// src/components/Header.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import '../styles/header.css';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaThLarge, FaUserCircle } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

const productTypes = ["CDs", "Vinis"];

export default function Header({
  user,
  availableGenres,
  selectedTypes,
  onTypeChange,
  selectedGenres,
  onGenreChange
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { cart } = useCart();

  // Estado para verificar se estamos no lado do cliente
  const [isClient, setIsClient] = useState(false);

  // useEffect só corre no cliente, garantindo que o estado é atualizado após a montagem
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="new-header">
      <Link href="/" className="logo">
        <img src="/logo.png" alt="Sound Station" className="logo-icon" />
      </Link>

      {/* Navbar com Filtros e Pesquisa */}
      <div className="category-search">
        
        {/* Envolvemos o menu de filtros na verificação 'isClient' */}
        {isClient && (
          <div className="category-dropdown">
            <button className="category-button" onClick={toggleDropdown}>
              <FaThLarge /> Filtros
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <h4 className="dropdown-heading">Tipos</h4>
                {productTypes.map((type) => (
                  <div key={type} className="dropdown-item">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={selectedTypes.has(type)}
                      onChange={() => onTypeChange(type)}
                    />
                    <label htmlFor={`type-${type}`}>{type}</label>
                  </div>
                ))}
                
                <hr className="dropdown-divider" />

                <h4 className="dropdown-heading">Géneros</h4>
                <div className="dropdown-scrollable-list">
                  {availableGenres.map((genre) => (
                    <div key={genre} className="dropdown-item">
                      <input
                        type="checkbox"
                        id={`genre-${genre}`}
                        checked={selectedGenres.has(genre)}
                        onChange={() => onGenreChange(genre)}
                      />
                      <label htmlFor={`genre-${genre}`}>{genre}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      {/* Ações: Carrinho e Utilizador */}
      <div className="actions">
        <Link href="/cart" className="cart">
          <FiShoppingCart />
          <span className="cart-count">
            {isClient ? cart.length : 0}
          </span>
        </Link>
        
        <div className="user-actions">
          {user ? (
            <div className="user-info">
              <FaUserCircle className="user-icon" />
              <span>Olá, {user.name || user.email.split('@')[0]}</span>
              {user.role === 'admin' && (
                <Link href="/admin" className="admin-link">
                  Painel Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}