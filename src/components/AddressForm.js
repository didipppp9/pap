// src/components/AddressForm.js
export default function AddressForm({ address, setAddress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Adiciona uma validação específica para o campo 'floor' (andar)
    if (name === 'floor') {
      // Esta expressão regular (regex) verifica se o valor contém:
      // - ^     : O início da string
      // - \d* : Zero ou mais dígitos (números)
      // - [a-zA-Z]? : Zero ou uma letra (maiúscula ou minúscula)
      // - $     : O fim da string
      const isValidFloor = /^\d*[a-zA-Z]?$/.test(value);
      
      // Só atualiza o estado se o valor for válido
      if (isValidFloor) {
        setAddress((prev) => ({ ...prev, [name]: value.toUpperCase() })); // Converte a letra para maiúscula
      }
    } else {
      // Para todos os outros campos, o comportamento mantém-se o mesmo
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-card-title">Detalhes de Entrega</h2>
      <div className="form-grid">
        {/* --- CAMPOS EXISTENTES --- */}
        <div className="form-group">
          <label htmlFor="firstName">Nome</label>
          <input type="text" id="firstName" name="firstName" value={address.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Apelido</label>
          <input type="text" id="lastName" name="lastName" value={address.lastName} onChange={handleChange} required />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="street">Rua</label>
          <input type="text" id="street" name="street" value={address.street} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="doorNumber">Nº do Prédio</label>
          <input type="text" id="doorNumber" name="doorNumber" value={address.doorNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="floor">Andar (Opcional)</label>
          {/* O input para o andar já está a usar a nova lógica de validação */}
          <input type="text" id="floor" name="floor" value={address.floor} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="apartmentNumber">Nº da Porta (Opcional)</label>
          <input type="text" id="apartmentNumber" name="apartmentNumber" value={address.apartmentNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Código Postal</label>
          <input type="text" id="postalCode" name="postalCode" placeholder="ex: 1234-567" value={address.postalCode} onChange={handleChange} required />
        </div>
      </div>
    </div>
  );
}