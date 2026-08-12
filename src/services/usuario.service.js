import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase-firestore.js";


// ======================================================
// CREAR PERFIL
// ======================================================

export async function crearPerfilUsuario(uid, datos) {

    const usuarioRef = doc(db, "usuarios", uid);

    await setDoc(usuarioRef, {

        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        email: datos.email,

        rol: "cliente",

        fechaRegistro: serverTimestamp()

    });

}


// ======================================================
// OBTENER PERFIL
// ======================================================

export async function obtenerPerfilUsuario(uid) {

    const usuarioRef = doc(db, "usuarios", uid);

    const documento = await getDoc(usuarioRef);

    if (!documento.exists()) {

        return null;

    }

    return documento.data();

}