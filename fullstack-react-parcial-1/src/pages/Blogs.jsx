import BlogCard from '../components/blogs/BlogCard';
import { ARTICULOS_BLOG } from '../data/blogs';

function Blogs() {
  return (
    <>
      <header className="section-header">
        <h1>Blog &amp; Novedades Musicales</h1>
        <p>
          Artículos escritos por nuestros músicos y técnicos de audio para mejorar
          tu técnica y cuidar tus equipos.
        </p>
      </header>

      <div className="blog-grid">
        {ARTICULOS_BLOG.map((articulo) => (
          <BlogCard key={articulo.id} articulo={articulo} />
        ))}
      </div>
    </>
  );
}

export default Blogs;
