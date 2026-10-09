import SectionHeader from '../SectionHeader';
import CustomObjectCard from './CustomObjectCard';

function CustomObjectsSection({ objetos = [] }) {
  return (
    <section className="custom-objects-section" id="seccion-objetos-propios">
      <SectionHeader
        title="Objetos Creados por el Usuario"
        subtitle="Espacio normalizado para que el desarrollador inserte sus propios componentes, modelos o colecciones."
      />

      <div className="custom-objects-grid" id="grid-objetos-propios">
        {objetos.map((objeto) => (
          <CustomObjectCard key={objeto.id} objeto={objeto} />
        ))}

        <article className="custom-card placeholder">
          <span>+ Espacio disponible para tu siguiente objeto</span>
        </article>
      </div>
    </section>
  );
}

export default CustomObjectsSection;
