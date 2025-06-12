<template>
    <div>
      <Navbar />
      <!-- Encabezado -->
      <div class="bg-neutral text-accent py-10 mt-20">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-dark md:text-5xl">Quienes Somos</h1>
        </div>
      </div>
  
      <!-- Contenido principal -->
      <div class="container mx-auto px-4 py-10">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="w-full md:w-1/2">
            <h2 class="text-lg font-bold text-dark">Nuestra Historia</h2>
            <p class="text-sm font-medium text-dark">Somos una empresa dedicada a ofrecer los mejores productos con un excelente servicio al cliente. Nuestro objetivo es brindar soluciones innovadoras y de alta calidad para satisfacer las necesidades de nuestros clientes.</p>
          </div>
          <div class="w-full md:w-1/2 mt-6 md:mt-0">
            <img src="/QienesSomos1.jpg" alt="Imagen" class="w-full h-48 object-cover object-center rounded-md">
          </div>
        </div>
  
        <div class="flex flex-col md:flex-row justify-between items-center mt-10">
          <div class="w-full md:w-1/2 mt-6 md:mt-0">
            <img src="/QienesSomos2.jpg" alt="Imagen" class="w-full h-48 object-cover object-center rounded-md">
          </div>
          <div class="w-full md:w-1/2 ml-6">
            <h2 class="text-lg font-bold text-dark">Misión y Visión</h2>
            <p class="text-sm font-medium text-dark">Nuestra misión es ser líderes en el mercado, ofreciendo productos y servicios de alta calidad y satisfacer las necesidades de nuestros clientes. Nuestra visión es ser una empresa sostenible y responsable, que contribuya al bienestar de la sociedad.</p>
          </div>
        </div>
  
        <div class="flex flex-col md:flex-row justify-between items-center mt-10">
          <div class="w-full md:w-1/2">
            <h2 class="text-lg font-bold text-dark">Valores</h2>
            <ul class="text-sm font-medium text-dark">
              <li>Calidad y excelencia en nuestros productos y servicios</li>
              <li>Compromiso con la satisfacción del cliente</li>
              <li>Responsabilidad social y ambiental</li>
              <li>Innovación y mejora continua</li>
            </ul>
          </div>
          <div class="w-full md:w-1/2 mt-6 md:mt-0">
            <img src="/QienesSomos3.jpg" alt="Imagen" class="w-full h-48 object-cover object-center rounded-md">
          </div>
        </div>
      </div>
  
      <!-- Pie de página -->
      <FooterComponent />
    </div>
  </template>
  
  <script setup>
  import Navbar from "@/components/Navbar.vue";
  import FooterComponent from '@/components/footerComponent.vue';
  </script>