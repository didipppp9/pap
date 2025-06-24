import React from 'react';
import '../styles/header.css';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaThLarge } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="new-header">
      <div className="logo">
        <img src="/logo.png" alt="Sound Station" className="logo-icon" />
      </div>

      <div className="category-search">
        <button className="category-btn">
          <FaThLarge /> Category
        </button>

        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="actions">
        <div className="cart">
          <FiShoppingCart />
          <span className="cart-count">0</span>
        </div>
        <button className="login-btn">Login</button>
      </div>
    </header>
  );
}
