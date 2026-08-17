import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    Timestamp,
    doc,
    updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase-firestore.js";


// ======================================================
// CREAR TURNO
// ======================================================

export async function crearTurno(turno, codigoReserva) {

    const turnosRef =
        collection(db, "turnos");

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

        fechaISO: turno.fechaISO,

        horario: turno.horario,

        fechaHora:
            turno.fechaHora
            ? Timestamp.fromDate(
                turno.fechaHora
            )
            : null,

        barbero: turno.barbero,

        pago: turno.pago,

        observaciones: turno.observaciones,

        codigoReserva: codigoReserva,

        estado: "pendiente",

        fechaCreacion:
            serverTimestamp()

    };

    const resultado =
        await addDoc(
            turnosRef,
            documento
        );

    return resultado.id;
}



// ======================================================
// OBTENER TURNOS DEL CLIENTE
// ======================================================

export async function obtenerTurnosCliente(clienteId) {

    const turnosRef = collection(db, "turnos");

    const consulta = query(
        turnosRef,
        where("clienteId", "==", clienteId)
    );

    const snapshot = await getDocs(consulta);

    const turnos = [];

    snapshot.forEach(documento => {

        turnos.push({
            id: documento.id,
            ...documento.data()
        });

    });

    return turnos;
}

// ======================================================
// OBTENER TURNOS DE UNA FECHA Y SUCURSAL
// ======================================================

export async function obtenerTurnosDisponibles(
    fechaISO,
    sucursal
) {

    const turnosRef =
        collection(db, "turnos");

    const consulta =
        query(
            turnosRef,
            where("fechaISO", "==", fechaISO)
        );

    const snapshot =
        await getDocs(consulta);

    const turnos = [];

    snapshot.forEach(documento => {

        const datos =
            documento.data();

        if(
            datos.sucursal === sucursal &&
            datos.estado !== "cancelado"
        ){

            turnos.push({
                id: documento.id,
                ...datos
            });

        }

    });

    console.log(
        "📋 Turnos existentes:",
        turnos
    );

    return turnos;
}

// ======================================================
// CANCELAR TURNO
// ======================================================

export async function cancelarTurno(turnoId) {

    if (!turnoId) {
        throw new Error("No se recibió el ID del turno.");
    }

    const turnoRef =
        doc(db, "turnos", turnoId);

    await updateDoc(
        turnoRef,
        {
            estado: "cancelado",
            fechaCancelacion: serverTimestamp()
        }
    );

    return true;
}