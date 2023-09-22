let mouseDown = false;


/* inicijalizacija Google Maps API-ja */
function calculatePeakProduction(){
    const modulePower = 455;
    const moduleAngle = 20;
    const moduleAzimuth = 180;
    const moduleNumbers = 4;
	const moduleWidth = 990;
	const moduleHeight = 2160;
	const moduleEfficency = (modulePower / (((moduleWidth/1000) * (moduleHeight/1000)) * 1000)) * 100;

	console.log(moduleEfficency);
}


async function initMap() {
    let map;
    let marker;
    const { Map } = await google.maps.importLibrary("maps");

    let initialPosition = {lat: 45.2396, lng: 19.8228}; // Početna lokacija

    map = new Map(document.getElementById('map'), {
        zoom: 10,
        center: initialPosition,
        streetViewControl: false,
        fullscreenControl: false
    });

    marker = new google.maps.Marker({
        map: map,
        position: initialPosition,
        draggable: true // Omogućava da marker može da se prevlači
    });

    // Kada se marker prevlači i otpusti, sačuvajte novu lokaciju u localStorage
    marker.addListener('dragend', function(event) {
        saveToLocalStorage(event.latLng.lat(), event.latLng.lng());
    });

    // Sačuvajte početnu lokaciju u localStorage
    saveToLocalStorage(initialPosition.lat, initialPosition.lng);
}

function saveToLocalStorage(lat, lng) {
    const spanLat = document.querySelector("#lat");
    const spanLon = document.querySelector("#lon");
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
    spanLat.innerText = lat.toFixed(4);
    spanLon.innerText = lng.toFixed(4);
    // console.log('Lat: ' + lat + ' Lng: ' + lng + ' - Sačuvano u localStorage');
}

function getUserGeolocation(){
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            console.log("Latitude:", lat, "Longitude:", lon);
            let location = {
                lat: lat,
                lng: lon 
            };
            return location;
        }, function(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.log("Korisnik nije dozvolio zahtev za Geolokaciju.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Informacije o lokaciji nisu dostupne.");
                    break;
                case error.TIMEOUT:
                    console.log("Zahtev za dobijanje lokacije korisnika je istekao.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("Došlo je do nepoznate greške.");
                    break;
            }
        });
    } else {
        console.log("Geolocation nije podržan u ovom pregledaču.");
    }
}

document.getElementById('compass').addEventListener('mousedown', function(e){
    mouseDown = true;
    moveNeedle(e);
});

document.getElementById('compass').addEventListener('mousemove', function(e){
    if(mouseDown){
        moveNeedle(e);
    }
});

document.getElementById('compass').addEventListener('mouseup', function(e){
    mouseDown=false;
});

document.getElementById('compass').addEventListener('mouseleave', function(e){
    mouseDown=false;
});

document.querySelector('input[name=azimuth').addEventListener('keyup', function(){
    let value = this.value;
    let string = value.replace('°', '');
    let angle = parseFloat(string);
    angle = parseFloat(angle.toFixed(2));
    value = angle.toFixed(2) + '°';
    document.getElementById('needle').style.transform = 'rotate(' + angle + 'deg)';
    this.value = value;
});

function moveNeedle (e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    // Izračunavanje ugla u stepenima
    var angle = Math.atan2(y - 80, x - 80) * (180 / Math.PI);
    // Prilagođavanje ugla tako da Sever bude 0, Istok 90, Jug 180, i Zapad 270
    angle = (angle + 450) % 360;
    // Postavljanje rotacije kazaljke
    document.getElementById('needle').style.transform = 'rotate(' + angle + 'deg)';
    // Ažuriranje vrednosti u input polju
    document.querySelector('input[name=azimuth').value = angle.toFixed(2).toString() + "°";
};

function setAzimuth() {
    var ugao = document.getElementById('azimuth').value;
    document.getElementById('needle').style.transform = 'rotate(' + ugao + 'deg)';
}

function fetchJSON(){
    const url = '/js/modules.json';
    fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Network error while fetching JSON file!');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error: ', error);
    });
}

/* automatsko pokretanje odredjenih funkcija */
window.addEventListener('load', () => {
    // getUserGeolocation();
    initMap();
    document.querySelector('input[name=azimuth').value = "0.00°";
	calculatePeakProduction();
    fetchJSON();
});