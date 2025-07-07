// src/components/MbwayPayment.js
export default function MbwayPayment({ address, setAddress }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddress((prev) => ({ ...prev, [name]: value }));
    };
  
    return (
      <div className="form-card">
        <h2 className="form-card-title">Pagamento por MB Way</h2>
        <div className="form-group">
          <label htmlFor="phone">Número de Telemóvel</label>
          <input type="tel" id="phone" name="phone" placeholder="912 345 678" value={address.phone} onChange={handleChange} required />
        </div>
      </div>
    );
  }