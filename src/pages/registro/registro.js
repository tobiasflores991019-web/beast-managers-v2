import { registrarUsuario } from "../../services/auth.service.js";

import { crearPerfilUsuario } from "../../services/usuario.service.js";


const formulario = document.getElementById("formRegistro");


formulario.addEventListener("submit", async (event) => {

    event.preventDefault();


    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const telefono =
        document.getElementById("telefono").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const password2 =
        document.getElementById("password2").value;

    const terminos =
        document.getElementById("terminos").checked;


    if (password !== password2) {

        alert("Las contraseñas no coinciden.");

        return;

    }


    if (!terminos) {

        alert("Debés aceptar los términos y condiciones.");

        return;

    }

    try {

    const usuario = await registrarUsuario(
        email,
        password
    );

    console.log("Usuario creado:", usuario);

    await crearPerfilUsuario(usuario.uid, {
    nombre,
    apellido,
    telefono,
    email
});

console.log("Perfil guardado correctamente");

} catch (error) {

    console.error("Error al crear usuario:", error);

}

});