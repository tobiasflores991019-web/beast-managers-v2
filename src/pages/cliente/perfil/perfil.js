import {
    obtenerUsuarioActual,
    cerrarSesion
} from "../../../services/auth.service.js";

import {
    obtenerPerfilUsuario
} from "../../../services/usuario.service.js";


/* ======================================================
   ELEMENTOS
====================================================== */

const nombrePerfil =
    document.getElementById("nombrePerfil");

const apellidoPerfil =
    document.getElementById("apellidoPerfil");

const telefonoPerfil =
    document.getElementById("telefonoPerfil");

const emailPerfil =
    document.getElementById("emailPerfil");

const rolPerfil =
    document.getElementById("rolPerfil");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


/* ======================================================
   CARGAR PERFIL
====================================================== */

async function cargarPerfil() {

    try {

        console.log("🔄 Cargando perfil...");

        const usuario =
            await obtenerUsuarioActual();


        if (!usuario) {

            console.log("❌ No hay usuario autenticado.");

            window.location.href =
                "../../login/login.html";

            return;
        }


        console.log(
            "✅ Usuario autenticado:",
            usuario.uid
        );


        const perfil =
            await obtenerPerfilUsuario(
                usuario.uid
            );


        console.log(
            "📋 Perfil obtenido:",
            perfil
        );


        if (!perfil) {

            console.error(
                "❌ No se encontró el perfil."
            );

            return;
        }


        nombrePerfil.textContent =
            perfil.nombre || "-";

        apellidoPerfil.textContent =
            perfil.apellido || "-";

        telefonoPerfil.textContent =
            perfil.telefono || "-";

        emailPerfil.textContent =
            perfil.email || usuario.email || "-";

        rolPerfil.textContent =
            perfil.rol || "cliente";


        console.log(
            "✅ Perfil cargado correctamente."
        );


    } catch (error) {

        console.error(
            "❌ Error cargando perfil:",
            error
        );

    }

}


/* ======================================================
   CERRAR SESIÓN
====================================================== */

btnCerrarSesion.addEventListener(
    "click",
    async () => {

        const confirmar =
            confirm(
                "¿Seguro que querés cerrar sesión?"
            );


        if (!confirmar) {
            return;
        }


        try {

            await cerrarSesion();

            console.log(
                "✅ Sesión cerrada correctamente."
            );


            window.location.href =
                "../../login/login.html";


        } catch (error) {

            console.error(
                "❌ Error al cerrar sesión:",
                error
            );

        }

    }
);


/* ======================================================
   INICIAR
====================================================== */

cargarPerfil();