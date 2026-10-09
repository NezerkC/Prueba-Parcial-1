import { Link } from 'react-router-dom';

function PromoDuocBanner() {
  return (
    <section
      style={{
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '36px 24px',
        margin: '48px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      aria-labelledby="promo-duoc-title"
    >
      <span className="badge badge-free" style={{ alignSelf: 'flex-start' }}>
        Descuento Estudiantes Duoc UC
      </span>
      <h2 id="promo-duoc-title" style={{ fontSize: '1.6rem' }}>
        ¿Estudias con nosotros en la V Región?
      </h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px' }}>
        Regístrate con tu correo <strong>@duoc.cl</strong> o{' '}
        <strong>@profesor.duoc.cl</strong> y accede a calibraciones gratuitas y
        precios especiales en accesorios y cuerdas durante todo el semestre académico.
      </p>
      <div>
        <Link to="/registro" className="btn btn-primary">
          Registrar mi Cuenta
        </Link>
      </div>
    </section>
  );
}

export default PromoDuocBanner;
