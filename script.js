// Variables globales1
let startTime = Date.now();
let totalDistance = 0; 

async function actualizar() {
    try {
        const res = await fetch('http://10.72.25.75/coords'); 
        const data = await res.json();
        const pos = [parseFloat(data.lat), parseFloat(data.lng)];
        
        // Calcular distancia si ya hay puntos
        if(polyline.getLatLngs().length > 0) {
            let lastPos = polyline.getLatLngs().slice(-1)[0];
            totalDistance += L.latLng(lastPos).distanceTo(pos); // Metros
        }

        marker.setLatLng(pos);
        polyline.addLatLng(pos);
        map.panTo(pos);

        // Calcular tiempo
        let elapsed = Math.floor((Date.now() - startTime) / 1000); // Segundos

        document.getElementById('lat').innerText = data.lat;
        // Mostrar info en consola o donde quieras visualizarlo
        console.log(`Distancia: ${(totalDistance/1000).toFixed(2)} km | Tiempo: ${elapsed} seg`);
    } catch(e) {}
}

function limpiarRecorrido() {
    polyline.setLatLngs([]);
    totalDistance = 0;
    startTime = Date.now();
    localStorage.removeItem('recorrido_actual');
}

function guardarRecorrido() {
    const nombre = prompt("Nombre del recorrido:");
    if(nombre) {
        const datos = {
            ruta: polyline.getLatLngs(),
            distancia: (totalDistance/1000).toFixed(2) + " km",
            tiempo: Math.floor((Date.now() - startTime) / 60) + " min"
        };
        localStorage.setItem('recorrido_' + nombre, JSON.stringify(datos));
        listarRecorridos();
    }
}
