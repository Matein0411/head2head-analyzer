
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 mb-8">
          <div className="flex items-center gap-4">
            <img src="/tennis-icon.png" alt="Logo TennAI" className="w-12 h-12 object-contain" />
            <div>
              <div className="text-xl font-bold text-foreground">TennAI</div>
              <div className="text-sm text-muted-foreground">Predicción avanzada de eventos deportivos de tenis</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-atp-blue transition-colors text-sm">Sobre Nosotros</a>
            <a href="#" className="text-muted-foreground hover:text-atp-blue transition-colors text-sm">Servicios</a>
            <a href="#" className="text-muted-foreground hover:text-atp-blue transition-colors text-sm">Contacto</a>
            <a href="#" className="text-muted-foreground hover:text-atp-blue transition-colors text-sm">Blog</a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-t border-border pt-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-sm text-muted-foreground">Síguenos:</span>
            <a href="#" className="text-atp-blue hover:text-blue-700 transition-colors text-2xl"><FaInstagram /></a>
            <a href="#" className="text-atp-blue hover:text-blue-700 transition-colors text-2xl"><FaTwitter /></a>
            <a href="#" className="text-atp-blue hover:text-blue-700 transition-colors text-2xl"><FaFacebook /></a>
            <a href="#" className="text-atp-blue hover:text-blue-700 transition-colors text-2xl"><FaLinkedin /></a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-atp-blue transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-atp-blue transition-colors">Términos de Uso</a>
            <a href="#" className="hover:text-atp-blue transition-colors">Cookies</a>
            <a href="#" className="hover:text-atp-blue transition-colors">Accesibilidad</a>
          </div>
        </div>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          © 2025 TennAI. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;