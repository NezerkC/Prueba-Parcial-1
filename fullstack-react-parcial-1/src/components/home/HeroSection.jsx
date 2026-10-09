import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-tag">11 Años de Trayectoria</div>
        <h1 className="hero-title">
          Tu Sonido, Tu Pasión, <span>En Vivo</span>.
        </h1>
        <p className="hero-subtitle">
          Equipamos a bandas, estudiantes y productores de la V Región y todo Chile
          con las mejores marcas mundiales: Fender, Yamaha, Roland, Marshall, Shure y
          más.
        </p>
        <div className="hero-actions">
          <Link to="/productos" className="btn btn-primary">
            Explorar Catálogo Oficial
          </Link>
          <Link to="/nosotros" className="btn btn-outline">
            Conoce Nuestra Tienda
          </Link>
        </div>

        <div className="hero-video-box">
          <div className="video-card-container">
            <video
              controls
              poster="/assets/img/thumb_promo.jpg"
              preload="metadata"
              playsInline
              className="responsive-video"
            >
              <source
                src="/assets/img/video_promocional_tienda.mp4"
                type="video/mp4"
              />
              Tu navegador no soporta la reproducción de video HTML5.
            </video>
          </div>
          <div className="hero-video-caption">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span>
              Conoce en video la experiencia Sonido Vivo en nuestra tienda de Viña del
              Mar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
