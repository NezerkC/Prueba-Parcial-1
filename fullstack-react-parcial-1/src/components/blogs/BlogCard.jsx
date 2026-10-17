import { Link } from 'react-router-dom';

function BlogCard({ articulo }) {
  return (
    <article className="blog-card">
      <div className="blog-card-thumb blog-card-thumb--video">
        <img src={articulo.miniatura} alt={articulo.altMiniatura} />
        <span className="blog-video-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>{' '}
          {articulo.etiquetaVideo}
        </span>
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          {articulo.categoriaListado} • {articulo.fechaListado}
        </div>
        <h2 className="blog-card-title">{articulo.titulo}</h2>
        <p className="blog-card-desc">{articulo.resumen}</p>
        <div className="blog-card-action">
          <Link to={`/blogs/${articulo.id}`} className="btn btn-primary btn-sm">
            Leer Artículo Completo &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
