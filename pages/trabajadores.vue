<template>
  <div>
    <SeoMeta title="Trabajadores - Contract Manager" description="Registra y gestiona trabajadores autorizados y sus contratos." canonical="/trabajadores" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar este trabajador?'"
        :description="'Esta acción no se puede deshacer.'"
        type="warning"
        @confirm="confirmDeleteTrabajador"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="container mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex flex-col md:flex-row gap-2 items-center mb-4 md:mb-2">
          <div class="w-full md:w-1/4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchNombre"
                placeholder="Ingrese el nombre..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch"
              >
              <div class="absolute left-3 top-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por cargo</label>
            <input
              type="text"
              v-model="searchCargo"
              placeholder="Ingrese el cargo..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="w-full md:w-1/4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad</label>
            <input
              type="text"
              v-model="searchCarnet"
              placeholder="Carnet de identidad..."
              maxlength="11"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="onCarnetInput"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="w-full md:w-1/4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
            <SelectSearch
              v-model="searchEntidad"
              :options="entidades"
              labelKey="nombre"
              valueKey="id_entidad"
              placeholder="Buscar entidad..."
            />
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2">
          <button @click="handleSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button @click="exportToExcel"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de Trabajadores -->
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Trabajadores Autorizados</h2>
        <button @click="nuevaTrabajador"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Trabajador
        </button>
      </div>
      <DataTable
        :columns="trabajadoresColumns"
        :items="trabajadoresData"
        :actions="trabajadoresActions"
        :total-items="totalTrabajadores"
        :items-per-page="itemsPorPage"
        :current-page="currentPage"
        :is-loading="isLoading"
        @page-change="handlePageChange"
      />
    </div>
    <!-- Modal de Trabajador -->
    <TrabajadorModal v-model="showModal" :trabajador="selectedTrabajador" :is-editing="isEditing" :is-viewing="isViewing" @submit="handleSubmit" />
    <!-- Modal de Asociación -->
    <TrabajadorAsociacionModal v-model="showAsociacionModal" :trabajador="selectedTrabajador" :entidades="entidades" @save-associations="handleSaveAssociations" />
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import SeoMeta from '@/components/SeoMeta.vue';
import Navbar from '@/components/Navbar.vue';
import DataTable from '@/components/DataTable.vue';
import TrabajadorModal from '@/components/TrabajadorModal.vue';
import TrabajadorAsociacionModal from '@/components/TrabajadorAsociacionModal.vue';
import SelectSearch from '@/components/SelectSearch.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import { useRouter } from 'nuxt/app';
import * as XLSX from 'xlsx';

const { navigateTo } = useRouter();

const searchNombre = ref('');
const searchCargo = ref('');
const searchCarnet = ref('');
const searchEntidad = ref('');
const trabajadoresData = ref([]);
const totalTrabajadores = ref(0);
const itemsPorPage = ref(10);
const currentPage = ref(1);
const isLoading = ref(false);
const showModal = ref(false);
const showAsociacionModal = ref(false);
const selectedTrabajador = ref(null);
const entidades = ref([]);
const isEditing = ref(false);
const isViewing = ref(false);
const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const trabajadorAEliminar = ref(null);

const trabajadoresColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'carnet_identidad', label: 'Carnet de Identidad' },
  { key: 'num_telefono', label: 'Teléfono' },
  { key: 'contratosAsociados', label: 'Contratos Asociados' }
];

const trabajadoresActions = [
  {
    name: 'Ver Detalles',
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
            d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          }),
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
          })
        ])
      }
    },
    handler: (trabajador) => {
      selectedTrabajador.value = trabajador;
      isEditing.value = false;
      isViewing.value = true;
      showModal.value = true;
    }
  },
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
    handler: (trabajador) => {
      selectedTrabajador.value = trabajador;
      isEditing.value = true;
      isViewing.value = false;
      showModal.value = true;
    }
  },
  {
    name: 'Asociar',
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
            d: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
          })
        ])
      }
    },
    handler: (trabajador) => {
      selectedTrabajador.value = trabajador;
      showAsociacionModal.value = true;
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
    handler: (trabajador) => {
      trabajadorAEliminar.value = trabajador;
      showConfirmBanner.value = true;
    }
  }
];

const fetchEntidades = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const res = await fetch(`${config.public.backendHost}/entidad`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    entidades.value = Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    entidades.value = [];
  }
};

const fetchTrabajadores = async (page = currentPage.value, limit = itemsPorPage.value) => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const body = {
      nombre: searchNombre.value,
      cargo: searchCargo.value,
      carnet_identidad: searchCarnet.value,
      id_entidad: searchEntidad.value
    };
    const res = await fetch(`${config.public.backendHost}/trabajadorAutorizado/filter/${page}/${limit}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    trabajadoresData.value = Array.isArray(data.data)
      ? data.data.map(t => ({ ...t, contratosAsociados: Array.isArray(t.contratos) ? t.contratos.length : 0 }))
      : [];
    totalTrabajadores.value = data.pagination?.total || 0;
  } catch (error) {
    trabajadoresData.value = [];
    totalTrabajadores.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchTrabajadores(page);
};

onMounted(() => {
  fetchTrabajadores();
  fetchEntidades();
});

const handleSubmit = async (trabajador) => {
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    
    const url = isEditing.value
      ? `${config.public.backendHost}/trabajadorAutorizado/UpdateTrabajadorAutorizado/${selectedTrabajador.value.id_trabajador_autorizado}`
      : `${config.public.backendHost}/trabajadorAutorizado/createTrabajadorAutorizado`;

    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(trabajador)
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
          title: `Trabajador Actualizado: ${response.status}`,
          description: `El trabajador ${trabajador.nombre} se actualizó con éxito`,
          type: 'success'
        };
      } else {
        errorBanner.value = {
          title: `Trabajador Creado: ${response.status}`,
          description: `El trabajador ${trabajador.nombre} se creó con éxito`,
          type: 'success'
        };
      }
      // Recargar los datos después de crear/editar
      await fetchTrabajadores(currentPage.value, itemsPorPage.value);
      // Cerrar modal y resetear estados
      showModal.value = false;
      selectedTrabajador.value = null;
      isEditing.value = false;
      isViewing.value = false;
    } else {
      console.error('Error al guardar el trabajador');
    }
  } catch (error) {
    console.error('Error:', error);
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  }
};

const onCarnetInput = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  searchCarnet.value = value;
};

const nuevaTrabajador = () => {
  selectedTrabajador.value = null;
  isEditing.value = false;
  isViewing.value = false;
  showModal.value = true;
};

const handleSaveAssociations = (data) => {
  console.log('Guardando asociaciones:', data);
  // Aquí implementarías la lógica para guardar las asociaciones
  showAsociacionModal.value = false;
  fetchTrabajadores(); // Recargar datos
};

async function confirmDeleteTrabajador() {
  showConfirmBanner.value = false;
  if (!trabajadorAEliminar.value) return;
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.backendHost}/trabajadorAutorizado/DeleteTrabajadorAutorizado/${trabajadorAEliminar.value.id_trabajador_autorizado}`, {
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
      title: 'Trabajador eliminado',
      description: `El trabajador fue eliminado correctamente`,
      type: 'success'
    };
    await fetchTrabajadores(currentPage.value, itemsPorPage.value);
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  } finally {
    trabajadorAEliminar.value = null;
  }
}

const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchTrabajadores(1, itemsPorPage.value);
  } catch (error) {
    console.error('Error al buscar trabajadores:', error);
  } finally {
    isLoading.value = false;
  }
};

function exportToExcel() {
  const exportData = trabajadoresData.value.map(item => ({
    'Nombre': item.nombre,
    'Cargo': item.cargo,
    'Carnet de Identidad': item.carnet_identidad,
    'Teléfono': item.num_telefono,
    'Contratos Asociados': item.contratosAsociados
  }));
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Trabajadores');
  XLSX.writeFile(workbook, 'trabajadores.xlsx');
}
</script> 