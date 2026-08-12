import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import { app } from "../firebase/firebase-config.js";


const auth = getAuth(app);


// REGISTRAR USUARIO

export async function registrarUsuario(email, password) {

    const resultado = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    return resultado.user;
}


// INICIAR SESIÓN

export async function iniciarSesion(email, password) {

    const resultado = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return resultado.user;
}


// OBTENER USUARIO ACTUAL

export function obtenerUsuarioActual() {

    return new Promise((resolve, reject) => {

        const cancelar = onAuthStateChanged(
            auth,

            (usuario) => {

                cancelar();

                resolve(usuario);

            },

            (error) => {

                reject(error);

            }

        );

    });

}

export async function cerrarSesion() {



    await signOut(auth);

}
