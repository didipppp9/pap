// src/context/CartContext.js
import { createContext, useContext, useState } from 'react';

// Cria o contexto, que é como um "armazém" global
const CartContext = createContext();

// Cria um atalho (hook) para ser mais fácil usar o contexto noutros componentes
export function useCart() {
  return useContext(CartContext);
}

// Este é o componente "Fornecedor" que irá conter toda a lógica do carrinho
export function CartProvider({ children }) {
  // O estado que guarda a lista de produtos no carrinho
  const [cart, setCart] = useState([]);

  // Função para adicionar um produto ao carrinho
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} foi adicionado ao carrinho!`);
  };

  // Função para remover um produto do carrinho pelo seu ID
  const removeFromCart = (productId) => {
    // Encontra o primeiro item com o ID correspondente para remover apenas uma unidade
    const indexToRemove = cart.findIndex(item => item.id === productId);
    if (indexToRemove > -1) {
      const newCart = [...cart];
      newCart.splice(indexToRemove, 1);
      setCart(newCart);
    }
  };

  // Calcula o preço total somando o preço de cada item no carrinho
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // O valor que será partilhado com todos os componentes "filho"
  const value = {
    cart,
    addToCart,
    removeFromCart,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}