// src/components/Header.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import '../styles/header.css';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaThLarge, FaUserCircle } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header({ availableGenres, selectedTypes, onTypeChange, selectedGenres, onGenreChange, searchTerm, onSearchChange }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { totalItems } = useCart();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="new-header">
      <a href="/" className="logo">
        <img src="/logo.png" alt="Sound Station" className="logo-icon" />
      </a>
      <div className="category-search">
        {/* ... (código do dropdown e pesquisa) ... */}
        <div className="category-dropdown">
          <button className="category-button" onClick={toggleDropdown}>
            <FaThLarge /> Filtros
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <h4 className="dropdown-heading">Tipos</h4>
              {["CDs", "Vinis"].map((type) => (
                <div key={type} className="dropdown-item">
                  <input type="checkbox" id={`type-${type}`} checked={selectedTypes.has(type)} onChange={() => onTypeChange(type)} />
                  <label htmlFor={`type-${type}`}>{type}</label>
                </div>
              ))}
              <hr className="dropdown-divider" />
              <h4 className="dropdown-heading">Géneros</h4>
              <div className="dropdown-scrollable-list">
                {availableGenres.map((genre) => (
                  <div key={genre} className="dropdown-item">
                    <input type="checkbox" id={`genre-${genre}`} checked={selectedGenres.has(genre)} onChange={() => onGenreChange(genre)} />
                    <label htmlFor={`genre-${genre}`}>{genre}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search" value={searchTerm} onChange={onSearchChange} />
        </div>
      </div>
      <div className="actions">
        <Link href="/cart" className="cart">
          <FiShoppingCart />
          <span className="cart-count">{totalItems}</span>
        </Link>
        <div className="user-actions">
          {user ? (
            <div className="user-info">
              {/* Ícone agora é um link para a página de perfil */}
              <Link href="/profile">
                <FaUserCircle className="user-icon" />
              </Link>
              <span>Olá, {user.name || user.email.split('@')[0]}</span>
              {user.role === 'admin' && (
                <Link href="/admin" className="admin-link">Painel Admin</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}