// src/pages/admin/products.js
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot, serverTimestamp, deleteDoc } from 'firebase/firestore';
import useAdminAuth from '@/hooks/useAdminAuth';
import '@/styles/admin.css';

export default function ManageProducts() {
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado do formulário
  const [isEditing, setIsEditing] = useState(null);
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [type, setType] = useState('cd');
  const [genre, setGenre] = useState('alt metal');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSpecialEdition, setIsSpecialEdition] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const genres = ["Alt Metal", "Grunge", "Groove Metal", "Metalcore", "Nu-Metal", "Punk Rock", "Speed Metal", "Trash Metal"];

  useEffect(() => {
    if (!isAdmin) return;
    const productsCollection = collection(db, 'products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      setFilteredProducts(productList);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.artist && product.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const resetForm = () => {
    setIsEditing(null);
    setName('');
    setArtist('');
    setType('cd');
    setGenre('alt metal');
    setPrice('');
    setImageUrl('');
    setIsSpecialEdition(false);
    setIsActive(true);
    if (document.getElementById('product-form')) {
      document.getElementById('product-form').reset();
    }
  };
  
  const handleEditClick = (product) => {
    setSuccessMessage('');
    setError('');
    setIsEditing(product.id);
    setName(product.name);
    setArtist(product.artist || '');
    setType(product.type);
    setGenre(product.genre);
    setPrice(product.price);
    setImageUrl(product.imageUrl || '');
    setIsSpecialEdition(product.isSpecialEdition || false);
    setIsActive(product.isActive !== false);
    window.scrollTo(0, 0);
  };

  const handleToggleActive = async (product) => {
    const newStatus = !(product.isActive !== false);
    const productRef = doc(db, 'products', product.id);
    try {
      await updateDoc(productRef, { isActive: newStatus });
      setSuccessMessage(`Produto ${product.name} foi ${newStatus ? 'ativado' : 'desativado'}.`);
    } catch (err) {
      setError("Erro ao atualizar o estado do produto.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !artist) {
      setError('Nome, Artista e Preço são campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const productData = { name, artist, type, genre, price: parseFloat(price), imageUrl, isSpecialEdition, isActive };

      if (isEditing) {
        await updateDoc(doc(db, 'products', isEditing), productData);
        setSuccessMessage('Produto atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'products'), { ...productData, createdAt: serverTimestamp() });
        setSuccessMessage('Produto adicionado com sucesso!');
      }
      resetForm();
    } catch (err) {
      console.error("Erro ao guardar o produto:", err);
      setError(`Ocorreu um erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm(`Tem a certeza que quer apagar este produto?`)) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao apagar o produto.');
    }
  };
  
  if (adminLoading) return <p className="text-center p-8">A verificar autorização...</p>;
  if (!isAdmin) return null;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Gerir Produtos</h1>

      {/* FORMULÁRIO DE ADICIONAR/EDITAR PRODUTO */}
      <div className="card">
        <h2 className="card-title">{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        
        {error && <p className="error-text">{error}</p>}
        {successMessage && <p style={{color: '#16a34a', marginBottom: '1rem', fontWeight: '500'}}>{successMessage}</p>}

        <form id="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nome do Produto</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="artist" className="form-label">Artista / Banda</label>
              <input type="text" id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} className="form-input" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="imageUrl" className="form-label">URL da Imagem</label>
              <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-input" placeholder="Ex: /images/album.jpg" />
            </div>
            <div className="form-group">
              <label htmlFor="price" className="form-label">Preço (€)</label>
              <input type="number" step="0.01" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="type" className="form-label">Tipo</label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="form-select">
                <option value="cd">CD</option>
                <option value="vinil">Vinil</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="genre" className="form-label">Género</label>
              <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="form-select">
                {genres.map(g => <option key={g} value={g.toLowerCase()}>{g}</option>)}
              </select>
            </div>
             <div className="form-group full-width">
                <div className="styled-checkbox-container">
                  <label htmlFor="isSpecialEdition" className="styled-checkbox-label">Limited Edition</label>
                  <input type="checkbox" id="isSpecialEdition" checked={isSpecialEdition} onChange={(e) => setIsSpecialEdition(e.target.checked)} className="styled-checkbox-input" />
                </div>
              </div>
          </div>
          
          <div className="form-actions" style={{marginTop: '1rem'}}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'A guardar...' : (isEditing ? 'Atualizar Produto' : 'Adicionar Produto')}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA DE PRODUTOS EXISTENTES */}
      <div className="card">
        <div className="list-header">
          <h2 className="card-title">Produtos Existentes</h2>
          <input type="text" placeholder="Procurar produtos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input" style={{width: 'auto'}}/>
        </div>
        <div className="product-list">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <div key={product.id} className={`product-item ${!(product.isActive !== false) ? 'inactive' : ''}`}>
              <div className="product-info">
                <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="product-thumbnail" />
                <div className="product-details">
                  <p className="name">
                    {product.name}
                    {product.isSpecialEdition && <span className="special-edition-tag-admin">Limited</span>}
                  </p>
                  <p className="artist">{product.artist}</p>
                  <p className="price">€{product.price.toFixed(2)}</p>
                  <p className="meta">{product.type} / {product.genre}</p>
                </div>
              </div>
              <div className="product-actions">
                <div className="status-toggle">
                  <span>{product.isActive !== false ? 'Ativo' : 'Inativo'}</span>
                  <label className="switch">
                    <input type="checkbox" checked={product.isActive !== false} onChange={() => handleToggleActive(product)} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <button onClick={() => handleEditClick(product)} className="btn btn-warning">Editar</button>
                <button onClick={() => handleDelete(product.id)} className="btn btn-danger">Apagar</button>
              </div>
            </div>
          )) : <p>Nenhum produto encontrado.</p>}
        </div>
      </div>
    </div>
  );
}