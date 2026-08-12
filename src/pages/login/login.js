import { iniciarSesion } from "../../services/auth.service.js";

import { obtenerPerfilUsuario } from "../../services/usuario.service.js";

const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
    document.getElementById("email").value.trim();

const password =
    document.getElementById("password").value;


try {

   const usuario = await iniciarSesion(
    email,
    password
);

console.log("Sesión iniciada correctamente");


const perfil = await obtenerPerfilUsuario(
    usuario.uid
);

console.log("Perfil obtenido:", perfil);

if (perfil.rol === "cliente") {

    window.location.href =
        "/src/pages/cliente/dashboard/dashboard.html";

}

} catch (error) {

    console.error("Error al iniciar sesión:", error);

}

});