const map = L.map('map').setView([-33.0388, -71.3799], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker = L.marker([0, 0]).addTo(map);
let polyline = L.polyline([], {color: '#3498db', weight: 5}).addTo(map);

async function actualizar() {
    try {
        const res = await fetch('http://10.72.25.75/coords'); // CAMBIA TU IP DESDE CELU 10.72.25.75 DESDE ROUTER 192.168.1.11
        const data = await res.json();
        const pos = [parseFloat(data.lat), parseFloat(data.lng)];
        marker.setLatLng(pos);
        polyline.addLatLng(pos);
        map.panTo(pos);
        document.getElementById('lat').innerText = data.lat;
        document.getElementById('lng').innerText = data.lng;
    } catch(e) { console.log("Reconectando..."); }
}

function limpiarRecorrido() {
    polyline.setLatLngs([]);
}

function guardarRecorrido() {
    const nombre = prompt("Nombre:");
    if(nombre) {
        localStorage.setItem('recorrido_' + nombre, JSON.stringify(polyline.getLatLngs()));
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
            li.innerText = key.replace('recorrido_', '');
            lista.appendChild(li);
        }
    }
}

setInterval(actualizar, 2000);
listarRecorridos();
