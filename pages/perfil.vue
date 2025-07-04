<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-12">
    <Navbar />
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mt-8">
      <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">Mi Perfil</h2>
      <div v-if="user" class="space-y-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">ID:</span>
            <span class="text-gray-900">{{ user.id_usuario }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Nombre:</span>
            <span class="text-gray-900">{{ user.nombre }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Usuario:</span>
            <span class="text-gray-900">{{ user.nombre_usuario }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Cargo:</span>
            <span class="text-gray-900">{{ user.cargo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Rol:</span>
            <span class="text-gray-900">{{ user.rol }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Estado:</span>
            <span :class="user.activo ? 'bg-green-500' : 'bg-red-500'" class="px-3 py-1 rounded-full text-white text-xs font-semibold">
              {{ user.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">Cargando datos...</div>
    </div>
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mt-8">
      <h3 class="text-xl font-semibold text-blue-700 mb-4">Ofertas del usuario</h3>
      <DataTable
        :columns="ofertasColumns"
        :items="ofertasData"
        :total-items="ofertasData.length"
        :items-per-page="5"
        :current-page="ofertasPage"
        :is-loading="isLoading"
        :show-actions="false"
        @page-change="handleOfertasPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from '@/components/DataTable.vue';
import { useRuntimeConfig, navigateTo } from 'nuxt/app';
import Navbar from '@/components/Navbar.vue';

const config = useRuntimeConfig();
const user = ref(null);
const ofertasData = ref([]);
const ofertasPage = ref(1);
const isLoading = ref(false);

const ofertasColumns = [
  { key: 'id_oferta', label: 'ID Oferta' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha_inicio', label: 'Fecha Inicio', format: (val) => val?.substring(0, 10) },
  { key: 'fecha_fin', label: 'Fecha Fin', format: (val) => val?.substring(0, 10) },
  { key: 'id_contrato', label: 'ID Contrato' }
];

function handleOfertasPageChange(page) {
  ofertasPage.value = page;
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const usuarioLS = localStorage.getItem('usuario');
    if (!usuarioLS) {
      navigateTo('/login');
      return;
    }
    let usuario;
    try {
      usuario = JSON.parse(usuarioLS);
    } catch (e) {
      navigateTo('/login');
      return;
    }
    if (!usuario || !usuario.id_usuario) {
      navigateTo('/login');
      return;
    }
    const res = await fetch(`${config.public.backendHost}/usuario/${usuario.id_usuario}`);
    const data = await res.json();
    user.value = data;
    ofertasData.value = Array.isArray(data.oferta) ? data.oferta.map(o => ({
      ...o,
      fecha_inicio: o.fecha_inicio ? o.fecha_inicio.substring(0, 10) : '',
      fecha_fin: o.fecha_fin ? o.fecha_fin.substring(0, 10) : ''
    })) : [];
  } catch (e) {
    user.value = null;
    ofertasData.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script> 