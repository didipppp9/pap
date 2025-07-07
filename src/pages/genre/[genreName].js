// src/pages/genre/[genreName].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const capitalize = (s) => s ? s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

export default function GenrePage() {
  const router = useRouter();
  const { genreName } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genreName) {
      const fetchProductsByGenre = async () => {
        setLoading(true);
        const q = query(
          collection(db, "products"), 
          where("genre", "==", genreName),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      };
      fetchProductsByGenre();
    }
  }, [genreName]);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container py-8 mx-auto">
        <h2 className="section-title">Género: {capitalize(genreName)}</h2>
        {loading ? <p>A carregar produtos...</p> : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(product => (
                <Link href={`/product/${product.id}`} key={product.id} passHref>
                  <div className="product-card">
                    <div className="product-card-body">
                      <p className="product-artist">{product.artist}</p>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">€{parseFloat(product.price).toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : <p>Não foram encontrados produtos neste género.</p>}
          </div>
        )}
      </div>
    </main>
  );
}