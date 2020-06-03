// Clase de Usuario
class Usuarios {
    constructor() {
        this.personas = [];
    };

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };

        this.personas.push(persona);

        // Devolvemos TODAS las personas
        //return this.personas;

        return persona;
    };

    getPersona(id) {
        // Filtramos el array, devolviendo las personas que con el ID que pasamos por parámetro
        let persona = this.personas.filter(persona => {
            return persona.id === id;
        })[0]; // y devolvemos el 1er valor del "nuevo array"


        return persona;
    };

    getPersonas() {
        return this.personas;
    };

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala
        });

        return personasEnSala;
    };

    eliminarPersona(id) {
        let personaBorrada = this.getPersona(id);
        // Filtramos el array, devolviendo las personas que no son el ID que pasamos por parámetro
        this.personas = this.personas.filter(persona => {
            return persona.id !== id
        });

        return personaBorrada;
    };


};

module.exports = {
    Usuarios
};