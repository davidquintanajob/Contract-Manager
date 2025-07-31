<template>
  <div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg overflow-hidden">
        <!-- Encabezado de la tabla -->
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
            <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <!-- Cuerpo de la tabla -->
        <tbody class="divide-y divide-gray-200">
          <!-- Estado de carga -->
          <tr v-if="isLoading">
            <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2">Cargando datos...</span>
              </div>
            </td>
          </tr>
          <!-- Datos de la tabla -->
          <tr v-else v-for="(item, index) in paginatedItems" :key="index" class="hover:bg-gray-50">
            <td 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <!-- Renderizado personalizado de celda -->
              <div v-if="column.cellRenderer" v-html="column.cellRenderer(getNestedValue(item, column.key), item)"></div>
              <!-- Renderizado normal de texto -->
              <span v-else>{{ column.format ? column.format(getNestedValue(item, column.key)) : getNestedValue(item, column.key) }}</span>
            </td>
            <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button 
                  v-for="action in actions" 
                  :key="action.name"
                  @click="action.handler(item)"
                  class="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  :title="action.name"
                >
                  <component 
                    v-if="action.icon" 
                    :is="action.icon" 
                    class="h-5 w-5"
                  />
                  <span v-if="!action.iconOnly">{{ action.name }}</span>
                </button>
              </div>
            </td>
          </tr>
          <!-- Mensaje cuando no hay datos -->
          <tr v-if="!isLoading && paginatedItems.length === 0">
            <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-4 text-center text-sm text-gray-500">
              No hay datos disponibles
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-700">
        Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalItems }} elementos
      </div>
      <div class="flex gap-2">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>
        <span class="px-3 py-1 text-gray-700">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button 
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  // Array de objetos que definen las columnas
  columns: {
    type: Array,
    required: true,
    // Ejemplo: [
    //   { key: 'id', label: 'ID' }, 
    //   { key: 'name', label: 'Nombre' },
    //   { 
    //     key: 'estado', 
    //     label: 'Estado',
    //     cellRenderer: (value, item) => `<span class="px-2 py-1 rounded bg-blue-100 text-blue-800">${value}</span>`
    //   }
    // ]
  },
  // Array de datos a mostrar en la tabla
  items: {
    type: Array,
    required: true,
    // Ejemplo: [{ id: 1, name: 'Ejemplo' }]
  },
  // Array de acciones para cada fila (opcional)
  actions: {
    type: Array,
    default: () => [],
    // Ejemplo: [{ name: 'Editar', handler: (item) => console.log(item) }]
  },
  // Número total de elementos (para paginación)
  totalItems: {
    type: Number,
    required: true,
  },
  // Elementos por página
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  // Página actual
  currentPage: {
    type: Number,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['page-change']);

// Computed properties
// Opciones de elementos por página
const itemsPerPageOptions = [5, 10, 20, 50, 100];

// Variables locales
const localItemsPerPage = ref(props.itemsPerPage);

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const startIndex = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage;
});

const endIndex = computed(() => {
  const calculatedEnd = startIndex.value + props.itemsPerPage;
  return Math.min(calculatedEnd, props.totalItems);
});

// Computed para los items paginados
const paginatedItems = computed(() => {
  return props.items;
});

// Función utilitaria para obtener valores anidados por path
function getNestedValue(obj, path) {
  if (!obj || !path) return '';
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';
}

// Métodos
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('page-change', newPage);
  }
};

const previousPage = () => {
  if (props.currentPage > 1) {
    handlePageChange(props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    handlePageChange(props.currentPage + 1);
  }
};

// Watch para debug
watch(() => props.items, (newItems) => {
}, { deep: true });

watch(() => props.currentPage, (newPage) => {
  console.log('Página actualizada:', newPage);
});

</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 