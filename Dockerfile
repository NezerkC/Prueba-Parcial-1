# ==========================================
# Etapa 1: Compilación de la aplicación (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos de dependencias para aprovechar caché de capas Docker
COPY package.json package-lock.json ./
COPY fullstack-react-parcial-1/package.json ./fullstack-react-parcial-1/

# Instalación limpia y determinista de dependencias
RUN npm ci

# Copiar el código fuente completo del proyecto
COPY . .

# Compilar la aplicación React en el workspace
RUN npm run build -w fullstack-react-parcial-1

# ==========================================
# Etapa 2: Servidor Web de Producción (Runner)
# ==========================================
FROM nginx:alpine AS runner

# Copiar configuración optimizada de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos compilados desde el builder al directorio público de Nginx
COPY --from=builder /app/fullstack-react-parcial-1/dist /usr/share/nginx/html

# Exponer el puerto estándar HTTP
EXPOSE 80

# Monitoreo de salud interno del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

# Iniciar servidor web en primer plano
CMD ["nginx", "-g", "daemon off;"]
