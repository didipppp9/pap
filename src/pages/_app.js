// src/pages/_app.js
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import Header from '@/components/Header.js';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  const [availableGenres, setAvailableGenres] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      const genres = new Set(querySnapshot.docs.map(d => d.data().genre).filter(Boolean));
      setAvailableGenres(Array.from(genres).sort());
    };
    fetchGenres();
  }, []);

  const handleTypeChange = (type) => setSelectedTypes(p => { const n = new Set(p); n.has(type) ? n.delete(type) : n.add(type); return n; });
  const handleGenreChange = (genre) => setSelectedGenres(p => { const n = new Set(p); n.has(genre) ? n.delete(genre) : n.add(genre); return n; });
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <AuthProvider>
      <CartProvider>
        <Header
          availableGenres={availableGenres}
          selectedTypes={selectedTypes}
          onTypeChange={handleTypeChange}
          selectedGenres={selectedGenres}
          onGenreChange={handleGenreChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <Component
          {...pageProps}
          selectedTypes={selectedTypes}
          selectedGenres={selectedGenres}
          searchTerm={searchTerm}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;