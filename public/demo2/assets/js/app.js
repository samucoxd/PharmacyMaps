var items = null;

var markers = Array();

var path = null;

var paths = Array();

var center = { lat: -17.783443, lng: -63.183526 };

var map = null;

var poligono = Array();

var firstCircle = null;

var url = 'https://terbol.info/ServicioMod04/api/actividad/group/by/usuario?parameters.fecha_ini=01%2F01%2F2022&parameters.fecha_fin=28%2F07%2F2022';


console.log("Start App");
loadMap();

$(document).ready(function () {
    cargarDatos();

});

function renumerateItems() {
    $(".toast-body .toastlist ol li").each(function (index) {
        $(".index", this).html((index + 1).toString());
    });
}

function loadItems(fetchedData) {

    $(".items .list").html("");

    for (let i = 0; i < fetchedData.length; i++) {
        var li = $("<li>", {
            id: fetchedData[i].id_usuario,
            rol: "usuario",
            nombre: fetchedData[i].nombre,
            style: 'background-color:' + fetchedData[i].color_map + '',
        });
        var index = $("<div>", { class: "index" });
        var div = $("<div>", { class: "text", id: "btn-toast" + (i + 1), code: (fetchedData[i].id_usuario), });
        index.html((i + 1).toString());
        li.append(index);
        div.html("[<i class='fa fa-solid fa-street-view'></i> Cod: " + fetchedData[i].id_usuario + " " + fetchedData[i].nombre + " - " + fetchedData[i].oClientes.length + "] <i class='fa fa-solid fa-eye' style='font-size:20px;'></i>");
        li.append(div);
        $(".items .list").append(li);
    }

}

function loadItemsClientes(clientes) {
    $(".toast-body").html("");
    var ol = $("<ol>", { class: "toastlist" });
    $(".toast-body").append(ol);

    $('.toast-body .toastlist').html("");

    for (let i = 0; i < clientes.length; i++) {
        var li = $("<li>", {
            id: clientes[i].id_cliente,
            telefono: clientes[i].telefono,
            direccion: clientes[i].direccion,
        });
        var index = $("<div>", { class: "indice" });
        var div = $("<div>", { class: "textToast" });
        index.html((i + 1).toString());
        li.append(index);
        div.html("[" + clientes[i].nombre + "]");
        li.append(div);
        $(".toast-body .toastlist").append(li);
    }

    $('.toast-body .toastlist').sortable({
        onDrop: function ($item, container, _super) {
            renumerateItems();
            _super($item, container);
        }
    });

}

function drawMarkersVendedor(oUsuarios) {
    clearMarkers();
    color_map = oUsuarios.color_map;

    color_sin_numeral = color_map.substring(1);
    var pinColor = color_sin_numeral;

    oClientes = oUsuarios.oClientes;

    dibujarMarkers(oClientes, pinColor);
}

function drawMarkersOrderAllVendedor(oClientes, oUsuarios) {
    clearMarkers();
    color_map = oUsuarios.color_map;
    var pinColor = color_map.substring(1);

    dibujarMarkers(oClientes, pinColor);

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
}

function printMap() {
    $("#print").click(function () {
        window.print();
    });

}

function orderMarkers(items) {

    var first = null;
    var others = null;

    $(".toast-body .toastlist li").each(function (index) {
        if (index == 0) {
            first = Enumerable.From(items).Where("$.id_cliente=='" + $(this).attr("id") + "'").Select("$").FirstOrDefault();
            others = Enumerable.From(items).Where("$.id_cliente!='" + $(this).attr("id") + "'").Select("$").ToArray();
        }
    });
    var result = Array();
    result.push(first);
    getRoute(first, others, result);
    items = result;
    return items;
}

function getRoute(first, others, result) {

    if (others.length > 0) {
        next = getNearest(first, others);
        result.push(next);
        others = Enumerable.From(others).Where("$.id_cliente!='" + next.id_cliente + "'").Select("$").ToArray();
        getRoute(next, others, result);
    }
}

function getNearest(first, others) {
    //calculamos las distancias
    for (var i = 0; i < others.length; i++) {
        others[i].distance = distanceBetween([first.latitud, first.longitud], [others[i].latitud, others[i].longitud]);
    }
    return Enumerable.From(others).OrderBy("$.distance").FirstOrDefault();
}

function distanceBetween(point1, point2) {
    var a = point1[0] - point2[0];
    var b = point1[1] - point2[1];

    return Math.sqrt(a * a + b * b);
}

async function getDataAsync() {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                reject(
                    "No hemos podido recuperar ese json. El código de respuesta del servidor es: " +
                    response.status
                );
            })
            .then((json) => resolve(json))
            .catch((err) => reject(err));
    });
}

function getUsuario(argument) {

    oUsuario = argument.data.oUsuario;
    oUsuarios = [];
    for (var i = 0; i < oUsuario.length; i++) {
        oClientes = getClientes(oUsuario[i].oActividad);
        oUsuarios[i] = {
            id_usuario: oUsuario[i].id_usuario,
            nombre: oUsuario[i].nombre,
            color_map: oUsuario[i].color_map,
            usuario: oUsuario[i].usuario,
            oClientes: oClientes
        };
    }
    return oUsuarios;
}

function getClientes(vendedor) {
    oClientes = [];
    for (let i = 0; i < vendedor.length; i++) {
        oClientes[i] = {
            id_cliente: vendedor[i].oCliente.id_cliente,
            nombre: vendedor[i].oCliente.nombre,
            direccion: vendedor[i].oCliente.direccion,
            telefono: vendedor[i].oCliente.telefono,
            latitud: vendedor[i].oCliente.latitud,
            longitud: vendedor[i].oCliente.longitud,
            hora_inicial: vendedor[i].oCliente.hora_inicial,
            hora_final: vendedor[i].oCliente.hora_final,
            foto_url: vendedor[i].oCliente.foto_url,
        };
    }
    return oClientes;
}

function getCliente(vendedor) {
    //console.log(vendedor.oActividad.length);
    oClientes = [];
    cliente = vendedor.oClientes;
    for (let i = 0; i < cliente.length; i++) {
        oClientes[i] = {
            id_cliente: cliente[i].id_cliente,
            nombre: cliente[i].nombre,
            direccion: cliente[i].direccion,
            telefono: cliente[i].telefono,
            latitud: cliente[i].latitud,
            longitud: cliente[i].longitud,
            hora_inicial: cliente[i].hora_inicial,
            hora_final: cliente[i].hora_final,
            foto_url: cliente[i].foto_url,
        };
    }
    return oClientes;
}

function cargarDatos() {
    getDataAsync(url)
        .then((json) => {
            oUsuarios = getUsuario(json);
            loadItems(oUsuarios);
            toastActividad(oUsuarios);
            printMap();
            $("#todos").click(function () {
                drawMarkersAllClientes(oUsuarios);
            });
        });
}

function toastActividad(oUsuarios) {
    //el $ no es jquery es una convención que se utiliza para indicar que es un elemento del DOM
    const toast = clientes => {
        //como segundo parámetro admite opciones como: animation, autohide, delay
        $('.toast-body').html("");
        loadItemsClientes(clientes);
        //$('.toast-body').append(clientes[0].id_cliente,clientes[0].nombre);
        $('.toast').toast("show");
    }// toast()


    $("ol li").each(function (index) {
        $('#btn-toast' + (index + 1) + '').click(function () {
            id = $(this).attr("code");
            clientes = getCliente(oUsuarios[index]);
            toast(clientes)
            drawMarkersVendedor(oUsuarios[index]);
            clientes = agregarDistanciaCliente(clientes);
            $("#calc").click(function () {
                clienteOrdenados = orderMarkers(clientes);
                loadItemsClientes(clienteOrdenados);
                drawMarkersOrderAllVendedor(clienteOrdenados, oUsuarios[index]);
            });
        });
    });
}

function agregarDistanciaCliente(cliente) {
    clientes = cliente;
    for (let i = 0; i < clientes.length; i++) {
        clientes[i].distance = 0;
    }

    return clientes;
}


function infoMarker(oCliente) {
    content = '<div>' +
        '<h5>' + oCliente.nombre + '</h5>' +
        "<ol style='width:300px'><li>ID: " + oCliente.id_cliente + "</li><li>Direccion: " + oCliente.direccion + "</li><li>Telefono: " + oCliente.telefono + "</li><li>Hora Inicial: " + oCliente.hora_inicial + "</li><li>Hora Final: " + oCliente.hora_final + "</li></ol><img src='" + oCliente.foto_url + "'width='150px' height='150px'>";
    return content;
}

function drawMarkersAllClientes(oUsuarios) {
    clearMarkers();
    for (var i = 0; i < oUsuarios.length; i++) {
        oClientes = oUsuarios[i].oClientes;

        color_map = oUsuarios[i].color_map;
        color_sin_numeral = color_map.substring(1);
        var pinColor = color_sin_numeral;
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));

        for (var j = 0; j < oClientes.length; j++) {

            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(oClientes[j].latitud),
                    lng: parseFloat(oClientes[j].longitud)
                },
                //label: ((j+1)).toString(),
                animation: google.maps.Animation.DROP,
                icon: pinImage,
                title: "[" + oClientes[j].nombre + "] " + oClientes[j].direccion,
                map: map
            });

            var infowindow = new google.maps.InfoWindow()
            const content = infoMarker(oClientes[j]);
            google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                return function () {
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                };
            })(marker, content, infowindow));
            markers.push(marker);
        }

    }
}

function dibujarMarkers(oClientes, pinColor) {
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    for (var j = 0; j < oClientes.length; j++) {
        var marker = new google.maps.Marker({
            position: {
                lat: parseFloat(oClientes[j].latitud),
                lng: parseFloat(oClientes[j].longitud)
            },
            label: ((j + 1)).toString(),
            animation: google.maps.Animation.DROP,
            title: "[" + oClientes[j].nombre + "] " + oClientes[j].direccion,
            icon: pinImage,
            map: map
        });

        var infowindow = new google.maps.InfoWindow()
        const content = infoMarker(oClientes[j]);
        google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
                infowindow.setContent(content);
                infowindow.open(map, marker);
            };
        })(marker, content, infowindow));

        markers.push(marker);
        paths.push({ lat: parseFloat(oClientes[j].latitud), lng: parseFloat(oClientes[j].longitud) });
    }
    path = new google.maps.Polyline({
        path: paths,
        geodesic: true,
        strokeColor: color_map,
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    path.setMap(map);

}
