// src/pages/index.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.js';
import Header from '@/components/Header.js';
import '../styles/global.css';

// --- CARD DE PRODUTO COMO UM LINK SIMPLES ---
const ProductCard = ({ product }) => (
  // Usando uma tag <a> normal para forçar a navegação
  <a href={`/products/${product.id}`} className="product-card">
    <div className="product-card-info">
      <p className="product-card-artist">{product.artist}</p>
      <h3 className="product-card-name">{product.name}</h3>
      {/* --- LINHA ALTERADA AQUI --- */}
      {/* Verifica se product.type existe antes de tentar formatá-lo */}
      <p className="product-card-category">
        {product.type && (product.type.charAt(0).toUpperCase() + product.type.slice(1))}
      </p>
      <p className="product-card-price">€{product.price.toFixed(2)}</p>
    </div>
  </a>
);

// --- LISTA DE PRODUTOS ---
const ProductList = ({ products, loading }) => {
  if (loading) return <p className="info-text">A carregar produtos...</p>;
  if (products.length === 0) return <p className="info-text">Nenhum produto encontrado.</p>;
  return (
    <div className="product-grid">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
};

// --- PÁGINA HOME ---
export default function Home() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [selectedGenres, setSelectedGenres] = useState(new Set());

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
        const fetchAllProducts = async () => {
            setLoadingProducts(true);
            const productsRef = collection(db, "products");
            const q = query(productsRef);
            const querySnapshot = await getDocs(q);
            const allProducts = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setProducts(allProducts);
            
            const genres = new Set(allProducts.map(p => p.genre).filter(Boolean));
            setAvailableGenres(Array.from(genres).sort());

            setLoadingProducts(false);
        };
        fetchAllProducts();
    }, []);

    const handleTypeChange = (type) => setSelectedTypes(p => { const n = new Set(p); n.has(type) ? n.delete(type) : n.add(type); return n; });
    const handleGenreChange = (genre) => setSelectedGenres(p => { const n = new Set(p); n.has(genre) ? n.delete(genre) : n.add(genre); return n; });
    
    const filteredProducts = products.filter(product => {
        // A lógica de filtragem foi movida para o componente _app.js,
        // mas vamos mantê-la aqui por segurança, caso seja necessária.
        const typeInProduct = product.type === 'vinil' ? 'Vinis' : 'CDs';
        const typeMatch = selectedTypes.size === 0 || selectedTypes.has(typeInProduct);
        const genreMatch = selectedGenres.size === 0 || selectedGenres.has(product.genre);
        return typeMatch && genreMatch;
    });

    return (
        <main className="page-container">
            <h2 className="page-title">Produtos</h2>
            <ProductList products={filteredProducts} loading={loadingProducts} />
        </main>
    );
}