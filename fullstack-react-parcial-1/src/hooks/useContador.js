// src/hooks/useContador.js
// Hook personalizado de las guías 2.3.1/2.3.2 adaptado para selector de cantidad y stock
import { useState } from 'react';

function useContador(valorInicial = 1, { min = 0, max = Infinity } = {}) {
  const [contador, setContador] = useState(valorInicial);

  const incrementar = () =>
    setContador((valor) => (valor < max ? valor + 1 : valor));

  const decrementar = () =>
    setContador((valor) => (valor > min ? valor - 1 : valor));

  const reiniciar = () => setContador(valorInicial);

  return { contador, incrementar, decrementar, reiniciar };
}

export default useContador;
