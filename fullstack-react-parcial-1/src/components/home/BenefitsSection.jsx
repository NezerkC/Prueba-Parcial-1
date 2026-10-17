import { Col, Row } from 'react-bootstrap';
import BenefitCard from './BenefitCard';

const BENEFICIOS = [
  {
    indicador: '01',
    titulo: 'Despacho a Todo Chile',
    texto: 'Envíos rápidos y asegurados a todo Chile con atención personalizada.',
  },
  {
    indicador: '02',
    titulo: 'Garantía y Servicio Oficial',
    texto:
      'Todos nuestros instrumentos cuentan con garantía técnica y servicio de calibración profesional.',
  },
  {
    indicador: '03',
    titulo: 'Asesoría por Músicos',
    texto:
      'Nuestro equipo está integrado por músicos experimentados que te orientarán según tu estilo.',
  },
];

function BenefitsSection() {
  return (
    <section
      className="benefits-section"
      aria-label="Ventajas de comprar en Sonido Vivo"
    >
      <Row className="g-4">
        {BENEFICIOS.map((b) => (
          <Col md={4} key={b.indicador}>
            <BenefitCard {...b} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default BenefitsSection;
