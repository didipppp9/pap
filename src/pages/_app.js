import { CartProvider } from '@/context/CartContext.js';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.js';
import Header from '@/components/Header.js';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setUser(userDoc.exists() ? { uid: currentUser.uid, ...userDoc.data() } : { uid: currentUser.uid, email: currentUser.email });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
    <CartProvider>
      <Header
        user={user}
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
        user={user}
        selectedTypes={selectedTypes}
        selectedGenres={selectedGenres}
        searchTerm={searchTerm}
      />
    </CartProvider>
  );
}

export default MyApp;