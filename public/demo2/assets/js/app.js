var items = [
    {
        code: "C11253",
        name: "Cliente 1",
        address: "Calle Caballero y Beni",
        distance: 0,
        point: { lat: -17.780051, lng: -63.181219 }
    },
    {
        code: "C11262",
        name: "Cliente 2",
        address: "Calle Mercado entre Isabel la Catolica y Av.Cañoto",
        distance: 0,
        point: { lat: -17.789572, lng: -63.188181 }
    },
    {
        code: "C11255",
        name: "Cliente 3",
        address: "Calle Rafael Peña y 24 de Septiembre",
        distance: 0,
        point: { lat: -17.777609, lng: -63.182088 }
    },
    {
        code: "C11254",
        name: "Cliente 4",
        address: "Calle Cuellar y Sara",
        distance: 0,
        point: { lat: -17.779734, lng: -63.187141 }
    },
    {
        code: "C11260",
        name: "Cliente 5",
        address: "Calle Corrdillera esquina Ingavi",
        distance: 0,
        point: { lat: -17.785026, lng: -63.186926 }
    },
    {
        code: "C11280",
        name: "Cliente 6",
        address: "Calle Atenas entre San Antonio y 16 de Julio",
        distance: 0,
        point: { lat: -17.826734, lng: -63.199669 }
    },
    {
        code: "C11261",
        name: "Cliente 7",
        address: "Calle España y Ayacucho",
        distance: 0,
        point: { lat: -17.783851, lng: -63.184909 }
    },
    {
        code: "C11264",
        name: "Cliente 8",
        distance: 0,
        point: { lat: -17.793337, lng: -63.166361 }
    },
    {
        code: "C11263",
        name: "Cliente 9",
        address: "Av.Santa Cruz esquina Cap.Mariano Arrien",
        distance: 0,
        point: { lat: -17.794935, lng: -63.182538 }
    },
    {
        code: "C11275",
        name: "Cliente 10",
        address: "4to Anillo esquina Ave de Playa, Cambodromo",
        distance: 0,
        point: { lat: -17.755219, lng: -63.155707 }
    },
    {
        code: "C11276",
        name: "Cliente 11",
        address: "Av.Virgen de Cotoca, Pampa de la Isla",
        distance: 0,
        point: { lat: -17.770039, lng: -63.124803 }
    },
    {
        code: "C11277",
        name: "Cliente 12",
        address: "Colinas del Urubo, Urubo",
        distance: 0,
        point: { lat: -17.752018, lng: -63.218285 }
    }
];

var markers = Array();

var path = null;

var paths = Array();

var center = { lat: -17.783443, lng: -63.183526 };

var map = null;

var firstCircle = null;

$(document).ready(function () {
    console.log("Start App");
    loadMap();
    loadItems();
    drawMarkers();

    $("#calc").click(function (event) {
        orderMarkers();
        loadItems();
        drawMarkers();
        event.preventDefault();

    });

    $("#print").click(function (event) {
        printMap();
        event.preventDefault();
    });
});

function renumerateItems() {
    $("ol li").each(function (index) {
        $(".index", this).html((index + 1).toString());
    });
}

function loadItems() {

    $(".items .list").html("");

    for (i = 0; i < items.length; i++) {
        var li = $("<li>", {
            lat: items[i].point.lat,
            lng: items[i].point.lng,
            code: items[i].code,
            name: items[i].name,
            address: items[i].address
        });
        var index = $("<div>", { class: "index" });
        var div = $("<div>", { class: "text" });
        index.html((i + 1).toString());
        li.append(index);
        div.html("[" + items[i].code + "] " + items[i].name);
        li.append(div);
        $(".items .list").append(li);
    }

    $(".items .list").sortable({
        onDrop: function ($item, container, _super) {
            renumerateItems();
            _super($item, container);
        }
    });

}

function drawMarkers() {

    clearMarkers();

    $("ol li").each(function (index) {
        var marker = new google.maps.Marker({
            position: {
                lat: parseFloat($(this).attr("lat")),
                lng: parseFloat($(this).attr("lng"))
            },
            label: ((index + 1)).toString(),
            title: "[" + $(this).attr("code") + "] " + $(this).attr("name") + " Dir: " + $(this).attr("address"),
            map: map
        });
        markers.push(marker);
        paths.push({ lat: parseFloat($(this).attr("lat")), lng: parseFloat($(this).attr("lng")) });
    });

    //limpiamos el circulo del mapa
    if (firstCircle != null) {
        firstCircle.setMap(null);
    }

    firstCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: {
            lat: markers[0].position.lat(),
            lng: markers[0].position.lng()
        },
        radius: 100
    });

    path = new google.maps.Polyline({
        path: paths,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path.setMap(map);
}

function clearMarkers() {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    markers = Array();

    paths = Array();

    if (path != null) {
        path.setMap(null);
    }
}

function loadMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center
    });

    new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: 100
    });
}

function printMap() {
    window.print();
}

function orderMarkers() {

    var first = null;
    var others = null;

    $("ol li").each(function (index) {
        if (index == 0) {
            first = Enumerable.From(items).Where("$.code=='" + $(this).attr("code") + "'").Select("$").FirstOrDefault();
            others = Enumerable.From(items).Where("$.code!='" + $(this).attr("code") + "'").Select("$").ToArray();
        }
    });

    var result = Array();
    result.push(first);
    getRoute(first, others, result);
    items = result;
}

function getRoute(first, others, result) {

    if (others.length > 0) {
        next = getNearest(first, others);
        result.push(next);
        others = Enumerable.From(others).Where("$.code!='" + next.code + "'").Select("$").ToArray();
        getRoute(next, others, result);
    }
}

function getNearest(first, others) {
    //calculamos las distancias
    for (var i = 0; i < others.length; i++) {
        others[i].distance = distanceBetween(first.point, others[i].point);
    }
    return Enumerable.From(others).OrderBy("$.distance").FirstOrDefault();
}

function distanceBetween(point1, point2) {
    var a = point1.lat - point2.lat;
    var b = point1.lng - point2.lng;

    return Math.sqrt(a * a + b * b);
}