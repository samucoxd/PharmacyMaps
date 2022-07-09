let map, markers = null;
let defaultLatitude = -17.3131921;
let defaultLongitude = -65.8829336;
let latitude, longitude = 0.0;

var config = {
    authDomain: "ddamise2022.firebaseapp.com",
    databaseURL: "https://ddamise2022-default-rtdb.firebaseio.com",
    projectId: "ddamise2022"
};

firebase.initializeApp(config);

/**
 * Firebase Realtime Database
 */
const database = firebase.database();

// database reference
const databaseReference = firebase.database().ref('users');

// firebase listener/observer
databaseReference.on('child_added', (snapshot) => {
    let user = snapshot.val();
    L.marker([user.latitude, user.longitude], {
        title: user.username,
        riseOnHover: true
    }).addTo(markers);
}, (error) => {
    console.error(error);
});

$(function () {
    console.log("Web App Loaded...");

    init();

    $('form').submit(function (event) {
        let name = $('form input#name').val();

        let newUser = databaseReference.push();
        newUser.set({
            username: name,
            latitude: latitude,
            longitude: longitude
        }).then(function () {
            $('#login').hide();
        });

        event.preventDefault();
    });
})

function loading(status) {
    if (status) {
        $('#loading').show();
    } else {
        $('#loading').hide();
    }
}

function init() {
    map = L.map('map').setView([defaultLatitude, defaultLongitude], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    markers = L.layerGroup().addTo(map);

    loading(false);

    if (navigator.geolocation) {
        console.log("Location Loaded...");
        navigator.geolocation.getCurrentPosition(grabLocation);
    }

}


function grabLocation(location) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;

    $('#login').show();
}
