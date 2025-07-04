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
        :title="'¿Estás seguro que deseas eliminar esta oferta?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteOferta"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="container mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <!-- Campo de búsqueda principal (por descripción) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por descripción</label>
          <div class="relative">
            <input type="text" v-model="descripcion" placeholder="Ingrese la descripción..."
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
        <!-- Botón para mostrar/ocultar filtros en móvil -->
        <div class="md:hidden flex justify-between items-center mb-4">
          <button @click="showFilters = !showFilters" class="flex items-center text-blue-500 hover:text-blue-600">
            <span class="mr-2">Filtros adicionales</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform"
              :class="{ 'rotate-180': showFilters }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <!-- Campos adicionales (colapsables en móvil) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
          :class="{ 'hidden md:grid': !showFilters }">
          <!-- Fecha inicio -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input type="date" v-model="fecha_inicio" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="handleSearch">
          </div>
          <!-- Fecha fin -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input type="date" v-model="fecha_fin" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="handleSearch">
          </div>
          <!-- Usuario -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
            <SelectSearch
              v-model="id_usuario"
              :options="usuarios"
              labelKey="nombre"
              valueKey="id_usuario"
              placeholder="Buscar usuario..."
            />
          </div>
          <!-- Contrato -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contrato</label>
            <SelectSearch
              v-model="id_contrato"
              :options="contratos"
              :labelKey="(c) => `${c.entidad?.nombre}: ${c?.num_consecutivo} - ${c.tipoContrato?.nombre} - (${c.fecha_inicio?.substring(0,4)})`"
              valueKey="id_contrato"
              placeholder="Buscar contrato..."
            />
          </div>
        </div>
        <!-- Botón de búsqueda -->
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
    <!-- Tabla de ofertas -->
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Ofertas</h2>
        <button @click="nuevaOferta"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Oferta
        </button>
      </div>
      <DataTable :columns="ofertasColumns" :items="itemsData" :actions="ofertasActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" />
    </div>
    <!-- Modal de Oferta (estructura base, puedes personalizarla luego) -->
    <OfertaModal
      v-model="showModal"
      :oferta="selectedOferta"
      :is-editing="isEditing"
      :is-viewing="isViewing"
      :usuarios="usuarios"
      :contratos="contratos"
      :id_usuario="selectedOferta.id_usuario ?? selectedOferta.usuario?.id_usuario ?? null"
      :id_contrato="selectedOferta.id_contrato ?? selectedOferta.contrato?.id_contrato ?? null"
      @submit="handleOfertaSubmit"
    />
  </div>
</template>

<script setup>
import { ref, h, onMounted, computed } from 'vue';
import Navbar from "@/components/Navbar.vue";
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import OfertaModal from '@/components/OfertaModal.vue';
import SelectSearch from '@/components/SelectSearch.vue';
import * as XLSX from 'xlsx';

// Variables reactivas para los elementos de búsqueda
const descripcion = ref('');
const fecha_inicio = ref('');
const fecha_fin = ref('');
const id_usuario = ref('');
const id_contrato = ref('');
const showFilters = ref(false);

// Listas para selects y filtros internos
const usuarios = ref([]);
const contratos = ref([]);

// Variables para el modal
const showModal = ref(false);
const selectedOferta = ref({});
const isEditing = ref(false);
const isViewing = ref(false);

// Configuración de la tabla de Ofertas
const ofertasColumns = [
  { key: 'id_oferta', label: 'ID' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha_inicio', label: 'Fecha Inicio' },
  { key: 'fecha_fin', label: 'Fecha Fin' },
  { key: 'contrato.num_consecutivo', label: 'Num Contrato' },
  { key: 'usuario.nombre', label: 'Usuario' }
];

// Variables para la paginación
const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(20);
const itemsData = ref([]);

// Variables para banners y confirmación
const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const ofertaAEliminar = ref(null);

// Obtener la configuración
const config = useRuntimeConfig();

// Obtener usuarios y contratos al montar
const fetchUsuariosYContratos = async () => {
  try {
    const token = localStorage.getItem('token');
    // Usuarios
    const resUsuarios = await fetch(`${config.public.backendHost}/usuario`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });
    const dataUsuarios = await resUsuarios.json();
    usuarios.value = Array.isArray(dataUsuarios.data) ? dataUsuarios.data : dataUsuarios;
    // Contratos
    const resContratos = await fetch(`${config.public.backendHost}/contrato`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });
    const dataContratos = await resContratos.json();
    contratos.value = Array.isArray(dataContratos.data) ? dataContratos.data : dataContratos;
  } catch (error) {
    console.error('Error al cargar usuarios o contratos:', error);
  }
};

// Función para cargar datos de la API
const fetchItems = async (
  page = 1,
  limit = 20,
  fecha_inicio = '',
  fecha_fin = '',
  id_contrato_ = '',
  id_usuario_ = '',
  descripcion_ = ''
    ) => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');

    const body = {
      descripcion: descripcion_,
      fecha_inicio,
      fecha_fin,
      id_contrato: id_contrato_,
      id_usuario: id_usuario_,
      page,
      limit
    };
    const response = await fetch(`${config.public.backendHost}/oferta/filterOfertas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (response.status === 401 || response.status === 403) {
      navigateTo('/');
      return;
    }
    const data = await response.json();
    // Formatear fechas a 'YYYY-MM-DD'
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return dateStr.split('T')[0];
    };
    const ofertasFormateadas = (data || []).map(oferta => ({
      ...oferta,
      fecha_inicio: formatDate(oferta.fecha_inicio),
      fecha_fin: formatDate(oferta.fecha_fin),
      contrato: oferta.contrato ? {
        ...oferta.contrato,
        fecha_inicio: formatDate(oferta.contrato.fecha_inicio),
        fecha_fin: formatDate(oferta.contrato.fecha_fin)
      } : oferta.contrato,
    }));
    itemsData.value = ofertasFormateadas;
    totalItems.value = itemsData.value.length;
  } catch (error) {
    console.error('Error al cargar las ofertas:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  fetchItems(1, itemsPorPage.value, fecha_inicio.value, fecha_fin.value, id_contrato.value, id_usuario.value, descripcion.value);
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems(newPage, itemsPorPage.value, fecha_inicio.value, fecha_fin.value, id_contrato.value, id_usuario.value, descripcion.value);
};

onMounted(() => {
  fetchUsuariosYContratos();
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

// Función para abrir el modal asegurando que los datos estén cargados
async function abrirModalOferta(item, modo) {
  if (!usuarios.value.length || !contratos.value.length) {
    await fetchUsuariosYContratos();
  }
  selectedOferta.value = { ...item };
  isEditing.value = modo === 'editar';
  isViewing.value = modo === 'ver';
  showModal.value = true;
}

// Modificar las acciones para usar abrirModalOferta
const ofertasActions = [
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
            d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
          })
        ])
      }
    },
    handler: (item) => {
      abrirModalOferta(item, 'ver');
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
    handler: (item) => {
      abrirModalOferta(item, 'editar');
    }
  },
  {
    name: 'Eliminar',
    icon: deleteIcon,
    iconOnly: true,
    handler: (item) => {
      ofertaAEliminar.value = item;
      showConfirmBanner.value = true;
    }
  }
];

// Modificar nuevaOferta para usar abrirModalOferta
async function nuevaOferta() {
  if (!usuarios.value.length || !contratos.value.length) {
    await fetchUsuariosYContratos();
  }
  selectedOferta.value = {};
  isEditing.value = false;
  isViewing.value = false;
  showModal.value = true;
}

function confirmDeleteOferta() {
  showConfirmBanner.value = false;
  if (!ofertaAEliminar.value) return;
  try {
    const token = localStorage.getItem('token');
    fetch(`${config.public.backendHost}/oferta/DeleteOferta/${ofertaAEliminar.value.id_oferta}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    })
      .then(async response => {
        if (response.status === 401 || response.status === 403) {
          navigateTo('/');
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
          title: 'Oferta eliminada',
          description: 'La oferta fue eliminada correctamente',
          type: 'success'
        };
        await fetchItems(currentPage.value, itemsPorPage.value);
      })
      .catch(error => {
        errorBanner.value = {
          title: 'Error',
          description: error.message,
          type: 'error'
        };
      })
      .finally(() => {
        ofertaAEliminar.value = null;
      });
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
    ofertaAEliminar.value = null;
  }
}

// Manejar submit del modal
const handleOfertaSubmit = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const url = isEditing.value
      ? `${config.public.backendHost}/oferta/UpdateOferta/${selectedOferta.value.id_oferta}`
      : `${config.public.backendHost}/oferta/CreateOferta`;
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
      navigateTo('/');
      return;
    }
    if (response.status === 400 || response.status === 500) {
      const errorData = await response.json();
      errorBanner.value = {
        title: `Error: ${response.status}`,
        description: errorData.message || JSON.stringify(errorData),
        type: 'error'
      };
      return;
    }
    if (response.ok) {
      errorBanner.value = {
        title: isEditing.value ? 'Oferta actualizada' : 'Oferta creada',
        description: `La oferta se ${isEditing.value ? 'actualizó' : 'creó'} correctamente`,
        type: 'success'
      };
      await fetchItems(currentPage.value, itemsPorPage.value);
      showModal.value = false;
    } else {
      console.error('Error al guardar la oferta');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

function exportToExcel() {
  const exportData = itemsData.value.map(item => ({
    'ID Oferta': item.id_oferta,
    'Descripción': item.descripcion,
    'Fecha Inicio': item.fecha_inicio,
    'Fecha Fin': item.fecha_fin,
    'Num Contrato': item.contrato?.num_consecutivo,
    'Usuario': item.usuario?.nombre
  }));
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ofertas');
  XLSX.writeFile(workbook, 'ofertas.xlsx');
}
</script>
