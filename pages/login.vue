<template>
  <div class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 bg-gray-100">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-24 w-24 rounded-full shadow mt-8" src="/logo.jpeg" alt="Logo" />
      <h2 class="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">Inicia sesión en tu cuenta</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-900">Nombre de usuario</label>
          <div class="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              v-model="username"
              class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
              placeholder="Usuario"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-gray-900">Contraseña</label>
          </div>
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="text-red-600 text-sm text-center">{{ errorMsg }}</div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Ingresar
          </button>
        </div>
      </form>

      <!--
      <p class="mt-10 text-center text-sm text-gray-500">
        ¿No tienes cuenta?
        <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Regístrate aquí</a>
      </p>
      -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRuntimeConfig, navigateTo } from 'nuxt/app';

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const config = useRuntimeConfig();

const handleLogin = async () => {
  errorMsg.value = '';
  if (!username.value || !password.value) {
    errorMsg.value = 'Por favor, completa todos los campos.';
    return;
  }
  try {
    const res = await fetch(`${config.public.backendHost}/usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nombre_usuario: username.value,
        contrasenna: password.value
      })
    });
    if (!res.ok) {
      const data = await res.json();
      errorMsg.value = 'Usuario o contraseña incorrectos.';
      return;
    }
    
    const data = await res.json();
    if (data.token && data.usuario) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigateTo('/');
    } else {
      errorMsg.value = 'Respuesta inesperada del servidor.';
    }
  } catch (e) {
    errorMsg.value = 'Error de conexión con el servidor.';
  }
};
</script>
