import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);
const STORAGE_KEY = 'sonido_vivo_auth_v1';

// Usuarios de prueba predeterminados (para evaluación institucional Duoc UC)
const USUARIOS_DEMO = [
  {
    rut: '12345678-5',
    nombre: 'Martín',
    apellidos: 'Gómez',
    correo: 'admin@profesor.duoc.cl',
    clave: '123456',
    rol: 'admin',
    region: 'V',
    comuna: 'Viña del Mar',
    direccion: 'Av. Libertad 1234, Oficina 502',
  },
  {
    rut: '19011022-K',
    nombre: 'Sebastián',
    apellidos: 'Valenzuela',
    correo: 'cliente@duoc.cl',
    clave: 'pass12',
    rol: 'cliente',
    region: 'V',
    comuna: 'Valparaíso',
    direccion: 'Cerro Alegre, Pasaje Bavestrello 14',
  },
  {
    rut: '18765432-1',
    nombre: 'Camila',
    apellidos: 'Reyes',
    correo: 'usuario@gmail.com',
    clave: 'pass12',
    rol: 'cliente',
    region: 'RM',
    comuna: 'Santiago',
    direccion: 'Santa Isabel 450, Depto 803',
  },
];

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : null;
    } catch (error) {
      console.error('Error al recuperar sesión desde localStorage:', error);
      return null;
    }
  });

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    try {
      const guardados = localStorage.getItem('sonido_vivo_usuarios_v1');
      return guardados ? JSON.parse(guardados) : USUARIOS_DEMO;
    } catch {
      return USUARIOS_DEMO;
    }
  });

  useEffect(() => {
    try {
      if (usuario) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error al sincronizar sesión:', error);
    }
  }, [usuario]);

  useEffect(() => {
    try {
      localStorage.setItem('sonido_vivo_usuarios_v1', JSON.stringify(usuariosRegistrados));
    } catch (error) {
      console.error('Error al persistir usuarios registrados:', error);
    }
  }, [usuariosRegistrados]);

  const login = (correo, clave) => {
    const correoLimpio = String(correo || '').trim().toLowerCase();
    const claveLimpia = String(clave || '').trim();

    const encontrado = usuariosRegistrados.find(
      (u) => u.correo.toLowerCase() === correoLimpio && u.clave === claveLimpia
    );

    if (encontrado) {
      const { clave: _omitClave, ...datosSesion } = encontrado;
      void _omitClave;
      setUsuario(datosSesion);
      return { exito: true, usuario: datosSesion };
    }

    return {
      exito: false,
      mensaje: 'Credenciales inválidas. Verifica tu correo y contraseña.',
    };
  };

  const registro = (datosNuevoUsuario) => {
    const nuevo = {
      ...datosNuevoUsuario,
      rol: 'cliente',
    };

    setUsuariosRegistrados((prev) => [...prev, nuevo]);

    const { clave: _omitClave, ...datosSesion } = nuevo;
    void _omitClave;
    setUsuario(datosSesion);

    return { exito: true, usuario: datosSesion };
  };

  const logout = () => {
    setUsuario(null);
  };

  const value = {
    usuario,
    isAuthenticated: Boolean(usuario),
    isAdmin: usuario?.rol === 'admin',
    login,
    registro,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un <AuthProvider>');
  }
  return context;
}
