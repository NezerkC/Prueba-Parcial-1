# Arquitectura de Contenedores OCI y Estrategia de Despliegue

Este documento describe la especificación técnica de empaquetado, contenerización OCI (Open Container Initiative) y estrategia de despliegue para el frontend de **Sonido Vivo** en React 19 / Vite.

---

## 1. Visión General de la Solución

El proyecto migrado a React opera como una **Single Page Application (SPA)** cliente. Para llevarla a entornos productivos o plataformas PaaS/IaaS autohospedadas (como **Dokploy** en servidores Linux/Proxmox), se diseñó una estrategia basada en estándares abiertos:

1. **`Dockerfile`**: Construcción multi-etapa (*multi-stage build*) determinista y reproducible.
2. **`nginx.conf`**: Servidor HTTP de alto rendimiento configurado con compresión Gzip, políticas de caché estricta para assets y enrutamiento fallback para React Router.
3. **`.dockerignore`**: Optimización del contexto de construcción descartando artefactos pesados e innecesarios.
4. **`docker-compose.yml`**: Orquestación local para pruebas de integración con healthcheck continuo.

```
+-------------------------------------------------------------------------+
|                         Etapa 1: Builder (Node 20)                     |
|  - Copia package.json y workspace manifests                             |
|  - npm ci (Dependencias reproducibles con lockfile)                     |
|  - npm run build -w fullstack-react-parcial-1                           |
|  - Generación de bundle estático optimizado (/dist)                     |
+-------------------------------------------------------------------------+
                                    |
                    Copia exclusiva de /dist y nginx.conf
                                    v
+-------------------------------------------------------------------------+
|                         Etapa 2: Runner (Nginx Alpine)                 |
|  - Imagen base ultraligera: nginx:alpine (~25 MB total)                 |
|  - Gzip compresión activa (HTML, CSS, JS, SVG, JSON)                    |
|  - try_files $uri $uri/ /index.html (Soporte SPA Client-Side Routing)   |
|  - Healthcheck nativo mediante wget HTTP spider                        |
|  - Exposición en puerto 80 (mapeado a 3050 en Compose)                  |
+-------------------------------------------------------------------------+
```

---

## 2. Razón Técnica del Multi-Stage Build

Un contenedor tradicional de desarrollo basado en Node.js que mantenga `node_modules` y herramientas de compilación supera fácilmente los **800 MB - 1 GB** de almacenamiento. En producción, una SPA no necesita el runtime de Node.js, ya que el navegador del cliente es quien ejecuta el código JavaScript.

### Ventajas de la Arquitectura Multi-Etapa:

1. **Reducción Drástica de Huella (Size Optimization):**
   - El artefacto final en Nginx Alpine pesa **menos de 30 MB**, facilitando descargas ultrarrápidas de imágenes en registros OCI y despliegues sin fricción.
2. **Superficie de Ataque Mínima (Security Hardening):**
   - Se eliminan compiladores, scripts npm, dependencias de desarrollo (`@vitejs/plugin-react`, `vitest`, `eslint`) y código fuente JSX/TypeScript. La imagen productiva solo contiene Nginx y archivos estáticos (.html, .js, .css).
3. **Aprovechamiento Eficiente de Caché de Capas (Docker Layer Caching):**
   - Se copian primero los archivos de definición de dependencias (`package.json`, `package-lock.json`) antes del código fuente. Si el código cambia pero las dependencias permanecen idénticas, Docker reutiliza el paso de `npm ci`, acelerando el pipeline de CI/CD.

---

## 3. Configuración de Nginx para Single Page Application (SPA)

### El Problema del Enrutamiento en el Cliente (Client-Side Routing)
React Router gestiona la navegación interna manipulando el historial del navegador mediante la `HTML5 History API` (por ejemplo, navegando a `/catalogo`, `/carrito`, o `/login`). 

Si un usuario recarga la página o entra directamente a `http://dominio/catalogo`:
- **Comportamiento Nginx por defecto:** Busca un archivo físico en `/usr/share/nginx/html/catalogo` o una carpeta `/catalogo/index.html`. Al no existir físicamente en el disco, Nginx responde con un error HTTP **404 Not Found**.
- **Solución implementada:** La directiva `try_files $uri $uri/ /index.html;`.

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Nginx intenta primero servir el recurso exacto solicitado (`$uri`). Si no existe como archivo ni como directorio (`$uri/`), entrega `index.html` con código HTTP 200, delegando la interpretación de la URL a React Router en el navegador.

### Compresión Gzip y Caché Inmutable
Vite genera nombres de archivo con hashing criptográfico de contenido (e.g. `index-B1x8Z9.js`). Esto permite configurar una política de caché inmutable y prolongada sin riesgo de servir código obsoleto tras un nuevo despliegue:

```nginx
location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|webp|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
```

Adicionalmente, se activó la compresión Gzip en nivel 6 para tipos MIME basados en texto (`application/javascript`, `text/css`, etc.), reduciendo el tiempo de carga (LCP) y el ancho de banda transferido.

---

## 4. Ejecución y Validación Local con Docker Compose

El repositorio incluye `docker-compose.yml` preconfigurado para validar el contenedor en un entorno idéntico a producción.

### Comandos de Ejecución

1. **Construir y levantar el contenedor en segundo plano:**
   ```bash
   docker compose up -d --build
   ```

2. **Verificar el estado y la salud del contenedor:**
   ```bash
   docker compose ps
   ```
   *Debe figurar con estado `healthy` gracias al healthcheck HTTP configurado.*

3. **Acceder a la aplicación:**
   Abrir en el navegador: [http://localhost:3050](http://localhost:3050).

4. **Monitorear logs en tiempo real:**
   ```bash
   docker compose logs -f sonido-vivo-frontend
   ```

5. **Detener el servicio:**
   ```bash
   docker compose down
   ```

---

## 5. Orquestación y Despliegue en Dokploy

**Dokploy** es la plataforma autohospedada basada en Docker Engine que administra despliegues en la infraestructura interna.

### Integración Continua:
1. **Detección Automática:** Dokploy se conecta al repositorio Git de **Sonido Vivo** y detecta la presencia del `Dockerfile` en la raíz.
2. **Build Automático:** En cada `git push` a la rama `main` o al emitir una nueva versión etiquetada (`v1.0.0-react`), Dokploy ejecuta el proceso multi-stage sin requerir Node ni dependencias instaladas en el sistema operativo anfitrión.
3. **Mapeo de Red y Traefik:** Dokploy asocia el contenedor con el reverse proxy Traefik, exponiendo el puerto interno `80` hacia el dominio asignado con certificado SSL automático (Let's Encrypt).
4. **Zero-Downtime Rollout:** Dokploy espera a que el nuevo contenedor reporte estado `healthy` antes de redirigir el tráfico y retirar el contenedor anterior.
