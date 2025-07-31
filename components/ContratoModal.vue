<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isViewing ? 'Detalles de Contrato' : (isEditing ? 'Editar Contrato' : 'Nuevo Contrato') }}
        </h2>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Entidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
            <SelectSearch
              v-model="formData.id_entidad"
              :options="entidades"
              labelKey="nombre"
              valueKey="id_entidad"
              :disabled="isViewing"
              placeholder="Selecciona una entidad"
            />
          </div>
          <!-- Tipo de Contrato -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
            <SelectSearch
              v-model="formData.id_tipo_contrato"
              :options="tiposContrato"
              labelKey="nombre"
              valueKey="id_tipo_contrato"
              :disabled="isViewing"
              placeholder="Selecciona un tipo de contrato"
            />
          </div>
          <!-- Fecha Inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <input v-model="formData.fecha_inicio" type="date" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="handleFechaInicioChange"
              required />
          </div>
          <!-- Fecha Fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <input v-model="formData.fecha_fin" type="date" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>
          <!-- Número Consecutivo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número Consecutivo</label>
            <input v-model="formData.num_consecutivo" type="number" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>
          <!-- Clasificación -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Clasificación</label>
            <input v-model="formData.clasificacion" type="text" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <!-- Nota -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <textarea v-model="formData.nota" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2" placeholder="Ingrese una nota opcional"></textarea>
          </div>
        </div>
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 mt-6" v-if="!isViewing">
          <button type="button" @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancelar
          </button>
          <button type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Contrato' }}
          </button>
        </div>
      </form>
      <!-- Tablas de detalles -->
      <div v-if="isViewing || isEditing" class="mt-8 space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-2">Trabajadores Autorizados</h3>
          <DataTable
            :columns="trabajadoresColumns"
            :items="trabajadoresData"
            :total-items="trabajadoresTotal"
            :items-per-page="trabajadoresPerPage"
            :current-page="trabajadoresPage"
            :is-loading="false"
            :show-actions="false"
            @page-change="handleTrabajadoresPageChange"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Ofertas</h3>
          <DataTable
            :columns="ofertasColumns"
            :items="ofertasData"
            :total-items="ofertasTotal"
            :items-per-page="ofertasPerPage"
            :current-page="ofertasPage"
            :is-loading="false"
            :show-actions="false"
            @page-change="handleOfertasPageChange"
          />
        </div>
      </div>
      <div v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import SelectSearch from './SelectSearch.vue';
import DataTable from './DataTable.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  contrato: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false },
  isViewing: { type: Boolean, default: false },
  entidades: { type: Array, default: () => [] },
  tiposContrato: { type: Array, default: () => [] }
});
const emit = defineEmits(['update:modelValue', 'submit']);
const formData = ref({
  id_entidad: '',
  id_tipo_contrato: '',
  fecha_inicio: '',
  fecha_fin: '',
  num_consecutivo: '',
  clasificacion: '',
  nota: ''
});
const errorMsg = ref('');

// Función para obtener el siguiente número consecutivo
async function fetchNextConsecutivo() {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const currentYear = new Date().getFullYear();
    const config = useRuntimeConfig();
    const res = await fetch(`${config.public.backendHost}/contrato/next-consecutivo/${currentYear}`, {
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
    
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.siguiente_consecutivo) {
        formData.value.num_consecutivo = data.data.siguiente_consecutivo;
      }
    } else {
      console.error('Error al obtener el siguiente consecutivo');
    }
  } catch (err) {
    console.error('Error al obtener el siguiente consecutivo:', err);
  }
}

// Watcher para detectar cuando se abre el modal en modo "nuevo contrato"
watch(() => props.modelValue, async (newValue) => {
  if (newValue && !props.isEditing && !props.isViewing) {
    // Es un nuevo contrato, obtener el siguiente consecutivo
    await fetchNextConsecutivo();
  }
});

watch(() => props.contrato, (contrato) => {
  if (contrato && Object.keys(contrato).length > 0) {
    formData.value = {
      id_entidad: contrato.id_entidad || '',
      id_tipo_contrato: contrato.id_tipo_contrato || '',
      fecha_inicio: contrato.fecha_inicio ? contrato.fecha_inicio.substring(0, 10) : '',
      fecha_fin: contrato.fecha_fin ? contrato.fecha_fin.substring(0, 10) : '',
      num_consecutivo: contrato.num_consecutivo || '',
      clasificacion: contrato.clasificacion || '',
      nota: contrato.nota || ''
    };
  } else {
    formData.value = {
      id_entidad: '',
      id_tipo_contrato: '',
      fecha_inicio: '',
      fecha_fin: '',
      num_consecutivo: '',
      clasificacion: '',
      nota: ''
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  errorMsg.value = '';
  if (!formData.value.id_entidad || !formData.value.id_tipo_contrato || !formData.value.fecha_inicio || !formData.value.fecha_fin || !formData.value.num_consecutivo) {
    errorMsg.value = 'Todos los campos obligatorios deben estar completos.';
    return;
  }
  emit('submit', { ...formData.value });
};

// Función para manejar el cambio de fecha de inicio
const handleFechaInicioChange = () => {
  // Solo aplicar la lógica si es un nuevo contrato (no edición ni visualización)
  if (!props.isEditing && !props.isViewing && formData.value.fecha_inicio) {
    const fechaInicio = new Date(formData.value.fecha_inicio);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setFullYear(fechaFin.getFullYear() + 5);
    
    // Formatear la fecha de fin como YYYY-MM-DD
    const fechaFinFormateada = fechaFin.toISOString().split('T')[0];
    formData.value.fecha_fin = fechaFinFormateada;
  }
};

// Columnas para trabajadores autorizados
const trabajadoresColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'carnet_identidad', label: 'Carnet de Identidad' },
  { key: 'num_telefono', label: 'Teléfono' }
];
const trabajadoresPage = ref(1);
const trabajadoresPerPage = 5;
const trabajadoresData = computed(() => {
  if (!props.contrato || !Array.isArray(props.contrato.trabajadoresAutorizados)) return [];
  return props.contrato.trabajadoresAutorizados;
});
const trabajadoresTotal = computed(() => trabajadoresData.value.length);
const handleTrabajadoresPageChange = (newPage) => {
  trabajadoresPage.value = newPage;
};

// Columnas para ofertas
const ofertasColumns = [
  { key: 'id_oferta', label: 'ID Oferta' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha_inicio', label: 'Fecha Inicio', format: (val) => val?.substring(0, 10) },
  { key: 'fecha_fin', label: 'Fecha Fin', format: (val) => val?.substring(0, 10) }
];
const ofertasPage = ref(1);
const ofertasPerPage = 5;
const ofertasData = computed(() => {
  if (!props.contrato || !Array.isArray(props.contrato.oferta)) return [];
  return props.contrato.oferta.map(o => ({
    ...o,
    fecha_inicio: o.fecha_inicio ? o.fecha_inicio.substring(0, 10) : '',
    fecha_fin: o.fecha_fin ? o.fecha_fin.substring(0, 10) : ''
  }));
});
const ofertasTotal = computed(() => ofertasData.value.length);
const handleOfertasPageChange = (newPage) => {
  ofertasPage.value = newPage;
};
</script> 