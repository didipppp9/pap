import React, { useState } from 'react';
import Link from 'next/link'; // Importar o Link
import '../styles/header.css';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaThLarge } from 'react-icons/fa';

export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="new-header">
      <div className="logo">
        <img src="/logo.png" alt="Sound Station" className="logo-icon" />
      </div>

      <div className="category-search">
        <div className="category-dropdown">
          <button className="category-button" onClick={toggleDropdown}>
            <FaThLarge /> Category
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><a href="/category/cds">CDs</a></li>
              <li><a href="/category/vinis">Vinis</a></li>
            </ul>
          )}
        </div>

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
        {/* O botão agora é um link para a página de login */}
        <Link href="/login" passHref>
          <button className="login-btn">Login</button>
        </Link>
      </div>
    </header>
  );
}