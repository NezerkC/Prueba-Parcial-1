import PropTypes from 'prop-types';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { CATEGORIAS_SONIDO_VIVO } from '../data/productos';

function FiltrosCatalogo({
  busqueda,
  onBusquedaChange,
  categoriaSeleccionada,
  onCategoriaChange,
  orden,
  onOrdenChange,
  totalResultados,
}) {
  return (
    <section className="filtros-catalogo mb-4" aria-label="Filtros del catálogo">
      <div className="row g-3 align-items-center mb-3">
        {/* Buscador en tiempo real */}
        <div className="col-12 col-md-8">
          <InputGroup>
            <InputGroup.Text id="search-addon" className="bg-white border-end-0">
              🔍
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar por nombre, marca, modelo o código..."
              aria-label="Buscar producto"
              aria-describedby="search-addon"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="border-start-0 ps-0"
              data-testid="search-input"
            />
            {busqueda && (
              <Button
                variant="outline-secondary"
                onClick={() => onBusquedaChange('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </Button>
            )}
          </InputGroup>
        </div>

        {/* Ordenamiento */}
        <div className="col-12 col-md-4">
          <Form.Select
            value={orden}
            onChange={(e) => onOrdenChange(e.target.value)}
            aria-label="Ordenar productos"
            data-testid="sort-select"
          >
            <option value="relevancia">Ordenar por: Relevancia</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre-asc">Nombre: A - Z</option>
            <option value="nombre-desc">Nombre: Z - A</option>
          </Form.Select>
        </div>
      </div>

      {/* Chips de Categorías */}
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <span className="text-muted small me-1">Categorías:</span>
        <Button
          variant={categoriaSeleccionada === 'Todas' ? 'primary' : 'outline-secondary'}
          size="sm"
          className="rounded-pill px-3 py-1"
          onClick={() => onCategoriaChange('Todas')}
          data-testid="chip-todas"
        >
          Todas
        </Button>
        {CATEGORIAS_SONIDO_VIVO.map((cat) => (
          <Button
            key={cat}
            variant={categoriaSeleccionada === cat ? 'primary' : 'outline-secondary'}
            size="sm"
            className="rounded-pill px-3 py-1"
            onClick={() => onCategoriaChange(cat)}
            data-testid={`chip-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Contador de resultados */}
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <Badge bg="light" text="dark" className="border px-2 py-1">
          {totalResultados} {totalResultados === 1 ? 'producto encontrado' : 'productos encontrados'}
        </Badge>
        {(busqueda || categoriaSeleccionada !== 'Todas') && (
          <Button
            variant="link"
            size="sm"
            className="text-decoration-none text-muted p-0"
            onClick={() => {
              onBusquedaChange('');
              onCategoriaChange('Todas');
            }}
          >
            Restablecer filtros
          </Button>
        )}
      </div>
    </section>
  );
}

FiltrosCatalogo.propTypes = {
  busqueda: PropTypes.string.isRequired,
  onBusquedaChange: PropTypes.func.isRequired,
  categoriaSeleccionada: PropTypes.string.isRequired,
  onCategoriaChange: PropTypes.func.isRequired,
  orden: PropTypes.string.isRequired,
  onOrdenChange: PropTypes.func.isRequired,
  totalResultados: PropTypes.number.isRequired,
};

export default FiltrosCatalogo;
