import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import VideoArticulo from '../components/blogs/VideoArticulo';
import { ARTICULOS_BLOG, obtenerArticuloBlog } from '../data/blogs';

function BlogDetalle() {
  const { id } = useParams();
  const articulo = obtenerArticuloBlog(id);

  const posicion = ARTICULOS_BLOG.indexOf(articulo);
  const anterior = ARTICULOS_BLOG[posicion - 1];
  const siguiente = ARTICULOS_BLOG[posicion + 1];

  // Igual que el script original: cambia el título de la pestaña según el artículo
  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = articulo.tituloPestana;
    return () => {
      document.title = tituloAnterior;
    };
  }, [articulo]);

  return (
    <>
      <nav aria-label="Migas de pan" className="blog-breadcrumb">
        <p>
          <Link to="/">Inicio</Link> &gt; <Link to="/blogs">Blogs</Link> &gt;{' '}
          <span className="blog-breadcrumb-actual">{articulo.migaDePan}</span>
        </p>
      </nav>

      <article className="blog-detail-article">
        <span className="badge badge-category blog-detail-badge">{articulo.categoria}</span>
        <h1>{articulo.titulo}</h1>

        <div className="blog-detail-meta">
          <span>✍️ Por {articulo.autor}</span>
          <span>📅 {articulo.fecha}</span>
          <span>⏱️ {articulo.lectura}</span>
        </div>

        <div className="blog-detail-content">
          <p>{articulo.introduccion}</p>

          <VideoArticulo {...articulo.video} />

          {articulo.secciones.map((seccion) => (
            <section key={seccion.titulo}>
              <h3 className="blog-detail-subtitle">{seccion.titulo}</h3>
              <p>{seccion.texto}</p>
            </section>
          ))}
        </div>

        <div className="blog-detail-nav">
          {anterior ? (
            <>
              <Link to={`/blogs/${anterior.id}`} className="btn btn-outline btn-sm">
                &larr; Anterior: {anterior.tituloCorto}
              </Link>
              <Link to="/blogs" className="btn btn-secondary btn-sm">
                Volver al Listado de Blogs &rarr;
              </Link>
            </>
          ) : (
            <>
              <Link to="/blogs" className="btn btn-secondary btn-sm">
                &larr; Volver al Listado de Blogs
              </Link>
              {siguiente && (
                <Link to={`/blogs/${siguiente.id}`} className="btn btn-outline btn-sm">
                  Siguiente: {siguiente.tituloCorto} &rarr;
                </Link>
              )}
            </>
          )}
        </div>
      </article>
    </>
  );
}

export default BlogDetalle;
