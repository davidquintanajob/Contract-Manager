<template>
  <div>
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar este contrato?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteContrato"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="container mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por entidad</label>
          <div class="relative">
            <input type="text" v-model="nombre_entidad" placeholder="Ingrese el nombre de la entidad..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch">
            <div class="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de contrato</label>
            <SelectSearch
              v-model="id_tipo_contrato"
              :options="tipoContratos"
              labelKey="nombre"
              valueKey="id_tipo_contrato"
              placeholder="Buscar tipo de contrato..."
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input type="date" v-model="fecha_inicio" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input type="date" v-model="fecha_fin" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Num. consecutivo</label>
            <input type="number" v-model.number="num_consecutivo" placeholder="Número consecutivo"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch">
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
    <!-- Tabla de contratos -->
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Contratos</h2>
        <button @click="nuevoContrato"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Contrato
        </button>
      </div>
      <DataTable :columns="contratosColumns" :items="itemsData" :actions="contratosActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" />
    </div>
    <!-- Modal de Contrato (estructura base, puedes personalizarla luego) -->
    <ContratoModal
      v-model="showModal"
      :contrato="selectedContrato"
      :is-editing="isEditing"
      :is-viewing="isViewing"
      :entidades="entidades"
      :tipos-contrato="tipoContratos"
      @submit="handleContratoSubmit"
    />
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import Navbar from "@/components/Navbar.vue";
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import SelectSearch from '@/components/SelectSearch.vue';
import ContratoModal from '@/components/ContratoModal.vue';
import * as XLSX from 'xlsx';

const nombre_entidad = ref('');
const id_tipo_contrato = ref('');
const fecha_inicio = ref('');
const fecha_fin = ref('');
const num_consecutivo = ref('');
const showFilters = ref(false);

const tipoContratos = ref([]);
const entidades = ref([]);

const showModal = ref(false);
const selectedContrato = ref({});
const isEditing = ref(false);
const isViewing = ref(false);

const contratosColumns = [
  { key: 'num_consecutivo', label: 'Num. Consecutivo' },
  { 
    key: 'fecha_inicio', 
    label: 'Fecha Inicio', 
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
    }
  },
  { 
    key: 'fecha_fin', 
    label: 'Fecha Fin', 
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      const fechaActual = new Date();
      const fechaFin = new Date(value);
      
      // Si la fecha actual es mayor que la fecha fin, fondo rojo (vencido)
      // Si no, fondo verde (vigente)
      const bgColor = fechaActual > fechaFin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
      
      return `<span class="px-2 py-1 rounded text-sm font-medium ${bgColor}">${fechaFormateada}</span>`;
    }
  },
  { key: 'clasificacion', label: 'Clasificación' },
  { key: 'entidad.nombre', label: 'Entidad' },
  { key: 'tipoContrato.nombre', label: 'Tipo de Contrato' }
];

const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(10);
const itemsData = ref([]);

const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const contratoAEliminar = ref(null);

const config = useRuntimeConfig();

const contratosActions = [
  {
    name: 'Ver Detalles',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })
        ]);
      }
    },
    handler: (item) => abrirModalContrato(item, 'ver'),
    iconOnly: false
  },
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 7.5-7.5z' })
        ]);
      }
    },
    handler: (item) => abrirModalContrato(item, 'editar'),
    iconOnly: false
  },
  {
    name: 'Eliminar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5 text-red-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2' })
        ]);
      }
    },
    handler: (item) => eliminarContrato(item),
    iconOnly: false
  }
];

const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchContratos(1);
  } catch (error) {
    console.error('Error al buscar contratos:', error);
  } finally {
    isLoading.value = false;
  }
};

function handlePageChange(page) {
  fetchContratos(page);
}

async function fetchContratos(page = 1) {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const body = {
      nombre_entidad: nombre_entidad.value || undefined,
      id_tipo_contrato: id_tipo_contrato.value || undefined,
      fecha_inicio: fecha_inicio.value || undefined,
      fecha_fin: fecha_fin.value || undefined,
      num_consecutivo: num_consecutivo.value || undefined
    };
    const res = await fetch(`${config.public.backendHost}/contrato/filter/${page}/${itemsPorPage.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
    });
    
    // Verificar si hay error de autenticación
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigateTo('/');
      return;
    }
    
    const data = await res.json();
    // Formatear fechas para mostrar solo YYYY-MM-DD
    itemsData.value = (data.data || []).map(c => ({
      ...c,
      fecha_inicio: c.fecha_inicio ? c.fecha_inicio.substring(0, 10) : '',
      fecha_fin: c.fecha_fin ? c.fecha_fin.substring(0, 10) : ''
    }));
    totalItems.value = data.pagination?.total || 0;
    currentPage.value = data.pagination?.currentPage || 1;
  } catch (err) {
    errorBanner.value = { title: 'Error', description: 'No se pudieron cargar los contratos', type: 'error' };
  }
}

async function fetchTipoContratos() {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/tipoContrato`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });
    
    // Verificar si hay error de autenticación
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigateTo('/');
      return;
    }
    
    const data = await res.json();
    tipoContratos.value = data.data || [];
  } catch (err) {
    tipoContratos.value = [];
  }
}

async function fetchEntidades() {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/entidad`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });
    
    // Verificar si hay error de autenticación
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigateTo('/');
      return;
    }
    
    const data = await res.json();
    entidades.value = data.data || [];
  } catch (err) {
    entidades.value = [];
  }
}

function abrirModalContrato(item, modo) {
  selectedContrato.value = item ? { ...item } : {};
  isEditing.value = modo === 'editar';
  isViewing.value = modo === 'ver';
  showModal.value = true;
}

async function nuevoContrato() {
  if (!entidades.value.length) await fetchEntidades();
  if (!tipoContratos.value.length) await fetchTipoContratos();
  abrirModalContrato({}, 'crear');
}

function eliminarContrato(item) {
  contratoAEliminar.value = item;
  showConfirmBanner.value = true;
}

async function confirmDeleteContrato() {
  if (!contratoAEliminar.value) return;
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/contrato/deleteContrato/${contratoAEliminar.value.id_contrato}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });
    
    // Verificar si hay error de autenticación
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigateTo('/');
      return;
    }
    
    if (!res.ok) {
      let errorMsg = 'No se pudo eliminar el contrato';
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    errorBanner.value = { title: 'Éxito', description: 'Contrato eliminado correctamente', type: 'success' };
    fetchContratos(currentPage.value);
  } catch (err) {
    errorBanner.value = { title: 'Error', description: err.message, type: 'error' };
  } finally {
    showConfirmBanner.value = false;
    contratoAEliminar.value = null;
  }
}

const handleContratoSubmit = async (formData) => {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const url = isEditing.value
      ? `${config.public.backendHost}/contrato/UpdateContrato/${selectedContrato.value.id_contrato}`
      : `${config.public.backendHost}/contrato/createContrato`;
    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigateTo('/');
      return;
    }
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
          title: `Contrato Actualizado: ${response.status}`,
          description: `El contrato se actualizó con éxito`,
          type: 'success'
        };
      } else {
        errorBanner.value = {
          title: `Contrato Creado: ${response.status}`,
          description: `El contrato se creó con éxito`,
          type: 'success'
        };
      }
      showModal.value = false;
      await fetchContratos(currentPage.value);
    } else {
      console.error('Error al guardar el contrato');
    }
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  }
};

function exportToExcel() {
  const exportData = itemsData.value.map(item => ({
    'Num. Consecutivo': item.num_consecutivo,
    'Fecha Inicio': item.fecha_inicio,
    'Fecha Fin': item.fecha_fin,
    'Clasificación': item.clasificacion,
    'Entidad': item.entidad?.nombre,
    'Tipo de Contrato': item.tipoContrato?.nombre
  }));
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos');
  XLSX.writeFile(workbook, 'contratos.xlsx');
}

onMounted(() => {
  // Verificar si hay token antes de hacer las peticiones
  const token = localStorage.getItem('token');
  if (!token) {
    navigateTo('/');
    return;
  }
  
  fetchEntidades();
  fetchTipoContratos();
  fetchContratos();
});

const deleteIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6 text-red-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2' })
    ]);
  }
};
</script> 