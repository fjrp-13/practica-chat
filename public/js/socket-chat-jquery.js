var params = new URLSearchParams(window.location.search);


// referencias de jQuery
var $divUsuarios = $('#divUsuarios');
var $formEnviar = $('#formEnviar');
var $txtMensaje = $('#txtMensaje');
var $divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios(arrPersonas) {
    var html = [
        '<li>',
        '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>',
        '</li>'
    ].join('');

    var htmlTemplatePersona = [
        '<li>',
        '<a data-id="{{id}}" href="#" class="chat-user"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle">',
        '<span>{{name}}<small class="text-success">online</small></span>',
        '</a>',
        '</li>'
    ].join('');

    var htmlPersona = '';
    for (var i = 0; i < arrPersonas.length; i++) {
        htmlPersona += htmlTemplatePersona.replace('{{id}}', arrPersonas[i].id).replace('{{name}}', arrPersonas[i].nombre).replace('{{image}}', arrPersonas[i].imagen);
    }
    $divUsuarios.html(html + htmlPersona);
}; // renderizarUsuarios


function renderizarMensaje(mensaje, isMyMessage) {
    var htmlTemplateUserImage = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    var htmlTemplateMessage = [
        '<li class="animated fadeIn {{message-type}}">',
        '{{userimage}}',
        '<div class="chat-content">',
        '<h5>{{user}}</h5>',
        '<div class="box {{message-class}}">{{message}}</div>',
        '</div>',
        '<div class="chat-time">{{datetime}}</div>',
        '</li>'
    ].join('');

    var htmlUserImage = '';
    var messageType = '';
    var messageClassSuffix = (mensaje.nombre.toLowerCase() === 'administrador' ? 'danger' : 'info');
    var messageClass = 'bg-light-' + messageClassSuffix;

    if (isMyMessage) {
        messageType = 'reverse';
        messageClass = 'bg-light-inverse';
    }

    var dateMessageTime = new Date(mensaje.fecha);
    var messageTime = dateMessageTime.toTimeString().split(' ')[0];

    var html = htmlTemplateMessage.replace('{{user}}', mensaje.nombre).replace('{{userimage}}', htmlUserImage).replace('{{message}}', mensaje.mensaje).replace('{{datetime}}', messageTime).replace('{{message-type}}', messageType).replace('{{message-class}}', messageClass);
    $divChatbox.append(html);
    scrollBottom();
}



function scrollBottom() {

    // selectors
    var newMessage = $divChatbox.children('li:last-child');

    // heights
    var clientHeight = $divChatbox.prop('clientHeight');
    var scrollTop = $divChatbox.prop('scrollTop');
    var scrollHeight = $divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        $divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners
$divUsuarios.on('click', 'a.chat-user', function() {
    console.log('User ID:', $(this).data('id'));
});

$formEnviar.on('submit', function(e) {
    e.preventDefault();
    var _message = $.trim($txtMensaje.val());
    if (_message.length == 0) {
        return;
    };
    // Enviar el mensaje
    socket.emit('newMessage', {
        mensaje: _message
    }, function(resp) {
        if (resp.success == true) {
            renderizarMensaje(resp.mensaje, true);
            $txtMensaje.val('').focus();
        }
        console.log('respuesta server: ', resp);
    });



});