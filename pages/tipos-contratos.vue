<template>
  <div>
    <SeoMeta title="Tipos de Contrato - Contract Manager" description="Gestiona los diferentes tipos de contrato disponibles." canonical="/tipos-contratos" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar este tipo de contrato?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteTipoContrato"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Encabezado y botón para nuevo tipo de contrato -->
    <div class="container mx-auto px-4 py-4 md:py-4 pt-8 md:pt-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold mb-4">Tipos de Contrato</h2>
        <button
          @click="nuevoTipoContrato"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Tipo de Contrato
        </button>
      </div>
      <DataTable 
        :columns="entidadesColumns"
        :items="itemsData"
        :actions="entidadesActions"
        :total-items="totalItems"
        :items-per-page="itemsPorPage"
        :current-page="currentPage"
        :is-loading="isLoading"
        @page-change="handlePageChange"
      />
      <TipoContratoModal
        v-model="showModal"
        :tipo-contrato="selectedTipoContrato"
        :is-editing="isEditing"
        :is-viewing="isViewing"
        @submit="handleTipoContratoSubmit"
      />
    </div>
  </div>
</template>

<script setup>
/* global process */
import { ref, computed, h, onMounted } from 'vue';
import SeoMeta from '@/components/SeoMeta.vue';
import Navbar from "@/components/Navbar.vue";
import DataTable from "@/components/DataTable.vue";
import TipoContratoModal from '@/components/TipoContratoModal.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';

// Variables reactivas para los elementos de búsqueda
const nombre = ref('');
const direccion = ref('');
const telefono = ref('');
const cuenta_bancaria = ref('');
const tipo_entidad = ref('');
const codigo_reo = ref('');
const codigo_nit = ref('');
const showFilters = ref(false);

// Obtener la configuración
const config = useRuntimeConfig();


// Configuración de la tabla de Entidades
const entidadesColumns = [
  { key: 'id_tipo_contrato', label: 'ID' },
  { key: 'nombre', label: 'Nombre del Tipo Contrato' }
];

// Variables para la paginación
const currentPage = ref(1);
const totalItems = ref(0); // Inicializamos en 0 hasta que carguemos los datos
const isLoading = ref(false); // Para manejar el estado de carga
const itemsPorPage = ref(20);

// Datos de ejemplo para la tabla (simulando datos paginados)
const itemsData = ref([]);

// Variables para el modal
const showModal = ref(false);
const selectedTipoContrato = ref({});
const isEditing = ref(false);
const isViewing = ref(false);

// Variables para el banner de error
const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const tipoContratoAEliminar = ref(null);

// Función para cargar datos de la API
const fetchItems = async (page = 1, limit = 20) => {
  try {
    isLoading.value = true;

    // Obtener token de autentificación
    const token = localStorage.getItem('token');
    

    const response = await fetch(`${config.public.backendHost}/tipoContrato`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      }
    });

    // Si la respuesta es 401, redirigir a la página principal
    if (response.status === 401 || response.status === 403) {
      errorBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }

    const data = await response.json();
    
    // Actualizamos los datos y el total
    itemsData.value = data.data || [];
    totalItems.value = itemsData.value.length;
  } catch (error) {
    console.error('Error al cargar las entidades:', error);
  } finally {
    isLoading.value = false;
  }
};

// Manejador de eventos para la paginación
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems(newPage, itemsPorPage.value);
};

// Cargar datos cuando el componente se monte
onMounted(() => {
  fetchItems(1, itemsPorPage.value);
});

const deleteIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6 text-red-500',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      })
    ])
  }
};

async function confirmDeleteTipoContrato() {
  showConfirmBanner.value = false;
  if (!tipoContratoAEliminar.value) return;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${config.public.backendHost}/tipoContrato/deleteContrato/${tipoContratoAEliminar.value.id_tipo_contrato}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });
    if (response.status === 401 || response.status === 403) {
      errorBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }
    if (!response.ok) {
      const errorData = await response.json();
      errorBanner.value = {
        title: `Error al eliminar: ${response.status}`,
        description: errorData.message || JSON.stringify(errorData),
        type: 'error'
      };
      return;
    }
    errorBanner.value = {
      title: 'Tipo de Contrato eliminado',
      description: `El tipo de contrato fue eliminado correctamente`,
      type: 'success'
    };
    await fetchItems(currentPage.value, itemsPorPage.value);
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  } finally {
    tipoContratoAEliminar.value = null;
  }
}

const entidadesActions = [
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          class: 'h-5 w-5',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
          })
        ])
      }
    },
    handler: (item) => {
      selectedTipoContrato.value = { ...item };
      isEditing.value = true;
      isViewing.value = false;
      showModal.value = true;
    }
  },
  {
    name: 'Eliminar',
    icon: {
      render() {
        return h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          class: 'h-5 w-5',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          })
        ])
      }
    },
    iconOnly: true,
    handler: (item) => {
      tipoContratoAEliminar.value = item;
      showConfirmBanner.value = true;
    }
  }
];

// Función para abrir el modal en modo creación
function nuevoTipoContrato() {
  selectedTipoContrato.value = {};
  isEditing.value = false;
  isViewing.value = false;
  showModal.value = true;
}

// Función para manejar el envío del formulario del modal de TipoContrato
const handleTipoContratoSubmit = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const url = isEditing.value
      ? `${config.public.backendHost}/tipoContrato/UpdateContrato/${selectedTipoContrato.value.id_tipo_contrato}`
      : `${config.public.backendHost}/tipoContrato/CreateContrato`;

    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    // Si la respuesta es 401, redirigir a la página principal
    if (response.status === 401 || response.status === 403) {
      errorBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }

    // Si la respuesta es 400 o 500, mostrar los errores de validación
    if (response.status === 400 || response.status === 500) {
      const errorData = await response.json();
      if (errorData.error) {
        errorBanner.value = {
          title: `Errores de validación: ${response.status}`,
          description: errorData.message,
          type: 'error'
        };
      } else {
        errorBanner.value = {
          title: `Error: ${response.status}`,
          description: JSON.stringify(errorData),
          type: 'error'
        };
      }
      return;
    }

    if (response.ok) {
      if (isEditing.value) {
        errorBanner.value = {
          title: `Tipo de Contrato Actualizado: ${response.status}`,
          description: `El tipo de contrato ${formData.nombre} se actualizó con éxito`,
          type: 'success'
        };
        showModal.value = false;
      } else {
        errorBanner.value = {
          title: `Tipo de Contrato Creado: ${response.status}`,
          description: `El tipo de contrato ${formData.nombre} se creó con éxito`,
          type: 'success'
        };
        showModal.value = false;
      }
      // Recargar los datos después de crear/editar
      await fetchItems(currentPage.value, itemsPorPage.value);
    } else {
      console.error('Error al guardar el tipo de contrato');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
  