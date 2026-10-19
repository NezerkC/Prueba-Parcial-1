import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../SectionHeader';
import CustomObjectCard from './CustomObjectCard';
import ModalCrearObjeto from './ModalCrearObjeto';
import { useAuth } from '../../context/AuthContext';
import { OBJETOS_CREADOS_POR_PROGRAMADOR } from '../../data/productos';

const STORAGE_KEY_OBJETOS = 'sonido_vivo_objetos_admin_v1';

function CustomObjectsSection({ objetos = OBJETOS_CREADOS_POR_PROGRAMADOR, onAddToCart }) {
  const { isAdmin } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const [listaObjetos, setListaObjetos] = useState(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY_OBJETOS);
      return guardados ? JSON.parse(guardados) : objetos;
    } catch (error) {
      console.error('Error al cargar objetos propios desde localStorage:', error);
      return objetos;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OBJETOS, JSON.stringify(listaObjetos));
    } catch (error) {
      console.error('Error al persistir objetos propios:', error);
    }
  }, [listaObjetos]);

  const handleGuardarObjeto = (datosNuevo) => {
    const siguienteNumero = listaObjetos.length + 1;
    const nuevoId = `SRV-${String(siguienteNumero).padStart(3, '0')}`;

    const objetoCompleto = {
      id: nuevoId,
      codigo: nuevoId,
      ...datosNuevo,
    };

    setListaObjetos((prev) => [...prev, objetoCompleto]);
    setModalAbierto(false);
    setNotificacion(`¡Servicio "${objetoCompleto.nombre}" registrado exitosamente como ${nuevoId}!`);
    setTimeout(() => setNotificacion(null), 4000);
  };

  const handleEliminarObjeto = (id) => {
    const confirmacion = window.confirm(`¿Estás seguro de eliminar el objeto/servicio con código ${id}?`);
    if (confirmacion) {
      setListaObjetos((prev) => prev.filter((item) => item.id !== id));
      setNotificacion(`El objeto ${id} fue eliminado correctamente.`);
      setTimeout(() => setNotificacion(null), 3000);
    }
  };

  return (
    <section className="custom-objects-section" id="seccion-objetos-propios" aria-label="Servicios y Objetos de Taller">
      <SectionHeader
        title="Servicios Especializados de Taller & Luthier"
        subtitle="Mantenciones profesionales, calibración y personalización para tus instrumentos musicales con garantía Sonido Vivo."
      />

      {notificacion && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          {notificacion}
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotificacion(null)}
            aria-label="Cerrar notificación"
          />
        </div>
      )}

      <div className="custom-objects-grid" id="grid-objetos-propios">
        {listaObjetos.map((objeto) => (
          <CustomObjectCard
            key={objeto.id}
            objeto={objeto}
            onAddToCart={onAddToCart}
            isAdmin={isAdmin}
            onEliminar={handleEliminarObjeto}
          />
        ))}

        {isAdmin && (
          <button
            type="button"
            className="custom-card-slot active-admin-slot"
            onClick={() => setModalAbierto(true)}
            data-testid="btn-abrir-modal-crear-objeto"
            aria-label="Agregar nuevo servicio"
          >
            <span className="slot-icon">+</span>
            <strong className="slot-title">Agregar Nuevo Servicio</strong>
            <span className="slot-subtitle">Añadir otra prestación al catálogo</span>
          </button>
        )}
      </div>


      {modalAbierto && (
        <ModalCrearObjeto
          onGuardar={handleGuardarObjeto}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </section>
  );
}

CustomObjectsSection.propTypes = {
  objetos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    })
  ),
  onAddToCart: PropTypes.func,
};

export default CustomObjectsSection;
