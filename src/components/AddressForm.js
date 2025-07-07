// src/components/AddressForm.js
export default function AddressForm({ address, setAddress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-card">
      <h2 className="form-card-title">Morada de Entrega</h2>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="street">Rua</label>
          <input type="text" id="street" name="street" value={address.street} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="doorNumber">Nº do Prédio</label>
          <input type="text" id="doorNumber" name="doorNumber" value={address.doorNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
            {/* Este campo já existia */}
          <label htmlFor="floor">Andar (Opcional)</label>
          <input type="text" id="floor" name="floor" value={address.floor} onChange={handleChange} />
        </div>
        
        {/* --- NOVO CAMPO ADICIONADO --- */}
        <div className="form-group">
          <label htmlFor="apartmentNumber">Nº da Porta (Opcional)</label>
          <input type="text" id="apartmentNumber" name="apartmentNumber" value={address.apartmentNumber} onChange={handleChange} />
        </div>
        {/* --- FIM DO NOVO CAMPO --- */}

        <div className="form-group">
          <label htmlFor="postalCode">Código Postal</label>
          <input type="text" id="postalCode" name="postalCode" placeholder="ex: 1234-567" value={address.postalCode} onChange={handleChange} required />
        </div>
      </div>
    </div>
  );
}