// src/components/Footer.js
import Link from 'next/link';
import '../styles/footer.css'; // Importaremos os estilos que vamos criar a seguir
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Sound Station | Todos os direitos reservados.
      </div>
    </footer>
  );
}