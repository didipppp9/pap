// src/components/FeedbackModal.js
import { useState } from 'react';
import '../styles/FeedbackModal.css';

export default function FeedbackModal({ show, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback enviado:", feedback); // Numa app real, enviaria para a base de dados
    setSubmitted(true);
    setTimeout(() => {
      onClose(); // Fecha o modal após 2 segundos
    }, 2000);
  };

  const handleDontShowAgain = () => {
    // Guarda a preferência no localStorage do navegador
    localStorage.setItem('hideFeedbackModal', 'true');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">&times;</button>
        {submitted ? (
          <div className="thank-you-message">
            <h3>Obrigado!</h3>
            <p>O seu feedback é muito importante para nós.</p>
          </div>
        ) : (
          <>
            <h2>Como foi a sua experiência?</h2>
            <p>A sua opinião ajuda-nos a melhorar o nosso site.</p>
            <form onSubmit={handleSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Deixe aqui o seu feedback..."
                rows="4"
                required
              />
              <div className="modal-actions">
                <button type="submit" className="btn-submit">Enviar Feedback</button>
                <button type="button" onClick={handleDontShowAgain} className="btn-secondary">
                  Não mostrar novamente
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}