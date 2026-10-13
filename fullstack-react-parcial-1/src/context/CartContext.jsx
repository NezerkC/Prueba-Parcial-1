import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'sonido_vivo_carrito_v1';

export function CartProvider({ children }) {
  // Inicialización perezosa: solo lee localStorage al montar el componente
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
      console.error('Error al inicializar el carrito desde localStorage:', error);
      return [];
    }
  });

  // Notificación toast opcional
  const [toastMensaje, setToastMensaje] = useState(null);

  // Sincronización automática con localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  }, [items]);

  // Acciones inmutables
  const addToCart = (producto, cantidad = 1) => {
    if (!producto || !producto.codigo) return;

    setItems((prevItems) => {
      const existe = prevItems.find((p) => p.codigo === producto.codigo);
      if (existe) {
        return prevItems.map((p) =>
          p.codigo === producto.codigo
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      }
      return [...prevItems, { ...producto, cantidad }];
    });

    setToastMensaje(`¡${producto.nombre} agregado al carro!`);
  };

  const removeFromCart = (codigo) => {
    setItems((prev) => prev.filter((p) => p.codigo !== codigo));
  };

  const updateQuantity = (codigo, delta) => {
    setItems((prev) =>
      prev
        .map((p) => {
          if (p.codigo === codigo) {
            const nuevaCantidad = p.cantidad + delta;
            return nuevaCantidad > 0 ? { ...p, cantidad: nuevaCantidad } : null;
          }
          return p;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearToast = () => {
    setToastMensaje(null);
  };

  // Estados derivados (cálculo en tiempo real sin estados redundantes)
  const totalUnidades = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * (item.cantidad || 0),
    0
  );
  const iva = Math.round(subtotal * 0.19);
  const totalConIva = subtotal + iva;

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalUnidades,
    subtotal,
    iva,
    totalConIva,
    toastMensaje,
    clearToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un <CartProvider>');
  }
  return context;
}
