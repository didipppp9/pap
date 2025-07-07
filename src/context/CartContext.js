// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const savedCart = window.localStorage.getItem('shopping-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('shopping-cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} foi adicionado ao carrinho!`);
  };

  const removeFromCart = (productId) => {
    const indexToRemove = cart.findIndex(item => item.id === productId);
    if (indexToRemove > -1) {
      const newCart = [...cart];
      newCart.splice(indexToRemove, 1);
      setCart(newCart);
    }
  };
  
  // Nova função para limpar o carrinho
  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    totalPrice,
    clearCart, // Adicionar a função ao contexto
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}