/* var items = [
    {
        id: "C11253",
        rol: "Vendedor",
        nombre: "vendedor 1",
        color_map:"0A60EC",
        pedidos: [
            {
                cliente:"Cliente 1",
                direccion: "Calle Caballero y Beni",
                lat: -17.780051,
                lng: -63.181219 
            },
            {
                cliente:"Cliente 2",
                direccion: "Calle Mercado entre Isabel la Catolica y Av.Cañoto",
                lat: -17.789572, 
                lng: -63.188181 
            },
            {
                cliente:"Cliente 3",
                direccion: "Calle Rafael Peña y 24 de Septiembre",
                lat: -17.777609, 
                lng: -63.182088 
            },
            {
                cliente:"Cliente 4",
                direccion: "Calle Cuellar y Sara",
                lat: -17.779734, 
                lng: -63.187141 
            },
            {
                cliente:"Cliente 5",
                direccion: "Calle Corrdillera esquina Ingavi",
                lat: -17.785026, 
                lng: -63.186926 
            },
            {
                cliente:"Cliente 6",
                direccion: "Calle Atenas entre San Antonio y 16 de Julio",
                lat: -17.826734, 
                lng: -63.199669 
            },
            
        ],
        totalPedidos:10
    },
    {
        id: "C66215",
        rol: "Vendedor",
        nombre: "vendedor 2",
        color_map:"E20AEC",
        pedidos: [
            {
                cliente:"Cliente 1",
                direccion: "Calle España y Ayacucho",
                lat: -17.783851, lng: -63.184909
            },
            {
                cliente:"Cliente 2",
                direccion: "Av.Santa Cruz esquina Cap.Mariano Arrien",
                lat: -17.794935, lng: -63.182538
            },
            {
                cliente:"Cliente 3",
                direccion: "4to Anillo esquina Ave de Playa, Cambodromo",
                lat: -17.755219, lng: -63.155707
            },
            {
                cliente:"Cliente 4",
                direccion: "Av.Virgen de Cotoca, Pampa de la Isla",
                lat: -17.770039, lng: -63.124803
            },
            {
                cliente:"Cliente 5",
                direccion: "Colinas del Urubo, Urubo",
                lat: -17.752018, lng: -63.218285
            },
        ],
        totalPedidos:10
    },
];
 */

var items = null;

var markers = Array();

var path = null;

var paths = Array();

var center = { lat: -17.783443, lng: -63.183526 };

var map = null;

var poligono = Array();
var firstCircle = null;
var response2 = null;
var url = 'https://terbol.info/ServicioMod04/api/actividad?parameters.id_usuario=2&parameters.fecha_ini=01%2F01%2F2022&parameters.fecha_fin=15%2F07%2F2022';

$(document).ready(function () {
/*     console.log(items.data.oActividad.length);

    for (let index = 0; index < items.length; index++) {
        
        console.log(items[index].oUsuario[0].nombre);
        
    } */

    console.log("Start App");
    loadMap();
    getDataAsync();


    $("ol li").click(function(){
        console.log($(this).attr("id"));
        let dato = items.filter(item => item.id == $(this).attr("id").toString());
        drawMarkersVendedor(dato);
    
        $("#calc").click(function (event) {
            orderMarkers();
            loadItems();
            drawMarkersVendedor(items);
            event.preventDefault();
    
        });
    
        $("#print").click(function (event) {
            printMap();
            event.preventDefault();
        });
    });



});

function renumerateItems() {
    $("ol li").each(function (index) {
        $(".index", this).html((index + 1).toString());
    });
}

function loadItems(fetchedData) {

    $(".items .list").html("");

/*     for (i = 0; i < items.length; i++) {
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
        $(".items .list").append(li);dmso
    } */

        items = fetchedData.data.oActividad;

        for (let i = 0; i < items.length; i++) {
            var li = $("<li>",{
                id: items[i].oUsuario.id_usuario,
                rol: "usuario",
                nombre: items[i].oUsuario.nombre,
                color_map: items[i].oUsuario.color_map,
                totalPedidos: items.length

            });
        var index = $("<div>", { class: "index" });
        var div = $("<div>", { class: "text" });
        index.html((i + 1).toString());
        li.append(index);
        div.html("[" + items[i].oCliente.id_cliente + "] " + items[i].oCliente.nombre + "(" + items[i].oUsuario.usuario +")");
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

function drawMarkersVendedor(params){
    clearMarkers();
    counter = 1;
    color_map = "";
    if (path != null) {
        path.setMap(null);
    }
    for (let i = 0; i < params.length; i++) {
        color_map = params[i].color_map;
        for (let j = 0; j < params[i].pedidos.length; j++) {

            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(params[i].pedidos[j].lat),
                    lng: parseFloat(params[i].pedidos[j].lng)
                },
                label: ((counter)).toString(),
                title: "[" + params[i].pedidos[j].cliente+ "] " + params[i].pedidos[j].direccion,
                map: map
            });
            counter += 1;
            markers.push(marker);
            paths.push({ lat: parseFloat(params[i].pedidos[j].lat), lng: parseFloat(params[i].pedidos[j].lng) });
        }
    }

    path = new google.maps.Polyline({
        path: paths,
        geodesic: true,
        strokeColor: "#" + color_map,
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    path.setMap(map);
}

function drawMarkersAllVendedor(params){
    clearMarkers();
    counter = 1;
    color_map = "";
    for (let i = 0; i < params.length; i++) {
        color_map = params[i].oUsuario.color_map;
        color_sin_numeral = color_map.substring(1);
        console.log(color_sin_numeral);

        var pinImage = {
            url: "http://www.googlemapsmarkers.com/v1/"+color_sin_numeral,
          };

            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(params[i].oCliente.latitud),
                    lng: parseFloat(params[i].oCliente.longitud)
                },
                label: ((counter)).toString(),
                animation: google.maps.Animation.DROP,
                title: "[" + params[i].oCliente.nombre+ "] " + params[i].oCliente.direccion,
                icon: pinImage,
                map: map
            });
            counter += 1;
            markers.push(marker);
            paths.push({ lat: parseFloat(params[i].oCliente.latitud), lng: parseFloat(params[i].oCliente.longitud) });
    }

        counter = 1;
        path = new google.maps.Polyline({
            path: paths,
            geodesic: true,
            strokeColor: "#" + color_map,
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        path.setMap(map);

        paths = [];




}


function clearMarkers() {



    if (path != null) {
        path.setMap(null);
    }


    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
    markers = Array();

    paths = Array();

    
}

function loadMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center
    });

/*     new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: 100
    }); */
}

function printMap() {
    window.print();
}

function orderMarkers() {

    var first = null;
    var others = null;

    $("ol li").each(function (index) {
        if (index == 0) {
            first = Enumerable.From(items).Where("$.id=='" + $(this).attr("id") + "'").Select("$").FirstOrDefault();
            others = Enumerable.From(items).Where("$.id!='" + $(this).attr("id") + "'").Select("$").ToArray();
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
        others = Enumerable.From(others).Where("$.id!='" + next.code + "'").Select("$").ToArray();
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
async function getDataAsync() { 
    let fetchedData; 
    const response = await fetch(url) 
    .then(response => response.json()) 
    .then(json => fetchedData = json); 
    console.log(fetchedData.data.oActividad);

    loadItems(fetchedData);

    $("#todos").click(function(event){
        drawMarkersAllVendedor(fetchedData.data.oActividad);
        event.preventDefault();
    });


/* 
    for (let index = 0; index < fetchedData.data.oActividad.length; index++) {
        items.push(fetchedData.data.oActividad[index]);
                
    } */
}
