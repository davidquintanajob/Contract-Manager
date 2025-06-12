<template>
    <!-- Contenedor principal -->
    <div class="relative">
        <!-- Botón de toggle (SOLO DESKTOP) - Fijo en la pantalla -->
        <button @click="toggleNav"
            class="hidden md:flex items-center fixed top-1/2 transform -translate-y-1/2 z-50 bg-accent text-white rounded-r-full h-16 pr-4 shadow-lg hover:bg-accent-dark transition-all duration-300 ease-in-out"
            :style="{ left: isNavCollapsed ? '0px' : '255px', right: 'auto', width: isNavCollapsed ? 'auto' : 'auto' }">
            <!-- Icono -->
            <div class="flex items-center justify-center w-8 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        :d="isNavCollapsed ? 'M13 5l7 7-7 7' : 'M11 19l-7-7 7-7'" />
                </svg>
            </div>

            <!-- Texto SOLUTEL (visible solo cuando no está colapsado) -->
            <span v-if="isNavCollapsed"
                class="text-white text-xl font-sans font-bold tracking-tight ml-2 whitespace-nowrap">
                Navegación
            </span>
        </button>

        <!-- Barra de navegación -->
        <nav class="fixed top-0 left-0 w-full bg-gradient-to-r from-primary to-secondary shadow-lg z-40 md:w-64 md:h-screen md:bg-gradient-to-b transition-all duration-300 ease-in-out"
            :class="{ 'md:transform md:-translate-x-full': isNavCollapsed }" style="--nav-width: 16rem;">

            <div
                class="container mx-auto flex justify-between items-center py-4 px-6 md:flex-col md:items-start md:justify-start md:py-6 md:h-full">
                <div class="hidden md:flex md:items-center">
                    <h1 class="text-white text-3xl md:text-4xl font-sans font-bold tracking-tight mr-4">
                        SOLUTEL
                    </h1>
                    <a @click="toggleUserMenu"
                        class="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:bg-accent hover:border-accent transition flex items-center justify-center cursor-pointer">
                        <img src="/usuario.png" alt="Usuario"
                            class="w-3/4 h-3/4 object-cover transition duration-300 hover:opacity-75 mix-blend-screen invert hover:invert(0)" />
                    </a>
                </div>

                <!-- Logo / Nombre (Móvil) -->
                <h1 class="text-white text-3xl font-sans font-bold tracking-tight md:hidden">
                    SOLUTEL
                </h1>

                <!-- Menú hamburguesa (Móvil) - SIN CAMBIOS -->
                <button @click="isMenuOpen = !isMenuOpen"
                    class="md:hidden text-white focus:outline-none transition duration-300">
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Botón de usuario (Móvil) -->
                <a @click="toggleUserMenu"
                    class="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:bg-accent hover:border-accent transition ml-6 flex items-center justify-center cursor-pointer md:hidden">
                    <img src="/usuario.png" alt="Usuario"
                        class="w-3/4 h-3/4 object-cover transition duration-300 hover:opacity-75 mix-blend-screen invert hover:invert(0)" />
                </a>

                <!-- Botones de navegación (Escritorio) -->
                <div class="hidden md:flex flex-col space-y-4 w-full md:mt-4">
                    <a v-for="(option, index) in options" :key="index" :href="option.link"
                        class="text-white flex items-center px-4 py-3 rounded-lg border border-white transition group hover:bg-accent hover:text-black"
                        @click="isNavCollapsed = true">
                        <img :src="option.src" alt=""
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300">
                        <span class="text-[15px]">{{ option.label }}</span>
                    </a>
                </div>


            </div>

            <!-- Overlay para el menú de usuario (SIN CAMBIOS) -->
            <div v-if="isUserMenuOpen" class="fixed inset-0 z-40" @click="isUserMenuOpen = false">
                <div class="fixed top-0 right-0 w-64 h-screen bg-secondary p-4 space-y-2 transform transition-all duration-300 ease-in-out"
                    :style="{ transform: isUserMenuOpen ? 'translateX(0)' : 'translateX(100%)' }" @click.stop>
                    <a href="/perfil"
                        class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black">
                        <img src="/perfil.png" alt="Perfil"
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" />
                        Mi Perfil
                    </a>
                    <hr class="border-white" />
                    <a href="/ajustes"
                        class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black">
                        <img src="/compras.png" alt="Ajustes"
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" />
                        Mis Compras
                    </a>
                    <hr class="border-white" />
                    <a href="/resennas"
                        class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black">
                        <img src="/resennas.png" alt="Ajustes"
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" />
                        Mis Reseñas
                    </a>
                    <hr class="border-white" />
                    <a href="/cerrar-sesion"
                        class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black">
                        <img src="/cerrar-sesion.png" alt="Cerrar Sesión"
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" />
                        Cerrar Sesión
                    </a>
                </div>
            </div>

            <!-- Menú desplegable (Móvil) - SIN CAMBIOS -->
            <div v-if="isMenuOpen"
                class="md:hidden fixed top-16 left-0 w-full bg-secondary p-4 space-y-2 transform transition-all duration-300 ease-in-out">
                <a v-for="(option, index) in options" :key="index" :href="option.link"
                    class="flex items-center block text-white text-center py-2 rounded-lg transition group hover:bg-accent"
                    @click="isMenuOpen = false">
                    <img :src="option.src" alt=""
                        class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300">
                    <span>{{ option.label }}</span>
                </a>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Estado del navbar colapsado (solo desktop)
const isNavCollapsed = ref(true);

// Controla el estado del menú de usuario y del menú móvil
const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

// Función para alternar el estado del navbar
const toggleNav = () => {
    isNavCollapsed.value = !isNavCollapsed.value;
};

// Opciones de navegación
const options = [
    { label: "Entidades", src: "/Productos.png", link: "/" },
    { label: "Contratos", src: "/Ofertas.png", link: "/" },
    { label: "Trabajadores", src: "/Ofertas.png", link: "/" },
    { label: "Tipos de Contratos", src: "/QuienesSomos.png", link: "/Quienes_Somos" },
    { label: "Ofertas", src: "/mapa.png", link: "/Donde_Encontrarnos" },
    { label: "Usuario", src: "/mapa.png", link: "/Donde_Encontrarnos" }
];

// Función para alternar el menú de usuario
const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

onMounted(() => {
    const hasVisited = localStorage.getItem('hasVisitedNavbar');
    if (!hasVisited) {
        isNavCollapsed.value = false; // Expandir la primera vez
        localStorage.setItem('hasVisitedNavbar', 'true');
    }
});
</script>