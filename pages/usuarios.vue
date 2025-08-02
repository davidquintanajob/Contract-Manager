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
          :title="'¿Estás seguro que deseas eliminar este usuario?'"
          :description="'Esta acción no se puede deshacer.'"
          :icon="deleteIcon"
          type="warning"
          @confirm="confirmDeleteUsuario"
          @close="showConfirmBanner = false"
        />
      </div>
      <!-- Barra de búsqueda y filtros -->
      <div class="container mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
        <div class="bg-white rounded-lg shadow-md p-4">
          <!-- Campo de búsqueda principal (siempre visible) -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
            <div class="relative">
              <input
                type="text"
                v-model="nombre"
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

          <!-- Botón para mostrar/ocultar filtros en móvil -->
          <div class="md:hidden flex justify-between items-center mb-4">
            <button 
              @click="showFilters = !showFilters"
              class="flex items-center text-blue-500 hover:text-blue-600"
            >
              <span class="mr-2">Filtros adicionales</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform"
                :class="{ 'rotate-180': showFilters }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <!-- Campos adicionales (colapsables en móvil) -->
          <div 
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            :class="{ 'hidden md:grid': !showFilters }"
          >
            <!-- Buscar por nombre de usuario -->
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre de usuario</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="nombre_usuario"
                  placeholder="Ingrese nombre de usuario..." 
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

            <!-- Cargo -->
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input
                type="text"
                v-model="cargo"
                placeholder="Ingrese cargo"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch"
              >
            </div>

            <!-- Rol -->
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                v-model="rol"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="handleSearch"
              >
                <option value="">Todos los roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Empleado">Empleado</option>
                <option value="Administrador General">Administrador General</option>
              </select>
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
  
      <!-- Tabla de entidades -->
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Usuarios</h2>
          <button @click="nuevoUsuario" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
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
      </div>
      <UsuarioModal v-model="showModal" :usuario="selectedUsuario" :is-editing="isEditing" :is-viewing="isViewing" @submit="handleUsuarioSubmit" />
    </div>
  </template>
  
  <script setup>
  /* global process */
  import { ref, computed, h, onMounted } from 'vue';
  import Navbar from "@/components/Navbar.vue";
  import DataTable from "@/components/DataTable.vue";
  import UsuarioModal from '@/components/UsuarioModal.vue';
  import MessageBanner from '@/components/MessageBanner.vue';
  import ConfirmBanner from '@/components/ConfirmBanner.vue';
  import * as XLSX from 'xlsx';
  
  // Variables reactivas para los elementos de búsqueda
  const nombre = ref('');
  const nombre_usuario = ref('');
  const cargo = ref('');
  const rol = ref('');
  const showFilters = ref(false);

  // Obtener la configuración
  const config = useRuntimeConfig();
  
  
  // Configuración de la tabla de Entidades
  const entidadesColumns = [
    { key: 'id_usuario', label: 'ID' },
    { key: 'nombre', label: 'Nombre de la Persona' },
    { key: 'nombre_usuario', label: 'Nombre de Usuario' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'rol', label: 'Rol' },
    { 
      key: 'activo', 
      label: 'Activo',
      cellRenderer: (value) => {
        if (value === true || value === 1 || value === 'true' || value === '1') {
          return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Activo</span>';
        } else {
          return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactivo</span>';
        }
      }
    },
  ];
  
  // Variables para la paginación
  const currentPage = ref(1);
  const totalItems = ref(0); // Inicializamos en 0 hasta que carguemos los datos
  const isLoading = ref(false); // Para manejar el estado de carga
  const itemsPorPage = ref(20);
  
  // Datos de ejemplo para la tabla (simulando datos paginados)
  const itemsData = ref([]);
  
  // Función para cargar datos de la API
  const fetchItems = async (page = 1, limit = 20, nombre = '', nombre_usuario = '',cargo = '', rol = '') => {
    try {
      isLoading.value = true;

      // Obtener token de autentificación
      const token = localStorage.getItem('token');
      
      // Datos para el body
      const bodyData = {
        nombre,
        nombre_usuario,
        cargo,
        rol,
      };

      const response = await fetch(`${config.public.backendHost}/Usuario/filterUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'Accept': 'application/json'
        },
        body: JSON.stringify(bodyData)
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
      
      // Actualizamos los datos
      itemsData.value = data || [];
      // Actualizamos el total de items usando Array(data.data).length
      totalItems.value = itemsData.value.length;
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Manejador de eventos para la paginación
  const handlePageChange = (newPage) => {
    currentPage.value = newPage;
  };
  
  // Cargar datos cuando el componente se monte
  onMounted(() => {
    fetchItems(1, itemsPorPage.value);
  });
  
  const entidadesActions = [
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
      handler: (item) => {
        selectedUsuario.value = item;
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
      handler: (item) => {
        selectedUsuario.value = { ...item };
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
        usuarioAEliminar.value = item;
        showConfirmBanner.value = true;
      }
    }
  ];

  const handleSearch = async () => {
    try {
      isLoading.value = true
      await fetchItems(1, itemsPorPage.value, nombre.value, nombre_usuario.value, cargo.value, rol.value)
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
    } finally {
      isLoading.value = false
    }
  }

  const errorBanner = ref(null);
  const showModal = ref(false);
  const selectedUsuario = ref({});
  const isEditing = ref(false);
  const isViewing = ref(false);

  function nuevoUsuario() {
    selectedUsuario.value = {};
    isEditing.value = false;
    isViewing.value = false;
    showModal.value = true;
  }

  const handleUsuarioSubmit = async (formData) => {
    try {
    const token = localStorage.getItem('token');
    const url = isEditing.value
      ? `${config.public.backendHost}/usuario/UpdateUsuario/${selectedUsuario.value.id_usuario}`
      : `${config.public.backendHost}/usuario/CreateUsuario`;
      console.log(formData);
      
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
      console.log(errorData);
      if (errorData.errors) {
        errorBanner.value = {
          title: `Errores de validación: ${response.status}`,
          description: errorData.errors,
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
          title: `Entidad Actualizada: ${response.status}`,
          description: `El usuario ${formData.nombre} se actualizó con éxito`,
          type: 'success'
        };
      } else {
        errorBanner.value = {
          title: `Entidad Creada: ${response.status}`,
          description: `El usuario ${formData.nombre} se creo con éxito`,
          type: 'success'
        };
      }
      // Recargar los datos después de crear/editar
      await fetchItems(currentPage.value, itemsPorPage.value);
    } else {
      console.error('Error al guardar Usuario');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  }

  const showConfirmBanner = ref(false);
  const usuarioAEliminar = ref(null);
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

  async function confirmDeleteUsuario() {
    showConfirmBanner.value = false;
    if (!usuarioAEliminar.value) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.public.backendHost}/Usuario/DeleteUsuario/${usuarioAEliminar.value.id_usuario}`, {
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
        // Aquí podrías mostrar un error con MessageBanner si lo deseas
        return;
      }
      // Recargar los usuarios después de eliminar
      await fetchItems(currentPage.value, itemsPorPage.value, nombre.value, nombre_usuario.value, cargo.value, rol.value);
    } catch (error) {
      // Aquí podrías mostrar un error con MessageBanner si lo deseas
    } finally {
      usuarioAEliminar.value = null;
    }
  }

  function exportToExcel() {
    const exportData = itemsData.value.map(item => ({
      'ID': item.id_usuario,
      'Nombre': item.nombre,
      'Usuario': item.nombre_usuario,
      'Rol': item.rol
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    XLSX.writeFile(workbook, 'usuarios.xlsx');
  }
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>
  