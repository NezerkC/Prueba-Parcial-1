import { Col, Row } from 'react-bootstrap';
import DatosTienda from '../components/contacto/DatosTienda';
import FormularioContacto from '../components/contacto/FormularioContacto';
import HorariosAtencion from '../components/contacto/HorariosAtencion';
import MapaUbicacion from '../components/contacto/MapaUbicacion';

function Contacto() {
  return (
    <>
      <header className="section-header">
        <h1>Contactate con Sonido Vivo</h1>
        <p>
          Estamos a pasos de la Plaza Vergara en pleno centro de Viña del Mar.
          Respondemos tus consultas en el día.
        </p>
      </header>

      <Row className="g-4 mt-2">
        {/* Columna 1: Formulario con validación */}
        <Col md={6}>
          <FormularioContacto />
        </Col>

        {/* Columna 2: Datos físicos, horarios y mapa */}
        <Col md={6}>
          <div className="contacto-info">
            <DatosTienda />
            <HorariosAtencion />
            <MapaUbicacion />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Contacto;
