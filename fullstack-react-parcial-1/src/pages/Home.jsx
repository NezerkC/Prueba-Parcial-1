import HeroSection from '../components/home/HeroSection';
import BenefitsSection from '../components/home/BenefitsSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CustomObjectsSection from '../components/home/CustomObjectsSection';
import PromoDuocBanner from '../components/home/PromoDuocBanner';
import {
  OBJETOS_CREADOS_POR_PROGRAMADOR,
  obtenerCatalogoActivo,
} from '../data/productos';
import { useCart } from '../context/CartContext';

const CODIGOS_DESTACADOS = ['GA001', 'GE001', 'BA001', 'BT001', 'TC001', 'MI001'];

function Home() {
  const { addToCart } = useCart();
  const catalogo = obtenerCatalogoActivo();
  const filtrados = catalogo.filter((p) => CODIGOS_DESTACADOS.includes(p.codigo));
  const destacados = filtrados.length > 0 ? filtrados : catalogo.slice(0, 6);

  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturedProducts
        productos={destacados}
        totalCatalogo={catalogo.length}
        onAddToCart={addToCart}
      />
      <CustomObjectsSection objetos={OBJETOS_CREADOS_POR_PROGRAMADOR} />
      <PromoDuocBanner />
    </>
  );
}

export default Home;
