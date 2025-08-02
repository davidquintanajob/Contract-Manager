<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Banner de mensajes -->
      <div v-if="errorBanner" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
        <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type" @close="errorBanner = null" class="pointer-events-auto" />
      </div>
      <!-- Encabezado -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Asociar Trabajador a Contratos</h2>
            <p v-if="trabajador" class="text-sm text-gray-600 mt-1">
              Trabajador: <span class="font-medium">{{ trabajador.nombre }}</span> - 
              <span class="font-medium">{{ trabajador.cargo }}</span>
            </p>
          </div>
          <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Filtros de búsqueda -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filtro por número consecutivo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número consecutivo</label>
            <input 
              v-model="filtros.numConsecutivo" 
              type="number" 
              min="0"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por número..."
            />
          </div>
          
          <!-- Filtro por entidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
            <SelectSearch
              v-model="filtros.entidad"
              :options="opcionesEntidades"
              labelKey="label"
              valueKey="value"
              placeholder="Seleccionar entidad..."
              class="w-full"
            />
          </div>
          
          <!-- Filtro por tipo de contrato -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
            <SelectSearch
              v-model="filtros.tipoContrato"
              :options="opcionesTiposContrato"
              labelKey="label"
              valueKey="value"
              placeholder="Seleccionar tipo..."
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Lista izquierda - Contratos existentes -->
        <div class="w-1/2 border-r border-gray-200 p-4 overflow-y-auto" ref="scrollContainer">
          <h3 class="text-lg font-semibold mb-4 text-blue-600">Contratos Existentes</h3>
          <div v-if="isLoading && contratosDisponibles.length === 0" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <div v-else class="space-y-2">
            <div 
              v-for="contrato in contratosDisponibles" 
              :key="contrato.id_contrato"
              @click="moverContrato(contrato, 'izquierda')"
              class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900">{{ contrato.entidad?.nombre || 'Sin entidad' }}</h4>
                  <p class="text-sm text-gray-600">N° {{ contrato.num_consecutivo }}</p>
                  <p class="text-sm text-gray-600">{{ contrato.tipoContrato?.nombre || 'Sin tipo' }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(contrato.fecha_inicio) }} - {{ formatDate(contrato.fecha_fin) }}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <!-- Loading indicator para paginación -->
            <div v-if="isLoadingMore" class="flex justify-center items-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>

        <!-- Lista derecha - Contratos asociados -->
        <div class="w-1/2 p-4 overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-green-600">Contratos Asociados</h3>
          <div class="space-y-2">
            <div 
              v-for="contrato in contratosAsociados" 
              :key="contrato.id_contrato"
              @click="moverContrato(contrato, 'derecha')"
              class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900">{{ contrato.entidad?.nombre || 'Sin entidad' }}</h4>
                  <p class="text-sm text-gray-600">N° {{ contrato.num_consecutivo }}</p>
                  <p class="text-sm text-gray-600">{{ contrato.tipoContrato?.nombre || 'Sin tipo' }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(contrato.fecha_inicio) }} - {{ formatDate(contrato.fecha_fin) }}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie del modal -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            <span class="font-medium">{{ contratosDisponibles.length }}</span> contratos disponibles | 
            <span class="font-medium">{{ contratosAsociados.length }}</span> contratos asociados
          </div>
          <div class="flex space-x-3">
            <button 
              @click="$emit('update:modelValue', false)"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button 
              @click="guardarAsociaciones"
              class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Asociaciones
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import SelectSearch from './SelectSearch.vue';
import MessageBanner from './MessageBanner.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  trabajador: { type: Object, default: () => ({}) },
  entidades: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'save-associations']);

// Computed para acceder al trabajador
const trabajador = computed(() => props.trabajador);

// Estado
const isLoading = ref(false);
const isLoadingMore = ref(false);
const contratosDisponibles = ref([]);
const contratosAsociados = ref([]);
const currentPage = ref(1);
const hasNextPage = ref(true);
const scrollContainer = ref(null);

// Filtros
const filtros = ref({
  numConsecutivo: '',
  entidad: null,
  tipoContrato: null
});

// Opciones para los SelectSearch
const opcionesEntidades = computed(() =>
  props.entidades.map(e => ({ value: e.id_entidad, label: e.nombre }))
);
const opcionesTiposContrato = ref([]);

// Lista original de contratos para filtrado local
const contratosOriginales = ref([]);

// IDs de contratos en cada lado
const contratosAsociadosIds = ref([]);
const contratosDisponiblesIds = ref([]);

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  return new Date(dateString).toLocaleDateString('es-ES');
};

// Función para cargar contratos desde la API con paginación
const fetchContratos = async (page = 1, append = false) => {
  if (page === 1) {
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }
  
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    
    // Preparar el body para el filtro
    const body = {
      // Aquí puedes agregar filtros específicos si los necesitas
      // Por ejemplo: entidad: filtros.value.entidad,
      // tipoContrato: filtros.value.tipoContrato
    };
    
    const res = await fetch(`${config.public.backendHost}/contrato/filter/${page}/700`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (res.status === 401 || res.status === 403) {
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
    
    const data = await res.json();
    if (data.data && Array.isArray(data.data)) {
      if (append) {
        const todosLosContratos = [...contratosOriginales.value, ...data.data];
        contratosOriginales.value = todosLosContratos;
      } else {
        contratosOriginales.value = data.data;
      }
      // Inicializar los IDs solo la primera vez
      if (!append) {
        if (trabajador.value && trabajador.value.contratos) {
          contratosAsociadosIds.value = trabajador.value.contratos.map(c => c.id_contrato);
        } else {
          contratosAsociadosIds.value = [];
        }
        contratosDisponiblesIds.value = contratosOriginales.value
          .map(c => c.id_contrato)
          .filter(id => !contratosAsociadosIds.value.includes(id));
      } else {
        // Si se agregan más contratos, añadir sus IDs a disponibles si no están en asociados
        const nuevosIds = data.data.map(c => c.id_contrato).filter(id => !contratosAsociadosIds.value.includes(id));
        contratosDisponiblesIds.value.push(...nuevosIds.filter(id => !contratosDisponiblesIds.value.includes(id)));
      }
      aplicarFiltrosLocales();
      
      // Actualizar información de paginación
      if (data.pagination) {
        hasNextPage.value = data.pagination.hasNextPage;
        currentPage.value = data.pagination.currentPage;
      }
    } else {
      if (!append) {
        contratosDisponibles.value = [];
        contratosAsociados.value = [];
      }
    }
  } catch (error) {
    console.error('Error al cargar contratos:', error);
    if (!append) {
      contratosDisponibles.value = [];
      contratosAsociados.value = [];
    }
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// Función para separar contratos según si están asociados al trabajador
const separarContratos = (todosLosContratos) => {
  if (!trabajador.value || !trabajador.value.contratos) {
    return {
      disponibles: todosLosContratos,
      asociados: []
    };
  }

  const contratosAsociadosIds = trabajador.value.contratos.map(c => c.id_contrato);
  
  const disponibles = todosLosContratos.filter(contrato => 
    !contratosAsociadosIds.includes(contrato.id_contrato)
  );
  
  const asociados = todosLosContratos.filter(contrato => 
    contratosAsociadosIds.includes(contrato.id_contrato)
  );

  return { disponibles, asociados };
};

// Función para cargar más contratos (scroll infinito)
const loadMoreContratos = async () => {
  if (hasNextPage.value && !isLoadingMore.value) {
    await fetchContratos(currentPage.value + 1, true);
  }
};

// Función para manejar el scroll
const handleScroll = async (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  
  // Si estamos cerca del final (100px antes del final), cargar más
  if (scrollHeight - scrollTop - clientHeight < 100) {
    await loadMoreContratos();
  }
};

// Función para mover contratos entre listas
const moverContrato = (contrato, direccion) => {
  if (direccion === 'izquierda') {
    // Mover de disponibles a asociados
    const idx = contratosDisponiblesIds.value.indexOf(contrato.id_contrato);
    if (idx !== -1) {
      contratosDisponiblesIds.value.splice(idx, 1);
      contratosAsociadosIds.value.push(contrato.id_contrato);
      aplicarFiltrosLocales();
    }
  } else {
    // Mover de asociados a disponibles
    const idx = contratosAsociadosIds.value.indexOf(contrato.id_contrato);
    if (idx !== -1) {
      contratosAsociadosIds.value.splice(idx, 1);
      contratosDisponiblesIds.value.push(contrato.id_contrato);
      aplicarFiltrosLocales();
    }
  }
};

const errorBanner = ref(null);

// Función para guardar las asociaciones
const guardarAsociaciones = async () => {
  const token = localStorage.getItem('token');
  const config = useRuntimeConfig();
  const idTrabajador = trabajador.value?.id_trabajador_autorizado;
  const idsContratos = contratosAsociadosIds.value;
  if (!idTrabajador) {
    errorBanner.value = {
      title: 'Error',
      description: 'No se encontró el ID del trabajador.',
      type: 'error'
    };
    return;
  }
  // Verificar si hay token antes de la petición
  if (!token) {
    window.location.href = '/';
    return;
  }
  try {
    const res = await fetch(`${config.public.backendHost}/contratoTrabajador/syncTrabajadorContratos`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id_trabajador_autorizado: idTrabajador,
        ids_contratos: idsContratos
      })
    });
    // Redirigir si la respuesta es 401 o 403
    if (res.status === 401 || res.status === 403) {
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
    if (res.ok) {
      errorBanner.value = {
        title: '¡Asociaciones guardadas correctamente!',
        description: 'Las asociaciones del trabajador fueron actualizadas.',
        type: 'success'
      };
      setTimeout(() => {
        emit('update:modelValue', false);
        emit('save-associations', {
          id_trabajador_autorizado: idTrabajador,
          ids_contratos: idsContratos
        });
        errorBanner.value = null;
      }, 1200);
    } else {
      const errorData = await res.json();
      errorBanner.value = {
        title: 'Error al guardar asociaciones',
        description: errorData.message || res.status,
        type: 'error'
      };
    }
  } catch (error) {
    errorBanner.value = {
      title: 'Error de red al guardar asociaciones',
      description: error.message,
      type: 'error'
    };
  }
};

// Función de filtrado local visual
function aplicarFiltrosLocales() {
  // Filtrar sobre el estado actual de cada lado
  let disponibles = contratosOriginales.value.filter(c => contratosDisponiblesIds.value.includes(c.id_contrato));
  let asociados = contratosOriginales.value.filter(c => contratosAsociadosIds.value.includes(c.id_contrato));
  // Filtro por número consecutivo
  if (filtros.value.numConsecutivo) {
    disponibles = disponibles.filter(c => String(c.num_consecutivo).includes(String(filtros.value.numConsecutivo)));
    asociados = asociados.filter(c => String(c.num_consecutivo).includes(String(filtros.value.numConsecutivo)));
  }
  // Filtro por entidad
  if (filtros.value.entidad) {
    disponibles = disponibles.filter(c => String(c.entidad?.id_entidad) === String(filtros.value.entidad));
    asociados = asociados.filter(c => String(c.entidad?.id_entidad) === String(filtros.value.entidad));
  }
  // Filtro por tipo de contrato
  if (filtros.value.tipoContrato) {
    disponibles = disponibles.filter(c => String(c.tipoContrato?.id_tipo_contrato) === String(filtros.value.tipoContrato));
    asociados = asociados.filter(c => String(c.tipoContrato?.id_tipo_contrato) === String(filtros.value.tipoContrato));
  }
  contratosDisponibles.value = disponibles;
  contratosAsociados.value = asociados;
}

// Observar cambios en los filtros para aplicar filtrado local
watch(filtros, (nuevosFiltros) => {
  aplicarFiltrosLocales();
}, { deep: true });

// Cargar contratos cuando se abre el modal
watch(() => props.modelValue, async (val) => {
  if (val) {
    await fetchTiposContrato();
    resetearYRecargar();
  }
});

// Configurar scroll listener cuando el componente se monta
onMounted(async () => {
  if (props.modelValue) {
    resetearYRecargar();
  }
  
  // Agregar listener de scroll después de que el DOM se actualice
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});

// Limpiar listener de scroll cuando se desmonta
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
});

const fetchTiposContrato = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const res = await fetch(`${config.public.backendHost}/tipoContrato`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    opcionesTiposContrato.value = Array.isArray(data.data)
      ? data.data.map(t => ({ value: t.id_tipo_contrato, label: t.nombre }))
      : [];
  } catch (error) {
    opcionesTiposContrato.value = [];
  }
};

// En resetearYRecargar, limpiar los IDs también
const resetearYRecargar = () => {
  currentPage.value = 1;
  hasNextPage.value = true;
  contratosDisponibles.value = [];
  contratosAsociados.value = [];
  contratosOriginales.value = [];
  contratosDisponiblesIds.value = [];
  contratosAsociadosIds.value = [];
  fetchContratos(1, false);
};
</script> 