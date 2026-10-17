import { Link } from 'react-router-dom';
import ProductGrid from '../ProductGrid';
import SectionHeader from '../SectionHeader';

function FeaturedProducts({ productos, totalCatalogo, onAddToCart }) {
  return (
    <section className="featured-section" aria-labelledby="featured-title">
      <SectionHeader
        id="featured-title"
        title="Instrumentos Destacados"
        subtitle="Una selección de los favoritos de nuestros clientes en stock inmediato."
        action={
          <Link to="/productos" className="btn btn-secondary btn-sm">
            Ver Todo el Catálogo ({totalCatalogo}) &rarr;
          </Link>
        }
      />

      <ProductGrid productos={productos} onAddToCart={onAddToCart} />
    </section>
  );
}

export default FeaturedProducts;
