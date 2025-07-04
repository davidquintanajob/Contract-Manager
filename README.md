# Contract Manager - Frontend

Sistema de gestión de contratos desarrollado con Nuxt 3, Vue 3 y Tailwind CSS. Esta aplicación permite gestionar contratos, entidades, ofertas, trabajadores y usuarios de manera eficiente.

## 🚀 Características

- **Gestión de Contratos**: Crear, editar, ver y eliminar contratos
- **Gestión de Entidades**: Administrar entidades contratantes
- **Gestión de Ofertas**: Manejar ofertas de trabajo
- **Gestión de Trabajadores**: Administrar trabajadores y sus asociaciones
- **Gestión de Usuarios**: Sistema de usuarios y autenticación
- **Tipos de Contrato**: Configuración de tipos de contratos
- **Exportación a Excel**: Exportar datos de todas las vistas
- **Interfaz Responsiva**: Diseño adaptativo para móviles y desktop
- **Autenticación JWT**: Sistema seguro de login/logout

## 🛠️ Tecnologías Utilizadas

- **Nuxt 3**: Framework de Vue.js para aplicaciones universales
- **Vue 3**: Framework progresivo de JavaScript
- **Tailwind CSS**: Framework de CSS utilitario
- **XLSX**: Biblioteca para exportación a Excel
- **Leaflet**: Biblioteca para mapas (plugin incluido)

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm**, **yarn** o **pnpm**
- **Backend del Contract Manager** ejecutándose en `http://localhost:4000`

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/davidquintanajob/Contract-Manager
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   # Con npm
   npm install

   # Con yarn
   yarn install

   # Con pnpm
   pnpm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   # Configuración del backend
   BACKEND_HOST=http://localhost:4000
   ```

4. **Verificar configuración**
   
   Asegúrate de que el archivo `nuxt.config.ts` tenga la configuración correcta del backend:
   ```typescript
   export default defineNuxtConfig({
     runtimeConfig: {
       public: {
         backendHost: process.env.BACKEND_HOST || 'http://localhost:4000'
       }
     }
   })
   ```

## 🚀 Desarrollo

### Iniciar servidor de desarrollo

```bash
# Con npm
npm run dev

# Con yarn
yarn dev

# Con pnpm
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Estructura del Proyecto

```
frontend/
├── components/          # Componentes reutilizables
│   ├── DataTable.vue   # Tabla de datos genérica
│   ├── Navbar.vue      # Barra de navegación
│   ├── MessageBanner.vue # Banner de mensajes
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── index.vue       # Página principal
│   ├── login.vue       # Página de login
│   ├── contratos.vue   # Gestión de contratos
│   ├── entidades.vue   # Gestión de entidades
│   └── ...
├── assets/             # Recursos estáticos
├── public/             # Archivos públicos
└── nuxt.config.ts      # Configuración de Nuxt
```

## 🏗️ Construcción para Producción

### Construir la aplicación

```bash
# Con npm
npm run build

# Con yarn
yarn build

# Con pnpm
pnpm build
```

### Previsualizar la construcción

```bash
# Con npm
npm run preview

# Con yarn
yarn preview

# Con pnpm
pnpm preview
```

## 🚀 Despliegue

### Despliegue en Vercel

1. **Conectar repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Nuxt

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega `BACKEND_HOST` con la URL de tu backend en producción

3. **Desplegar**
   - Cada push a la rama principal desplegará automáticamente
   - O usa el botón "Deploy" en el dashboard

### Despliegue en Netlify

1. **Conectar repositorio a Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Configura el comando de build: `npm run build`
   - Configura el directorio de publicación: `.output/public`

2. **Configurar variables de entorno**
   - En Site settings > Environment variables
   - Agrega `BACKEND_HOST` con la URL de tu backend

### Despliegue en servidor propio

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Servir los archivos**
   ```bash
   # Los archivos generados están en .output/public
   # Puedes servirlos con cualquier servidor web (nginx, Apache, etc.)
   ```

## 🔐 Configuración de Autenticación

La aplicación utiliza JWT para la autenticación:

- Los tokens se almacenan en `localStorage`
- Se incluyen automáticamente en todas las peticiones al backend
- Si el token expira, el usuario es redirigido al login

## 📱 Características Responsivas

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Touch Friendly**: Interfaz optimizada para pantallas táctiles

## 🎨 Personalización

### Colores y Estilos

Los estilos se pueden personalizar editando:
- `tailwind.config.js` - Configuración de Tailwind CSS
- `assets/css/tailwind.css` - Estilos personalizados

### Componentes

Los componentes están en `components/` y pueden ser modificados según las necesidades del proyecto.

## 🐛 Solución de Problemas

### Error de hidratación
Si ves errores de hidratación en la consola, asegúrate de que:
- El backend esté ejecutándose en la URL correcta
- Las variables de entorno estén configuradas correctamente

### Problemas de CORS
Si hay problemas de CORS:
- Verifica que el backend permita peticiones desde el dominio del frontend
- Asegúrate de que las URLs estén configuradas correctamente

### Problemas de autenticación
Si hay problemas con el login:
- Verifica que el backend esté funcionando
- Revisa la consola del navegador para errores
- Asegúrate de que las credenciales sean correctas
