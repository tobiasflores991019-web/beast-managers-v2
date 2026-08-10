import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

import { app } from "../firebase/firebase-config.js";

const auth = getAuth(app);


export async function registrarUsuario(email, password) {

    const resultado = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    return resultado.user;
}


export async function iniciarSesion(email, password) {

    const resultado = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return resultado.user;
}