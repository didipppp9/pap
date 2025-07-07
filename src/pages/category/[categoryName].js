// src/pages/category/[categoryName].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function CategoryPage() {
  const router = useRouter();
  const { categoryName } = router.query; // Pega o nome da categoria do URL (ex: "cds")

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esta função corre sempre que o 'categoryName' no URL muda
    if (categoryName) {
      const fetchProductsByCategory = async () => {
        setLoading(true);
        try {
          // Mapeia o nome do URL para o valor na base de dados ('vinis' -> 'vinil')
          const typeFilter = categoryName === 'vinis' ? 'vinil' : 'cd';

          // Cria uma query ao Firebase para ir buscar apenas os produtos
          // ONDE (where) o campo 'type' é igual ao nosso filtro
          const q = query(
            collection(db, "products"), 
            where("type", "==", typeFilter),
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(productsData);
        } catch (error) {
          console.error("Erro ao buscar produtos por categoria: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductsByCategory();
    }
  }, [categoryName]);

  // Define um título mais amigável para a página
  const pageTitle = categoryName === 'vinis' ? 'Vinis' : 'CDs';

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container py-8 mx-auto">
        <div className="product-section">
          <h2 className="section-title">Categoria: {pageTitle}</h2>
          {loading ? (
            <p>A carregar produtos...</p>
          ) : (
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
              ) : (
                <p>Não foram encontrados produtos nesta categoria.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}