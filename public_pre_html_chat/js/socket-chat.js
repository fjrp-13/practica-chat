var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = "index.html";
    throw new Error("El nombre y la sala son necesario");
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log(resp);
    });

});

// Escuchar ...
// ... Desconexión
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});
// ... Se envía un nuevo mensaje
socket.on('newMessage', function(data) {
    console.log(data);
});
// ... Se actualiza la lista de personas (p.e. cuando un usuario entra o sale del chat)
socket.on('updatePersonasChat', function(data) {
    console.log(data);
});

// Mensajes privados
socket.on('privateMessage', function(data) {
    console.log(data);
});

// // Enviar información
// socket.emit('newMensaje', {
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// // Escuchar información
// socket.on('enviarMensaje', function(mensaje) {

//     console.log('Servidor:', mensaje);

// });