<template>
    <div>
        <Navbar style="z-index: 10000;" />
        <!-- Encabezado -->
        <div class="bg-neutral text-accent py-10 mt-20">
            <div class="container mx-auto px-4">
                <h1 class="text-3xl font-bold text-dark md:text-5xl">Donde Encontrarnos</h1>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="container mx-auto px-4 py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Información de contacto -->
                <div class="flex flex-col gap-6">
                    <div v-for="(position, index) in staticPositions" :key="index"
                        class="bg-white rounded-lg p-4 shadow-md">
                        <h2 class="text-lg font-bold text-dark">{{ position.name }}</h2>
                        <p class="text-sm font-medium text-dark">Dirección: <span class="text-accent">{{ position.name
                                }}</span></p>
                        <p class="text-sm font-medium text-dark">Teléfono: <span class="text-accent">{{
                                position.num_telf }}</span></p>
                        <p class="text-sm font-medium text-dark">Correo electrónico: <span class="text-accent">{{
                                position.email }}</span></p>
                    </div>
                </div>

                <!-- Mapa de ubicación -->
                <div class="bg-white rounded-lg p-4 shadow-md md:col-span-1 lg:col-span-2">
                    <h2 class="text-lg font-bold text-dark">Mapa de Ubicación</h2>
                    <div class="h-96 md:h-128 lg:h-160">
                        <div id="donde-estamos" class="py-8 px-8 h-full">
                            <b class="flex items-center justify-center">Seleccione en el mapa su ubicación para ver como
                                llegar</b>
                            <div class="flex items-center justify-center h-full">
                                <!-- Aquí va el mapa de OpenStreetMap con Leaflet.js -->
                                <div id="map" class="h-full w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pie de página -->
        <FooterComponent />
    </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import { onMounted } from 'vue';
import FooterComponent from '@/components/footerComponent.vue';

let routePolyline = null; // Variable global para almacenar la polilínea de la ruta

// Definir la lista de objetos con las posiciones estáticas
const staticPositions = [
    { lat: 21.944832670058236, lng: -79.44665685329673, name: "Sancti Spíritus - Calle 6ta esquina", num_telf: "56242671", email: "uno@gmail.com" },
    { lat: 22.402299953617643, lng: -79.96504068374635, name: "Sancta Clara - Calle 7ta esquina", num_telf: "56242671", email: "uno@gmail.com" },
    { lat: 23.104996849988808, lng: -82.38510131835939, name: "La Habana - Calle 8ta esquina", num_telf: "56242671", email: "uno@gmail.com" },
];

// Función para crear el mapa y agregar los marcadores estáticos
function createMap(mapElement, staticPositions) {
    // Crear mapa con las coordenadas iniciales
    const map = L.map(mapElement).setView([21.944832670058236, -79.44665685329673], 7); // Coordenadas iniciales

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Agregar marcadores estáticos
    staticPositions.forEach((position) => {
        const marker = L.marker([position.lat, position.lng]).addTo(map)
            .bindPopup(`<b>${position.name}</b>`)
            .openPopup();
    });

    // Variable para mantener el marcador seleccionado
    let selectedMarker = null;

    // Función para permitir que el usuario seleccione un lugar haciendo clic en el mapa
    map.on('click', function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Si ya existe un marcador seleccionado, lo eliminamos
        if (selectedMarker) {
            map.removeLayer(selectedMarker);
        }

        // Crear un nuevo marcador en la ubicación seleccionada por el usuario
        selectedMarker = L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>Ubicación seleccionada:</b><br>Lat: ${lat}<br>Lon: ${lng}`)
            .openPopup();

        // Calcular la ruta más corta a el punto más cercano de las posiciones estáticas
        const closestPosition = getClosestPosition(staticPositions, lat, lng);
        const routeUrl = `http://router.project-osrm.org/route/v1/driving/${lng},${lat};${closestPosition.lng},${closestPosition.lat}?overview=full`;

        // Llamar a la API de OSRM para obtener la ruta
        fetch(routeUrl)
            .then(response => response.json())
            .then(data => {
                // Verificar si la API devolvió una ruta válida
                if (data.routes && data.routes.length > 0) {
                    const polylineEncoded = data.routes[0].geometry;

                    // Decodificar la geometría de la ruta
                    const routeCoordinates = decodePolyline(polylineEncoded);

                    // Si existe una ruta anterior, la eliminamos
                    if (routePolyline) {
                        map.removeLayer(routePolyline);
                    }

                    // Agregar la nueva ruta al mapa
                    routePolyline = L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);
                } else {
                    console.error("No se encontró una ruta válida.");
                }
            })
            .catch(error => {
                console.error("Error al obtener la ruta:", error);
            });
    });
}

// Función para calcular la ruta más corta a el punto más cercano de las posiciones estáticas
function getClosestPosition(staticPositions, lat, lng) {
    let closestPosition = null;
    let closestDistance = Infinity;

    staticPositions.forEach((position) => {
        const distance = calculateDistance(lat, lng, position.lat, position.lng);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPosition = position;
        }
    });

    return closestPosition;
}

// Función para calcular la distancia entre dos puntos
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

// Llamar a la función para crear el mapa y agregar los marcadores estáticos
onMounted(() => {
    const mapElement = document.getElementById('map');

    // Comprobamos que Leaflet esté listo antes de continuar
    const checkLeafletReady = setInterval(() => {
        if (window.L) {
            clearInterval(checkLeafletReady); // Detenemos la comprobación una vez que L está disponible
            console.log("Leaflet está listo");

            createMap(mapElement, staticPositions);
        }
    }, 100); // Revisa cada 100ms si `window.L` está disponible
});

// Función para decodificar la polyline codificada
function decodePolyline(encoded) {
    let points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
        let byte;
        let shift = 0;
        let result = 0;

        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
        lng += dlng;

        points.push([lat / 1e5, lng / 1e5]);
    }

    return points;
}
</script>
