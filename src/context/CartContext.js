// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Vamos criar este novo contexto

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const cartRef = collection(db, 'users', user.uid, 'cart');
      const unsubscribe = onSnapshot(cartRef, (snapshot) => {
        const cartData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setCart(cartData);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Se não houver utilizador, o carrinho fica vazio
      setCart([]);
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      alert("Por favor, faça login para adicionar produtos ao carrinho.");
      return;
    }
    
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const productRef = doc(cartRef, product.id);

    // Verifica se o produto já existe no carrinho
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // Se existe, incrementa a quantidade
      await setDoc(productRef, { ...existingItem, quantity: existingItem.quantity + 1 });
    } else {
      // Se não existe, adiciona com quantidade 1
      await setDoc(productRef, { ...product, quantity: 1 });
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user) return;
    const productRef = doc(db, 'users', user.uid, 'cart', productId);
    if (newQuantity > 0) {
      await setDoc(productRef, { quantity: newQuantity }, { merge: true });
    } else {
      // Remove o item se a quantidade for 0 ou menos
      await deleteDoc(productRef);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    const productRef = doc(db, 'users', user.uid, 'cart', productId);
    await deleteDoc(productRef);
  };
  
  const clearCart = async () => {
    if (!user) return;
    const cartSnapshot = await getDocs(collection(db, 'users', user.uid, 'cart'));
    cartSnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}