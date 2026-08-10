import {
    doc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase-firestore.js";

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