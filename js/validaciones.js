/**
 * ============================================================================
 * validaciones.js
 * Motor de Validaciones en Tiempo Real y Reglas de Negocio Estrictas
 * Proyecto: Sonido Vivo (Evaluación Parcial 1 - DSY1104)
 * ============================================================================
 */

// 1. Expresión regular para correos institucionales y Gmail
const REGEX_EMAIL_VALIDO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

/**
 * Valida matemáticamente un RUN/RUT chileno mediante algoritmo Módulo 11.
 * @param {string} rutCompleto - Cadena sin puntos ni guión (ej: "19011022K" o "123456785")
 * @returns {boolean} true si el dígito verificador coincide con el algoritmo
 */
function validarRutChileno(rutCompleto) {
  if (!rutCompleto) return false;

  // 1. Limpieza y estandarización
  const valor = rutCompleto.trim().toUpperCase();

  // 2. Formato: Entre 7 y 8 dígitos para el cuerpo + 1 dígito o K para el DV
  const regexFormato = /^[0-9]{7,8}[0-9K]$/;
  if (!regexFormato.test(valor)) return false;

  const cuerpo = valor.slice(0, -1);
  const dvIngresado = valor.slice(-1);

  // 3. Multiplicación ponderada con la serie 2, 3, 4, 5, 6, 7
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  // 4. Residuo Módulo 11 y determinación del DV esperado
  const resto = 11 - (suma % 11);
  let dvEsperado = '';

  if (resto === 11) {
    dvEsperado = '0';
  } else if (resto === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = resto.toString();
  }

  return dvIngresado === dvEsperado;
}

/**
 * Valida si un correo electrónico pertenece estrictamente a los 3 dominios permitidos.
 * @param {string} email
 * @returns {boolean}
 */
function validarEmailInstitucional(email) {
  if (!email || email.trim().length > 100) return false;
  return REGEX_EMAIL_VALIDO.test(email.trim());
}

/**
 * Muestra mensaje de error visual contextual y bordea en rojo el campo.
 */
function mostrarError(input, errorElement, mensaje) {
  if (!input) return;
  input.classList.add("input-error");
  if (input.closest(".form-group")) {
    input.closest(".form-group").classList.add("has-error");
  }
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.classList.add("show");
  }
}

/**
 * Limpia el estado de error de un campo.
 */
function limpiarError(input, errorElement) {
  if (!input) return;
  input.classList.remove("input-error");
  if (input.closest(".form-group")) {
    input.closest(".form-group").classList.remove("has-error");
  }
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
  // 1. Control del Menú Hamburguesa Móvil
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("is-active");
      mainNav.classList.toggle("is-open");
    });
  }

  // --------------------------------------------------------------------------
  // FORMULARIO: REGISTRO DE USUARIOS
  // --------------------------------------------------------------------------
  const formRegistro = document.getElementById("form-registro");
  if (formRegistro) {
    const inputRut = document.getElementById("reg-rut");
    const errorRut = document.getElementById("error-rut");

    const inputNombre = document.getElementById("reg-nombre");
    const errorNombre = document.getElementById("error-nombre");

    const inputApellidos = document.getElementById("reg-apellidos");
    const errorApellidos = document.getElementById("error-apellidos");

    const inputCorreo = document.getElementById("reg-correo");
    const errorCorreo = document.getElementById("error-correo");

    const selectRegion = document.getElementById("select-region");
    const errorRegion = document.getElementById("error-region");

    const selectComuna = document.getElementById("select-comuna");
    const errorComuna = document.getElementById("error-comuna");

    const inputDireccion = document.getElementById("reg-direccion");
    const errorDireccion = document.getElementById("error-direccion");

    // Validación individual en tiempo real (blur e input)
    if (inputRut) {
      inputRut.addEventListener("blur", () => {
        const val = inputRut.value.trim();
        if (!val) {
          mostrarError(inputRut, errorRut, "El RUN/RUT es obligatorio.");
        } else if (!validarRutChileno(val)) {
          mostrarError(inputRut, errorRut, "RUT inválido. Debe tener 7-9 caracteres sin puntos ni guión (ej: 19011022K).");
        } else {
          limpiarError(inputRut, errorRut);
        }
      });
      inputRut.addEventListener("input", () => {
        if (inputRut.classList.contains("input-error") && validarRutChileno(inputRut.value)) {
          limpiarError(inputRut, errorRut);
        }
      });
    }

    if (inputNombre) {
      inputNombre.addEventListener("blur", () => {
        const val = inputNombre.value.trim();
        if (!val) {
          mostrarError(inputNombre, errorNombre, "El nombre es obligatorio.");
        } else if (val.length > 50) {
          mostrarError(inputNombre, errorNombre, "Máximo 50 caracteres.");
        } else {
          limpiarError(inputNombre, errorNombre);
        }
      });
      inputNombre.addEventListener("input", () => limpiarError(inputNombre, errorNombre));
    }

    if (inputApellidos) {
      inputApellidos.addEventListener("blur", () => {
        const val = inputApellidos.value.trim();
        if (!val) {
          mostrarError(inputApellidos, errorApellidos, "Los apellidos son obligatorios.");
        } else if (val.length > 100) {
          mostrarError(inputApellidos, errorApellidos, "Máximo 100 caracteres.");
        } else {
          limpiarError(inputApellidos, errorApellidos);
        }
      });
      inputApellidos.addEventListener("input", () => limpiarError(inputApellidos, errorApellidos));
    }

    if (inputCorreo) {
      inputCorreo.addEventListener("blur", () => {
        const val = inputCorreo.value.trim();
        if (!val) {
          mostrarError(inputCorreo, errorCorreo, "El correo electrónico es obligatorio.");
        } else if (!validarEmailInstitucional(val)) {
          mostrarError(inputCorreo, errorCorreo, "Solo se admiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        } else {
          limpiarError(inputCorreo, errorCorreo);
        }
      });
      inputCorreo.addEventListener("input", () => {
        if (validarEmailInstitucional(inputCorreo.value)) {
          limpiarError(inputCorreo, errorCorreo);
        }
      });
    }

    if (selectRegion) {
      selectRegion.addEventListener("change", () => {
        if (selectRegion.value) limpiarError(selectRegion, errorRegion);
      });
    }

    if (selectComuna) {
      selectComuna.addEventListener("change", () => {
        if (selectComuna.value) limpiarError(selectComuna, errorComuna);
      });
    }

    if (inputDireccion) {
      inputDireccion.addEventListener("blur", () => {
        const val = inputDireccion.value.trim();
        if (!val) {
          mostrarError(inputDireccion, errorDireccion, "La dirección de despacho es obligatoria.");
        } else if (val.length > 300) {
          mostrarError(inputDireccion, errorDireccion, "Máximo 300 caracteres.");
        } else {
          limpiarError(inputDireccion, errorDireccion);
        }
      });
      inputDireccion.addEventListener("input", () => limpiarError(inputDireccion, errorDireccion));
    }

    // Validación general al Submit
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      let formValido = true;

      if (!inputRut || !validarRutChileno(inputRut.value)) {
        mostrarError(inputRut, errorRut, "RUT chileno inválido (Módulo 11 sin puntos ni guión).");
        formValido = false;
      }
      if (!inputNombre || !inputNombre.value.trim() || inputNombre.value.trim().length > 50) {
        mostrarError(inputNombre, errorNombre, "Nombre obligatorio (máx. 50 caracteres).");
        formValido = false;
      }
      if (!inputApellidos || !inputApellidos.value.trim() || inputApellidos.value.trim().length > 100) {
        mostrarError(inputApellidos, errorApellidos, "Apellidos obligatorios (máx. 100 caracteres).");
        formValido = false;
      }
      if (!inputCorreo || !validarEmailInstitucional(inputCorreo.value)) {
        mostrarError(inputCorreo, errorCorreo, "Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        formValido = false;
      }
      if (selectRegion && !selectRegion.value) {
        mostrarError(selectRegion, errorRegion, "Debes seleccionar una región.");
        formValido = false;
      }
      if (selectComuna && !selectComuna.value) {
        mostrarError(selectComuna, errorComuna, "Debes seleccionar una comuna.");
        formValido = false;
      }
      if (!inputDireccion || !inputDireccion.value.trim() || inputDireccion.value.trim().length > 300) {
        mostrarError(inputDireccion, errorDireccion, "Dirección requerida (máx. 300 caracteres).");
        formValido = false;
      }

      if (formValido) {
        alert("¡Registro completado exitosamente en Sonido Vivo! Bienvenido.");
        formRegistro.reset();
        window.location.href = "login.html";
      }
    });
  }

  // --------------------------------------------------------------------------
  // FORMULARIO: LOGIN / INICIO DE SESIÓN
  // --------------------------------------------------------------------------
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    const inputEmail = document.getElementById("login-correo");
    const errorEmail = document.getElementById("error-login-correo");
    const inputPass = document.getElementById("login-pass");
    const errorPass = document.getElementById("error-login-pass");

    if (inputEmail) {
      inputEmail.addEventListener("blur", () => {
        if (!validarEmailInstitucional(inputEmail.value)) {
          mostrarError(inputEmail, errorEmail, "Debe ser correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        } else {
          limpiarError(inputEmail, errorEmail);
        }
      });
    }

    if (inputPass) {
      inputPass.addEventListener("blur", () => {
        const len = inputPass.value.length;
        if (len < 4 || len > 10) {
          mostrarError(inputPass, errorPass, "La contraseña debe tener entre 4 y 10 caracteres.");
        } else {
          limpiarError(inputPass, errorPass);
        }
      });
    }

    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      let valido = true;

      if (!inputEmail || !validarEmailInstitucional(inputEmail.value)) {
        mostrarError(inputEmail, errorEmail, "Correo inválido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        valido = false;
      }

      const passLen = inputPass ? inputPass.value.length : 0;
      if (passLen < 4 || passLen > 10) {
        mostrarError(inputPass, errorPass, "La contraseña debe tener estrictamente entre 4 y 10 caracteres.");
        valido = false;
      }

      if (valido) {
        // Simulación pedagógica de autenticación
        const correo = inputEmail.value.toLowerCase();
        if (correo.includes("admin") || correo.includes("profesor")) {
          alert("Sesión iniciada con rol: ADMINISTRADOR / GESTIÓN.");
          window.location.href = "admin/home.html";
        } else {
          alert(`Sesión iniciada correctamente como cliente (${correo}).`);
          window.location.href = "../index.html";
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // FORMULARIO: CONTACTO
  // --------------------------------------------------------------------------
  const formContacto = document.getElementById("form-contacto");
  if (formContacto) {
    const inputNombre = document.getElementById("contacto-nombre");
    const errorNombre = document.getElementById("error-contacto-nombre");

    const inputCorreo = document.getElementById("contacto-correo");
    const errorCorreo = document.getElementById("error-contacto-correo");

    const inputComentario = document.getElementById("contacto-mensaje");
    const errorComentario = document.getElementById("error-contacto-mensaje");
    const contadorChar = document.getElementById("char-count");

    if (inputComentario && contadorChar) {
      inputComentario.addEventListener("input", () => {
        contadorChar.textContent = `${inputComentario.value.length}/500`;
      });
    }

    formContacto.addEventListener("submit", (e) => {
      e.preventDefault();
      let valido = true;

      if (!inputNombre || !inputNombre.value.trim() || inputNombre.value.trim().length > 100) {
        mostrarError(inputNombre, errorNombre, "Nombre requerido (máximo 100 caracteres).");
        valido = false;
      } else {
        limpiarError(inputNombre, errorNombre);
      }

      if (!inputCorreo || !validarEmailInstitucional(inputCorreo.value)) {
        mostrarError(inputCorreo, errorCorreo, "Solo correos autorizados (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
        valido = false;
      } else {
        limpiarError(inputCorreo, errorCorreo);
      }

      if (!inputComentario || !inputComentario.value.trim() || inputComentario.value.trim().length > 500) {
        mostrarError(inputComentario, errorComentario, "Comentario requerido (máximo 500 caracteres).");
        valido = false;
      } else {
        limpiarError(inputComentario, errorComentario);
      }

      if (valido) {
        alert("¡Mensaje enviado con éxito a Sonido Vivo Viña del Mar! Te responderemos a la brevedad.");
        formContacto.reset();
        if (contadorChar) contadorChar.textContent = "0/500";
      }
    });
  }
});
}
