// src/pages/index.js
import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';

// Função auxiliar para verificar se a promoção está ativa
const isPromoActive = (product) => {
  if (!product.promoPrice || !product.promoStartDate || !product.promoEndDate) {
    return false;
  }
  const now = new Date();
  const startDate = new Date(product.promoStartDate);
  const endDate = new Date(product.promoEndDate);
  endDate.setHours(23, 59, 59, 999); // Promoção válida até ao final do dia
  return now >= startDate && now <= endDate;
};

// --- CARD DE PRODUTO ---
const ProductCard = ({ product }) => {
  const onSale = isPromoActive(product);

  return (
    <a href={`/products/${product.id}`} className="product-card">
      <div className="product-card-image-container">
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          className="product-card-image"
        />
        {product.isSpecialEdition && <div className="special-edition-tag">Limited Edition</div>}
        {onSale && <div className="promo-tag">Promoção!</div>} {/* Etiqueta de promoção */}
      </div>
      <div className="product-card-info">
        <p className="product-card-artist">{product.artist}</p>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-category">
          {product.type && (product.type.charAt(0).toUpperCase() + product.type.slice(1))}
        </p>
        <div className="price-container">
          {onSale ? (
            <>
              <span className="promo-price">€{product.promoPrice.toFixed(2)}</span>
              <span className="original-price">€{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="product-card-price">€{product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </a>
  );
};


// --- LISTA DE PRODUTOS ---
const ProductList = ({ products, loading }) => {
  if (loading) return <p className="info-text">A carregar produtos...</p>;
  if (!products || products.length === 0) return <p className="info-text">Nenhum produto encontrado.</p>;
  return (
    <div className="product-grid">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
};

// --- PÁGINA HOME ---
export default function Home({ selectedTypes, selectedGenres, searchTerm }) {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Efeito para ir buscar todos os produtos à base de dados uma única vez
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            const productsRef = collection(db, "products");
            const q = query(productsRef);
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setAllProducts(productsData);
            setLoading(false);
        };
        fetchAllProducts();
    }, []);

    // Filtra os produtos com base nos filtros e pesquisa recebidos
    const filteredProducts = allProducts.filter(product => {
        if (product.isActive === false) {
          return false;
        }

        const typeInProduct = product.type === 'vinil' ? 'Vinis' : 'CDs';
        
        const typeMatch = !selectedTypes || selectedTypes.size === 0 || selectedTypes.has(typeInProduct);
        const genreMatch = !selectedGenres || selectedGenres.size === 0 || selectedGenres.has(product.genre);
        const searchMatch = !searchTerm ||
                            (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (product.artist && product.artist.toLowerCase().includes(searchTerm.toLowerCase()));

        return typeMatch && genreMatch && searchMatch;
    });

    return (
        <main className="page-container">
            <h2 className="page-title">Produtos</h2>
            <ProductList products={filteredProducts} loading={loading} />
        </main>
    );
}