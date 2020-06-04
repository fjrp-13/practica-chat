const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    console.log('Usuario conectado');
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                success: false,
                error: {
                    mensaje: 'El nombre y la sala son necesarios'
                }
            });
        }

        // Conectar al usuario a una sala
        const sala = data.sala.toLowerCase();
        client.join(sala);

        let persona = usuarios.agregarPersona(client.id, data.nombre, sala);
        client.broadcast.to(sala).emit('updatePersonasChat', usuarios.getPersonasPorSala(sala));
        client.broadcast.to(persona.sala).emit('newMessage', crearMensaje('Administrador', `${persona.nombre} se unió al chat`));
        callback(usuarios.getPersonasPorSala(sala));
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.eliminarPersona(client.id);
        if (personaBorrada) {
            client.broadcast.to(personaBorrada.sala).emit('newMessage', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        }
        client.broadcast.to(personaBorrada.sala).emit('updatePersonasChat', usuarios.getPersonasPorSala(personaBorrada.sala));
    })
    client.on('newMessage', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('newMessage', mensaje);
        callback({
            success: true,
            mensaje
        });
    });
    // Mensajes privados`'0w
    client.on('privateMessage', (data) => {
        // Falta validar que data tiene la estructura correcta: {destinatario: "id_destinatario", mensaje: "mensaje"}
        let personaFrom = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(personaFrom.nombre, data.mensaje);
        client.broadcast.to(data.destinatario).emit('newMessage', mensaje);
    });

});