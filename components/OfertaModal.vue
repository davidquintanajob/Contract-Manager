<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
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
          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="formData.descripcion" :readonly="isViewing" :disabled="isViewing" required rows="3"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la descripción de la oferta"></textarea>
          </div>
          <!-- Fecha inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input v-model="formData.fecha_inicio" type="date" :readonly="isViewing" :disabled="isViewing" required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <!-- Fecha fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input v-model="formData.fecha_fin" type="date" :readonly="isViewing" :disabled="isViewing" required
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
              :disabled="isViewing"
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
              :disabled="isViewing"
              required
            />
          </div>
          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <div class="space-y-2">
              <label class="flex items-center cursor-pointer" :class="{ 'opacity-50': isViewing }">
                <input
                  type="radio"
                  v-model="formData.estado"
                  value="facturada"
                  :disabled="isViewing"
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
              
              <label class="flex items-center cursor-pointer" :class="{ 'opacity-50': isViewing }">
                <input
                  type="radio"
                  v-model="formData.estado"
                  value="no_facturada"
                  :disabled="isViewing"
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
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancelar
          </button>
          <button type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Oferta' }}
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
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  id_contrato: '',
  id_usuario: '',
  estado: 'no_facturada'
});
const errorMsg = ref('');
watch(() => [props.oferta, props.id_usuario, props.id_contrato], ([oferta, id_usuario, id_contrato]) => {
  if (oferta && Object.keys(oferta).length > 0) {
    formData.value = {
      descripcion: oferta.descripcion || '',
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
  } else {
    formData.value = {
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      id_contrato: null,
      id_usuario: null,
      estado: 'no_facturada'
    };
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
const handleSubmit = () => {
  errorMsg.value = '';
  if (!formData.value.descripcion || !formData.value.fecha_inicio || !formData.value.fecha_fin || !formData.value.id_contrato || !formData.value.id_usuario || !formData.value.estado) {
    errorMsg.value = 'Todos los campos son obligatorios.';
    return;
  }
  emit('submit', { ...formData.value });
};
</script> 