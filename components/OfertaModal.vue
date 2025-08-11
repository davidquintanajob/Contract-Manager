<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <!-- MessageBanner para mostrar estado de carga -->
    <div v-if="loadingBanner" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner 
        :title="loadingBanner.title" 
        :description="loadingBanner.description" 
        :type="loadingBanner.type"
        @close="loadingBanner = null" 
        class="pointer-events-auto" 
      />
    </div>
    
    <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isViewing ? 'Detalles de Oferta' : (isEditing ? 'Editar Oferta' : 'Nueva Oferta') }}
        </h2>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-4">
          <!-- Descripciones -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripciones</label>
            <div class="space-y-2">
              <div 
                v-for="(descripcion, index) in descripciones" 
                :key="index"
                class="flex items-start space-x-2"
              >
                <textarea 
                  v-model="descripciones[index]" 
                  :readonly="isViewing" 
                  :disabled="isViewing || isLoading" 
                  :required="index === 0"
                  rows="2"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`Descripción ${index + 1}${index === 0 ? ' (requerida)' : ''}`"
                  @input="handleDescripcionInput(index)"
                ></textarea>
                <button 
                  v-if="!isViewing && descripciones.length > 1" 
                  type="button"
                  @click="removeDescripcion(index)"
                  class="mt-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
                  :disabled="isLoading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button 
                v-if="!isViewing && descripciones.length < 15" 
                type="button"
                @click="addDescripcion"
                class="w-full px-4 py-2 text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                :disabled="isLoading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar descripción
              </button>
            </div>
          </div>
          <!-- Fecha inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input v-model="formData.fecha_inicio" type="date" :readonly="isViewing" :disabled="isViewing || isLoading" required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <!-- Fecha fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input v-model="formData.fecha_fin" type="date" :readonly="isViewing" :disabled="isViewing || isLoading" required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <!-- Contrato -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contrato</label>
            <SelectSearch
              v-model="formData.id_contrato"
              :options="contratos"
              :labelKey="(c) => `${c.entidad?.nombre}: ${c?.num_consecutivo} - ${c.tipoContrato?.nombre} - (${c.fecha_inicio?.substring(0,4)})`"
              valueKey="id_contrato"
              placeholder="Buscar contrato..."
              :disabled="isViewing || isLoading"
              required
            />
          </div>
          <!-- Usuario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <SelectSearch
              v-model="formData.id_usuario"
              :options="usuarios"
              labelKey="nombre"
              valueKey="id_usuario"
              placeholder="Buscar usuario..."
              :disabled="isViewing || isLoading"
              required
            />
          </div>
          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <div class="space-y-2">
              <label class="flex items-center cursor-pointer" :class="{ 'opacity-50': isViewing || isLoading }">
                <input
                  type="radio"
                  v-model="formData.estado"
                  value="facturada"
                  :disabled="isViewing || isLoading"
                  class="sr-only"
                />
                <div class="px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center"
                     :class="formData.estado === 'facturada' 
                       ? 'bg-blue-500 border-blue-600 text-white shadow-md' 
                       : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'">
                  <div class="w-4 h-4 border-2 border-current rounded-full mr-3 flex items-center justify-center">
                    <div v-if="formData.estado === 'facturada'" class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="font-medium">Facturada</span>
                </div>
              </label>
              
              <label class="flex items-center cursor-pointer" :class="{ 'opacity-50': isViewing || isLoading }">
                <input
                  type="radio"
                  v-model="formData.estado"
                  value="no_facturada"
                  :disabled="isViewing || isLoading"
                  class="sr-only"
                />
                <div class="px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center"
                     :class="formData.estado === 'no_facturada' 
                       ? 'bg-gray-500 border-gray-600 text-white shadow-md' 
                       : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'">
                  <div class="w-4 h-4 border-2 border-current rounded-full mr-3 flex items-center justify-center">
                    <div v-if="formData.estado === 'no_facturada'" class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span class="font-medium">No Facturada</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 mt-6" v-if="!isViewing">
          <button type="button" @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            :disabled="isLoading">
            Cancelar
          </button>
          <button type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading">
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditing ? 'Guardando...' : 'Creando...' }}
            </span>
            <span v-else>
              {{ isEditing ? 'Guardar Cambios' : 'Crear Oferta' }}
            </span>
          </button>
        </div>
      </form>
      <div v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import SelectSearch from './SelectSearch.vue';
import MessageBanner from './MessageBanner.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  oferta: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false },
  isViewing: { type: Boolean, default: false },
  usuarios: { type: Array, default: () => [] },
  contratos: { type: Array, default: () => [] },
  id_usuario: { type: [Number, null], default: null },
  id_contrato: { type: [Number, null], default: null }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const formData = ref({
  fecha_inicio: '',
  fecha_fin: '',
  id_contrato: '',
  id_usuario: '',
  estado: 'no_facturada'
});

const descripciones = ref(['']);

const errorMsg = ref('');
const isLoading = ref(false);
const loadingBanner = ref(null);

watch(() => [props.oferta, props.id_usuario, props.id_contrato], ([oferta, id_usuario, id_contrato]) => {
  if (oferta && Object.keys(oferta).length > 0) {
    formData.value = {
      fecha_inicio: oferta.fecha_inicio ? oferta.fecha_inicio.split('T')[0] : '',
      fecha_fin: oferta.fecha_fin ? oferta.fecha_fin.split('T')[0] : '',
      id_contrato: (id_contrato !== null && id_contrato !== undefined)
        ? (props.contratos.find(c => c.id_contrato === id_contrato)?.id_contrato ?? null)
        : Number(oferta.id_contrato || oferta.contrato?.id_contrato || 0) || null,
      id_usuario: (id_usuario !== null && id_usuario !== undefined)
        ? (props.usuarios.find(u => u.id_usuario === id_usuario)?.id_usuario ?? null)
        : Number(oferta.id_usuario || oferta.usuario?.id_usuario || 0) || null,
      estado: oferta.estado === 'facturada' ? 'facturada' : 'no_facturada'
    };
    
    // Cargar descripciones desde la oferta
    if (oferta.descripciones && Array.isArray(oferta.descripciones)) {
      descripciones.value = oferta.descripciones.map(d => d.descripcion || '');
      // Agregar un campo vacío adicional si hay descripciones
      if (descripciones.value.length > 0) {
        descripciones.value.push('');
      }
    } else {
      descripciones.value = [''];
    }
  } else {
    formData.value = {
      fecha_inicio: '',
      fecha_fin: '',
      id_contrato: null,
      id_usuario: null,
      estado: 'no_facturada'
    };
    descripciones.value = [''];
  }
}, { immediate: true });
watch(
  [() => props.usuarios, () => props.contratos, () => props.id_usuario, () => props.id_contrato],
  ([newUsuarios, newContratos, id_usuario, id_contrato]) => {
    if (props.oferta && Object.keys(props.oferta).length > 0) {
      if (id_contrato !== null && id_contrato !== undefined) {
        formData.value.id_contrato = props.contratos.find(c => c.id_contrato === id_contrato)?.id_contrato ?? null;
      } else {
        formData.value.id_contrato = Number(props.oferta.id_contrato || props.oferta.contrato?.id_contrato || 0) || null;
      }
      if (id_usuario !== null && id_usuario !== undefined) {
        formData.value.id_usuario = props.usuarios.find(u => u.id_usuario === id_usuario)?.id_usuario ?? null;
      } else {
        formData.value.id_usuario = Number(props.oferta.id_usuario || props.oferta.usuario?.id_usuario || 0) || null;
      }
    }
  }
);
// Funciones para manejar descripciones dinámicas
const addDescripcion = () => {
  if (descripciones.value.length < 15) {
    descripciones.value.push('');
  }
};

const removeDescripcion = (index) => {
  if (descripciones.value.length > 1) {
    descripciones.value.splice(index, 1);
  }
};

const handleDescripcionInput = (index) => {
  // Si se escribe en el último campo y no es el último elemento, agregar uno nuevo
  if (index === descripciones.value.length - 1 && descripciones.value[index].trim() !== '' && descripciones.value.length < 15) {
    descripciones.value.push('');
  }
};

const handleSubmit = async () => {
  errorMsg.value = '';
  
  // Filtrar descripciones vacías y verificar que al menos una esté presente
  const descripcionesValidas = descripciones.value.filter(d => d.trim() !== '');
  
  if (descripcionesValidas.length === 0 || !formData.value.fecha_inicio || !formData.value.fecha_fin || !formData.value.id_contrato || !formData.value.id_usuario || !formData.value.estado) {
    errorMsg.value = 'Todos los campos son obligatorios.';
    return;
  }
  
  // Activar estado de carga
  isLoading.value = true;
  loadingBanner.value = {
    title: props.isEditing ? 'Guardando Oferta' : 'Creando Oferta',
    description: 'Comunicando con el servidor, espere por favor...',
    type: 'warning'
  };
  
  try {
    // Preparar datos para enviar
    const datosParaEnviar = {
      ...formData.value,
      descripciones: descripcionesValidas.map(descripcion => ({ descripcion: descripcion.trim() }))
    };
    
    // Emitir el evento submit y esperar la respuesta
    await new Promise((resolve, reject) => {
      emit('submit', datosParaEnviar);
      // Simular un pequeño delay para que el usuario vea el mensaje
      setTimeout(resolve, 100);
    });
  } catch (error) {
    console.error('Error en handleSubmit:', error);
  } finally {
    // Desactivar estado de carga después de un breve delay
    setTimeout(() => {
      isLoading.value = false;
      loadingBanner.value = null;
    }, 500);
  }
};
</script> 