<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
    <Navbar />
    
    <!-- MessageBanner para mostrar estado de verificación de contratos -->
    <div v-if="verificationBanner" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner 
        :title="verificationBanner.title" 
        :description="verificationBanner.description" 
        :type="verificationBanner.type"
        :persistent="verificationBanner.persistent"
        @close="verificationBanner = null" 
        class="pointer-events-auto" 
      />
    </div>
    
    <div class="mt-8 md:mt-0 flex-1 flex flex-col">
      <!-- Header/logo -->
      <header class="flex flex-col items-center justify-center py-12">
        <img src="/logo.jpeg" alt="Logo" class="h-28 w-28 rounded-full shadow-lg mb-4" />
        <h1 class="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">Contract Manager</h1>
        <p class="text-lg md:text-xl text-gray-700 text-center max-w-2xl">La plataforma integral para la gestión eficiente de contratos, entidades y trabajadores en tu organización.</p>
      </header>

      <!-- Funcionalidades principales y accesos directos -->
      <section class="flex-1 flex flex-col items-center justify-center px-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl w-full mb-12">
          <div @click="goTo('contratos')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-blue-500 mb-4 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700 mb-2">Contratos</h3>
            <p class="text-gray-600 text-center">Gestiona todos los contratos de tu organización.</p>
          </div>
          <div @click="goTo('entidades')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group relative">
            <!-- Indicador numérico para contratos próximos a vencer -->
            <div v-if="contratosProximosCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
              {{ contratosProximosCount }}
            </div>
            <svg class="h-12 w-12 text-blue-500 mb-4 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m12 0a4 4 0 01-8 0m8 0V6a4 4 0 00-8 0v4" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700 mb-2">Entidades</h3>
            <p class="text-gray-600 text-center">Administra proveedores, clientes y otras entidades.</p>
          </div>
          <div @click="goTo('ofertas')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-blue-500 mb-4 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700 mb-2">Ofertas</h3>
            <p class="text-gray-600 text-center">Consulta y administra las ofertas asociadas a contratos.</p>
          </div>
          <div @click="goTo('tipos-contratos')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-blue-500 mb-4 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4h10m-10 4h10m-10 4h6" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700 mb-2">Tipos de Contrato</h3>
            <p class="text-gray-600 text-center">Gestiona los diferentes tipos de contrato disponibles.</p>
          </div>
          <div @click="goTo('trabajadores')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-blue-500 mb-4 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700 mb-2">Trabajadores</h3>
            <p class="text-gray-600 text-center">Registra y gestiona trabajadores autorizados y sus contratos.</p>
          </div>
        </div>
        <button @click="goToLogin" class="mt-4 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow hover:bg-blue-700 transition">Iniciar sesión</button>
      </section>

      <!-- Footer -->
      <footer class="w-full py-6 text-center text-gray-500 text-sm bg-transparent mt-auto">
        © {{ new Date().getFullYear() }} Contract Manager. Desarrollado por David Quintana Valdés
      </footer>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import { navigateTo } from 'nuxt/app';
import { ref, onMounted } from 'vue';

const goToLogin = () => navigateTo('/login');

const goTo = (ruta) => {
    const token = localStorage.getItem('token');
    if (token) {
        navigateTo(`/${ruta}`);
    } else {
        navigateTo('/login');
    }
};

// Variables reactivas para la verificación de contratos
const verificationBanner = ref(null);
const contratosProximosCount = ref(0);

// Función para verificar contratos próximos a vencer
const verificarContratosProximos = async () => {
  const token = localStorage.getItem('token');
  
  // Solo verificar si hay token (usuario autenticado)
  if (!token) {
    return;
  }

  try {
    // Mostrar mensaje de verificación
    verificationBanner.value = {
      title: 'Verificando Contratos',
      description: 'Comprobando si hay contratos próximos a vencer...',
      type: 'warning',
      persistent: false
    };

    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.backendHost}/contrato/proximos-a-vencer`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    // Verificar si hay error de autenticación
    if (response.status === 401 || response.status === 403) {
      verificationBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning',
        persistent: false
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }

    const data = await response.json();
    
    if (data.count > 0) {
      // Hay contratos próximos a vencer
      const entidades = data.data.map(contrato => contrato.entidad?.nombre).filter(nombre => nombre);
      const entidadesUnicas = [...new Set(entidades)];
      const entidadesTexto = entidadesUnicas.join(', ');
      
      contratosProximosCount.value = data.count;
      
      verificationBanner.value = {
        title: `Contratos Próximos a Vencer`,
        description: `Hay ${data.count} contrato(s) próximo(s) a vencer de las entidades: ${entidadesTexto}`,
        type: 'warning',
        persistent: true
      };
    } else {
      // No hay contratos próximos a vencer
      contratosProximosCount.value = 0;
      
      verificationBanner.value = {
        title: 'Sin Contratos Próximos a Vencer',
        description: 'No hay contratos próximos a vencer en este momento.',
        type: 'success',
        persistent: false
      };
    }
  } catch (error) {
    console.error('Error al verificar contratos próximos a vencer:', error);
    verificationBanner.value = {
      title: 'Error de Verificación',
      description: 'No se pudo verificar los contratos próximos a vencer.',
      type: 'error',
      persistent: false
    };
  }
};

// Verificar contratos cuando se monta el componente
onMounted(() => {
  verificarContratosProximos();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
