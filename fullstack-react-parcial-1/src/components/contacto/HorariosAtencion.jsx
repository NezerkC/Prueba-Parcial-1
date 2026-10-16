const HORARIOS = [
  { dias: 'Lunes a Viernes', horario: '10:00 a 19:30 hrs continuo.' },
  { dias: 'Sábados', horario: '10:30 a 14:30 hrs.' },
  { dias: 'Domingos y Festivos', horario: 'Cerrado (ventas web activas).' },
];

function HorariosAtencion() {
  return (
    <article className="benefit-card contacto-card">
      <h3>Horarios de Atención Presencial</h3>
      <ul className="contacto-horarios">
        {HORARIOS.map((item) => (
          <li key={item.dias}>
            • <strong>{item.dias}:</strong> {item.horario}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default HorariosAtencion;
