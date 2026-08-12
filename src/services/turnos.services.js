import {
    collection,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase-firestore.js";

export async function crearTurno(turno, codigoReserva) {

    const turnosRef = collection(db, "turnos");

    const documento = {

        clienteId: turno.clienteId,

        cliente: {
            nombre: turno.cliente.nombre,
            apellido: turno.cliente.apellido,
            telefono: turno.cliente.telefono,
            correo: turno.cliente.correo
        },

        sucursal: turno.sucursal,

        servicio: turno.servicio,

        precio: turno.precio,

        fecha: turno.fecha,

        horario: turno.horario,

        barbero: turno.barbero,

        pago: turno.pago,

        observaciones: turno.observaciones,

        codigoReserva: codigoReserva,

        estado: "pendiente",

        fechaCreacion: serverTimestamp()

    };

    const resultado = await addDoc(
        turnosRef,
        documento
    );

    return resultado.id;

}