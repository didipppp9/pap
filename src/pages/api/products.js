// src/pages/api/products.js
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Importa a configuração do Firebase

export default async function handler(req, res) {
  // Esta API só responde a pedidos GET
  if (req.method === 'GET') {
    // Pega nos filtros do URL, ex: ?type=cd&genre=nu-metal
    const { type, genre } = req.query;

    try {
      // 1. Vai buscar TODOS os produtos ao Firestore, ordenados pelos mais recentes
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2. Filtra no servidor com base nos parâmetros do URL
      // Filtra por TIPO (se existir)
      if (type) {
        const typeFilters = Array.isArray(type) ? type : [type];
        products = products.filter(p => typeFilters.includes(p.type));
      }

      // Filtra por GÉNERO (se existir)
      if (genre) {
        const genreFilters = Array.isArray(genre) ? genre : [genre];
        products = products.filter(p => genreFilters.includes(p.genre));
      }

      // 3. Devolve apenas os produtos que passaram nos filtros
      res.status(200).json({ products });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Se o método não for GET, recusa o pedido
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}