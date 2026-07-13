// Inicialización del Mapa
const map = L.map('map').setView([-33.0388, -71.3799], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker = L.marker([0, 0]).addTo(map);
let polyline = L.polyline([], {color: '#3498db', weight: 5}).addTo(map);

// Variables globales
let startTime = Date.now();
let totalDistance = 0;

async function actualizar() {
    try {
        const res = await fetch('http://10.72.25.75/coords'); 
        const data = await res.json();
        const pos = [parseFloat(data.lat), parseFloat(data.lng)];
        
        // Calcular distancia
        if(polyline.getLatLngs().length > 0) {
            let lastPos = polyline.getLatLngs().slice(-1)[0];
            totalDistance += L.latLng(lastPos).distanceTo(pos);
        }

        marker.setLatLng(pos);
        polyline.addLatLng(pos);
        map.panTo(pos);

        // Actualizar UI
        document.getElementById('lat').innerText = data.lat;
        document.getElementById('lng').innerText = data.lng;
        document.getElementById('dist-val').innerText = (totalDistance/1000).toFixed(3);
        
    } catch(e) {
        console.log("Esperando ESP32...");
    }
}

function limpiarRecorrido() {
    polyline.setLatLngs([]);
    totalDistance = 0;
    startTime = Date.now();
    document.getElementById('dist-val').innerText = "0";
}

function guardarRecorrido() {
    const nombre = prompt("Nombre del recorrido:");
    if(nombre) {
        const datos = {
            distancia: (totalDistance/1000).toFixed(2) + " km",
            tiempo: Math.floor((Date.now() - startTime) / 60000) + " min"
        };
        localStorage.setItem('recorrido_' + nombre, JSON.stringify(datos));
        listarRecorridos();
    }
}

function listarRecorridos() {
    const lista = document.getElementById('lista-recorridos');
    lista.innerHTML = "";
    for(let i=0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('recorrido_')) {
            let li = document.createElement('li');
            li.innerText = key.replace('recorrido_', '') + " - " + JSON.parse(localStorage.getItem(key)).distancia;
            lista.appendChild(li);
        }
    }
}

// Iniciar procesos
setInterval(actualizar, 2000);
listarRecorridos();
