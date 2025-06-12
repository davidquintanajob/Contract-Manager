// plugins/leaflet.js
import 'leaflet/dist/leaflet.css';

export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    import('leaflet').then(L => {
      // Asignar L a la ventana global para que sea accesible
      window.L = L;
    }).catch(error => {
      console.error("Error cargando Leaflet:", error);
    });
  }
});
