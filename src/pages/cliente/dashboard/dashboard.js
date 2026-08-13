
/*======================================================
                PARTE 1 - INICIALIZACIÓN
======================================================*/

import { obtenerUsuarioActual } from "../../../services/auth.service.js";

import { obtenerPerfilUsuario } from "../../../services/usuario.service.js";

import {
    obtenerTurnosCliente
} from "../../../services/turnos.services.js";


document.addEventListener("DOMContentLoaded", () => {

    iniciarDashboard();

});

/*======================================================
                INICIAR DASHBOARD
======================================================*/

export function iniciarDashboard(){

    iniciarLoader();

    obtenerElementos();

    mostrarSaludo();

    cargarCliente();

    cargarProximoTurno();

    iniciarAnimaciones();

    iniciarEventos();

    iniciarMenuActivo();

    iniciarSliderPromociones();

    cargarProductos();

    cargarSucursales();

    cargarPerfilReal();

    console.log("✔ Beast Managers iniciado.");

}

/*======================================================
                ELEMENTOS DEL DOM
======================================================*/

let nombreCliente;

let saludoCliente;

let fechaActual;

function obtenerElementos(){

    nombreCliente = document.getElementById("nombreCliente");

    saludoCliente = document.getElementById("saludoCliente");

    fechaActual = document.getElementById("fechaActual");

}

/*======================================================
                SALUDO AUTOMÁTICO
======================================================*/

function mostrarSaludo(){

    if(!saludoCliente) return;

    const hora = new Date().getHours();

    let saludo = "";

    if(hora >= 6 && hora < 12){

        saludo = "☀️ Buenos días";

    }

    else if(hora >= 12 && hora < 20){

        saludo = "🌤 Buenas tardes";

    }

    else{

        saludo = "🌙 Buenas noches";

    }

    saludoCliente.textContent = saludo;

}

/*======================================================
                FECHA ACTUAL
======================================================*/

function mostrarFechaActual(){

    if(!fechaActual) return;

    const hoy = new Date();

    const opciones = {

        weekday: "long",

        day: "numeric",

        month: "long"

    };

    const texto = hoy.toLocaleDateString("es-AR", opciones);

    fechaActual.textContent = texto;

}

/*======================================================
            PARTE 2 - DATOS DEL CLIENTE
======================================================*/

/*
    Esta información más adelante vendrá desde Firebase.

    Por ahora utilizamos un objeto local para poder
    desarrollar toda la aplicación.
*/

const cliente = {

    nombre: "Tobias",

    apellido: "Flores",

    sucursal: "The Beast Barbershop",

    ciudad: "Remedios de Escalada",

    membresia: "Gold",

    foto: "../../assets/img/clientes/default-user.png"

};

/*======================================================
            CARGAR INFORMACIÓN DEL CLIENTE
======================================================*/

function cargarCliente(){

    cargarNombre();

    cargarSucursal();

    cargarCiudad();

}

/*======================================================
                NOMBRE
======================================================*/

function cargarNombre(){

    const elemento = document.getElementById("nombreCliente");

    if(!elemento) return;

    elemento.textContent = cliente.nombre;

}

/*======================================================
                SUCURSAL
======================================================*/

function cargarSucursal(){

    const empresa = document.getElementById("empresaCliente");

    if(!empresa) return;

    empresa.textContent = cliente.sucursal;

}

/*======================================================
                CIUDAD
======================================================*/

function cargarCiudad(){

    const ciudad = document.getElementById("ciudadCliente");

    if(!ciudad) return;

    ciudad.textContent = cliente.ciudad;

}

/*======================================================
            PARTE 3 - PRÓXIMO TURNO
======================================================*/


/*======================================================
            CARGAR PRÓXIMO TURNO
======================================================*/

async function cargarProximoTurno(){

    try {

        const usuario =
            await obtenerUsuarioActual();

        if(!usuario){

            mostrarSinTurno();

            return;

        }

        const turnos =
            await obtenerTurnosCliente(
                usuario.uid
            );

        console.log(
            "📅 Turnos del cliente:",
            turnos
        );

        // No mostrar cancelados
        const turnosActivos =
            turnos.filter(turno =>
                turno.estado !== "cancelado"
            );

        if(turnosActivos.length === 0){

            mostrarSinTurno();

            return;

        }

        // Por ahora mostramos el último turno creado
        const proximo =
            turnosActivos
                .sort((a,b) => {

                    const fechaA =
                        a.fechaCreacion?.toMillis?.() || 0;

                    const fechaB =
                        b.fechaCreacion?.toMillis?.() || 0;

                    return fechaB - fechaA;

                })[0];

        mostrarTurno(proximo);

    } catch(error) {

        console.error(
            "❌ Error cargando próximo turno:",
            error
        );

        mostrarSinTurno();

    }

}

/*======================================================
            MOSTRAR TURNO
======================================================*/

function mostrarTurno(turno){

    actualizarTexto(
        "turnoFecha",
        turno.fecha || "-"
    );

    actualizarTexto(
        "turnoHora",
        turno.horario
            ? `${turno.horario} hs`
            : "-"
    );

    actualizarTexto(
        "turnoBarbero",
        turno.barbero || "-"
    );

    actualizarTexto(
        "turnoServicio",
        turno.servicio || "-"
    );

    actualizarTexto(
        "turnoSucursal",
        turno.sucursal || "-"
    );

    actualizarTexto(
        "estadoTurno",
        turno.estado || "Pendiente"
    );

    actualizarEstadoTurno(
        turno.estado || "Pendiente"
    );

}

/*======================================================
            SIN TURNO
======================================================*/

function mostrarSinTurno(){

    actualizarTexto("turnoFecha","No tenés turnos");

    actualizarTexto("turnoHora","");

    actualizarTexto("turnoBarbero","");

    actualizarTexto("turnoServicio","");

    actualizarTexto("turnoSucursal","");

    actualizarTexto("estadoTurno","Sin reservas");

}

/*======================================================
            FUNCIÓN AUXILIAR
======================================================*/

function actualizarTexto(id,texto){

    const elemento = document.getElementById(id);

    if(!elemento) return;

    elemento.textContent = texto;

}

/*======================================================
            PARTE 4 - ESTADO DEL TURNO
======================================================*/

/*
    Estados posibles

    Confirmado
    Pendiente
    En Curso
    Finalizado
    Cancelado
*/

/*======================================================
            ACTUALIZAR ESTADO
======================================================*/
function actualizarEstadoTurno(estadoTurno){

    const estado =
        document.getElementById("estadoTurno");

    if(!estado) return;

    estado.className = "status";

    switch(estadoTurno.toLowerCase()){

        case "confirmado":

            estado.classList.add("active");

            estado.textContent =
                "Confirmado";

            break;

        case "pendiente":

            estado.classList.add("pending");

            estado.textContent =
                "Pendiente";

            break;

        case "en curso":

            estado.classList.add("progress");

            estado.textContent =
                "En Curso";

            break;

        case "finalizado":

            estado.classList.add("finished");

            estado.textContent =
                "Finalizado";

            break;

        case "cancelado":

            estado.classList.add("cancelled");

            estado.textContent =
                "Cancelado";

            break;

        default:

            estado.classList.add("pending");

            estado.textContent =
                "Pendiente";

    }

}

/*======================================================
            PARTE 5 - ANIMACIONES
======================================================*/

/*======================================================
        INICIAR ANIMACIONES
======================================================*/

function iniciarAnimaciones(){

    const secciones = document.querySelectorAll(

        ".welcome," +
        ".next-appointment," +
        ".quick-actions," +
        ".promotions," +
        ".favorite-barbers," +
        ".history," +
        ".membership," +
        ".products," +
        ".branches," +
        ".contact-section"

    );

    secciones.forEach((seccion,index)=>{

        seccion.style.opacity = "0";

        seccion.style.transform = "translateY(35px)";

        setTimeout(()=>{

            seccion.style.transition =
            "all .65s ease";

            seccion.style.opacity = "1";

            seccion.style.transform =
            "translateY(0)";

        },index*120);

    });

}

/*======================================================
            PARTE 6 - TOAST NOTIFICATIONS
======================================================*/

/*======================================================
            MOSTRAR TOAST
======================================================*/

function mostrarToast(mensaje,tipo="success"){

    const toast = document.createElement("div");

    toast.classList.add("toast");

    toast.classList.add(tipo);

    toast.innerHTML = `

        <div class="toast-icon">

            ${obtenerIconoToast(tipo)}

        </div>

        <div class="toast-message">

            ${mensaje}

        </div>

    `;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}

/*======================================================
            ICONOS
======================================================*/

function obtenerIconoToast(tipo){

    switch(tipo){

        case "success":

            return '<i class="fa-solid fa-circle-check"></i>';

        case "error":

            return '<i class="fa-solid fa-circle-xmark"></i>';

        case "warning":

            return '<i class="fa-solid fa-triangle-exclamation"></i>';

        case "info":

            return '<i class="fa-solid fa-circle-info"></i>';

        default:

            return '<i class="fa-solid fa-circle-check"></i>';

    }

}

/*======================================================
            PARTE 7 - LOADER
======================================================*/

/*======================================================
            INICIAR LOADER
======================================================*/

function iniciarLoader(){

    const loader = document.getElementById("loader");

    if(!loader) return;

    loader.style.display = "flex";

    setTimeout(()=>{

        loader.classList.add("hide");

        setTimeout(()=>{

            loader.remove();

        },700);

    },1800);

}


/*======================================================
            PARTE 7 - EVENTOS DEL DASHBOARD
======================================================*/

/*======================================================
            INICIAR EVENTOS
======================================================*/


function iniciarEventos(){

    iniciarBotones();

}   

/*======================================================
            BOTONES
======================================================*/

function iniciarBotones(){

    document.querySelectorAll("button").forEach(boton=>{

        boton.addEventListener("click",eventoBoton);

    });

}

/*======================================================
            EVENTO BOTÓN
======================================================*/

function eventoBoton(e){

    const texto = e.currentTarget.innerText.trim();

    console.log("Botón:",texto);

    switch(texto){

        case "Ver Detalles":

            mostrarToast("Abriendo información del turno...","info");

            break;

        case "Reprogramar":

            mostrarToast("Redirigiendo para reprogramar...","warning");

            break;

        case "Reservar":

            mostrarToast("Abriendo reservas...","success");

            break;

        case "Cómo llegar":

            mostrarToast("Abriendo Google Maps...","info");

            break;

        case "WhatsApp":

            mostrarToast("Abriendo WhatsApp...","success");

            break;

        default:

            mostrarToast(texto,"info");

    }

}

/*======================================================
            PARTE 8 - MENÚ INFERIOR ACTIVO
======================================================*/

/*======================================================
            INICIAR MENÚ
======================================================*/

function iniciarMenuActivo(){

    const pagina = window.location.pathname.toLowerCase();

    const items = document.querySelectorAll(".nav-item");

    items.forEach(item=>{

        item.classList.remove("active");

    });

    items.forEach(item=>{

        const enlace = item.getAttribute("href");

        if(!enlace) return;

        if(pagina.includes("dashboard") && enlace.includes("dashboard")){

            item.classList.add("active");

        }

        else if(pagina.includes("mis-turnos") && enlace.includes("mis-turnos")){

            item.classList.add("active");

        }

        else if(pagina.includes("beneficios") && enlace.includes("beneficios")){

            item.classList.add("active");

        }

        else if(pagina.includes("perfil") && enlace.includes("perfil")){

            item.classList.add("active");

        }

    });

}

/*======================================================
            PARTE 9 - SLIDER DE PROMOCIONES
======================================================*/

let slider;

let tarjetas;

let indiceActual = 0;

let intervaloSlider;

/*======================================================
            INICIAR SLIDER
======================================================*/

function iniciarSliderPromociones(){

    slider = document.querySelector(".promo-slider");

    if(!slider) return;

    tarjetas = slider.querySelectorAll(".promo-card");

    if(tarjetas.length <= 1) return;

    crearIndicadores();

    iniciarAutoplay();

}

/*======================================================
            AUTOPLAY
======================================================*/

function iniciarAutoplay(){

    intervaloSlider = setInterval(()=>{

        siguientePromo();

    },5000);

}

/*======================================================
            SIGUIENTE
======================================================*/

function siguientePromo(){

    indiceActual++;

    if(indiceActual >= tarjetas.length){

        indiceActual = 0;

    }

    moverSlider();

}

/*======================================================
            ANTERIOR
======================================================*/

function anteriorPromo(){

    indiceActual--;

    if(indiceActual < 0){

        indiceActual = tarjetas.length - 1;

    }

    moverSlider();

}

/*======================================================
            MOVER SLIDER
======================================================*/

function moverSlider(){

    const ancho = tarjetas[0].offsetWidth + 20;

    slider.scrollTo({

        left: indiceActual * ancho,

        behavior:"smooth"

    });

    actualizarIndicadores();

}

/*======================================================
            PAUSAR
======================================================*/

function pausarSlider(){

    clearInterval(intervaloSlider);

}

/*======================================================
            REANUDAR
======================================================*/

function reanudarSlider(){

    clearInterval(intervaloSlider);

    iniciarAutoplay();

}

/*======================================================
            INDICADORES
======================================================*/

function crearIndicadores(){

    const contenedor = document.createElement("div");

    contenedor.className = "slider-indicators";

    tarjetas.forEach((_,index)=>{

        const punto = document.createElement("span");

        punto.className = "indicator";

        if(index===0){

            punto.classList.add("active");

        }

        punto.addEventListener("click",()=>{

            indiceActual = index;

            moverSlider();

            reanudarSlider();

        });

        contenedor.appendChild(punto);

    });

    slider.parentElement.appendChild(contenedor);

    slider.addEventListener("mouseenter",pausarSlider);

    slider.addEventListener("mouseleave",reanudarSlider);

}

/*======================================================
            ACTUALIZAR INDICADORES
======================================================*/

function actualizarIndicadores(){

    const puntos = document.querySelectorAll(".indicator");

    puntos.forEach(p=>{

        p.classList.remove("active");

    });

    if(puntos[indiceActual]){

        puntos[indiceActual].classList.add("active");

    }

}

/*======================================================
            PARTE 10 - PRODUCTOS DESTACADOS
======================================================*/

/*
    Más adelante estos productos vendrán desde Firebase.
*/

const productos = [

   
       

];

/*======================================================
            CARGAR PRODUCTOS
======================================================*/

function cargarProductos(){

    const grid = document.querySelector(".products-grid");

    if(!grid) return;

    grid.innerHTML = "";

    productos.forEach(producto=>{

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}">

            <h3>

                ${producto.nombre}

            </h3>

            <span>

                ${producto.precio}

            </span>

        `;

        card.addEventListener("click",()=>{

            abrirProducto(producto);

        });

        grid.appendChild(card);

    });

}

/*======================================================
            ABRIR PRODUCTO
======================================================*/

function abrirProducto(producto){

    console.log(producto);

    mostrarToast(

        producto.nombre,

        "info"

    );

}

/*======================================================
            PARTE 11 - SUCURSALES
======================================================*/

/*
    Más adelante esta información vendrá desde Firebase.
*/

const sucursales = [

    {

        nombre:"The Beast Barbershop",

        ciudad:"Remedios de Escalada",

        direccion:"Marco Avellaneda 1012",

        horario:"Lunes a Sábado · 10:00 a 20:00 hs",

        telefono:"+54 11 6549-5730",

        estado:"Abierto"

    },

    {

        nombre:"The Beast Barbershop",

        ciudad:"Lanús Oeste",

        direccion:"Santiago Plaul 2131",

        horario:"Lunes a Sábado · 10:00 a 20:00 hs",

        telefono:"+54 11 6549-5730",

        estado:"Abierto"

    }

];

/*======================================================
            CARGAR SUCURSALES
======================================================*/

function cargarSucursales(){

    const section = document.querySelector(".branches");

    if(!section) return;

    const cardsViejas = section.querySelectorAll(".branch-card");

    cardsViejas.forEach(card=>card.remove());

    sucursales.forEach(sucursal=>{

        const card = document.createElement("div");

        card.className = "branch-card";

        card.innerHTML = `

            <div class="branch-header">

                <div>

                    <h3>${sucursal.nombre}</h3>

                    <span>${sucursal.ciudad}</span>

                </div>

                <span class="branch-status open">

                    ${sucursal.estado}

                </span>

            </div>

            <div class="branch-info">

                <p>

                    <i class="fa-solid fa-location-dot"></i>

                    ${sucursal.direccion}

                </p>

                <p>

                    <i class="fa-regular fa-clock"></i>

                    ${sucursal.horario}

                </p>

                <p>

                    <i class="fa-solid fa-phone"></i>

                    ${sucursal.telefono}

                </p>

            </div>

            <div class="branch-buttons">

                <button
                    class="mini-btn btn-mapa">

                    <i class="fa-solid fa-map-location-dot"></i>

                    Cómo llegar

                </button>

                <button
                    class="mini-btn btn-whatsapp">

                    <i class="fa-brands fa-whatsapp"></i>

                    WhatsApp

                </button>

            </div>

        `;

        section.appendChild(card);

    });

}


/*======================================================
            PERFIL REAL DESDE FIREBASE
======================================================*/

async function cargarPerfilReal(){

    try {

        console.log("🔥 Cargando perfil real...");


        // Obtener usuario autenticado

        const usuario = await obtenerUsuarioActual();


        if(!usuario){

            console.log("No hay usuario autenticado.");

            return;

        }


        console.log("Usuario autenticado:", usuario.uid);


        // Obtener perfil de Firestore

        const perfil = await obtenerPerfilUsuario(usuario.uid);


        if(!perfil){

            console.log("No se encontró el perfil en Firestore.");

            return;

        }


        console.log("Perfil real:", perfil);


        // Nombre

        const nombre = document.getElementById("nombreCliente");

        if(nombre){

            nombre.textContent = perfil.nombre;

        }


        // Sucursal

        const empresa = document.getElementById("empresaCliente");

        if(empresa){

            empresa.textContent = "The Beast Barbershop";

        }


        // Ciudad

        const ciudad = document.getElementById("ciudadCliente");

        if(ciudad){

            ciudad.textContent = "Remedios de Escalada";

        }


        console.log("✅ Perfil cargado en Dashboard.");

    }

    catch(error){

        console.error(
            "❌ Error cargando perfil:",
            error
        );

    }

}

/*======================================================
            PARTE 12 - FUNCIONES GENERALES
======================================================*/

/*======================================================
            ABRIR WHATSAPP
======================================================*/

function abrirWhatsApp(numero,mensaje=""){

    const texto = encodeURIComponent(mensaje);

    window.open(

        `https://wa.me/${numero}?text=${texto}`,

        "_blank"

    );

}

/*======================================================
            ABRIR MAPS
======================================================*/

function abrirMapa(direccion){

    const url =

    "https://www.google.com/maps/search/?api=1&query=" +

    encodeURIComponent(direccion);

    window.open(url,"_blank");

}

/*======================================================
            FORMATEAR PRECIO
======================================================*/

function formatearPrecio(precio){

    return new Intl.NumberFormat(

        "es-AR",

        {

            style:"currency",

            currency:"ARS",

            maximumFractionDigits:0

        }

    ).format(precio);

}

/*======================================================
            FECHA ACTUAL
======================================================*/

function obtenerFechaActual(){

    return new Date().toLocaleDateString(

        "es-AR",

        {

            weekday:"long",

            day:"numeric",

            month:"long"

        }

    );

}

/*======================================================
            HORA ACTUAL
======================================================*/

function obtenerHoraActual(){

    return new Date().toLocaleTimeString(

        "es-AR",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}

/*======================================================
            UTILIDADES
======================================================*/

const Utils = {

    abrirWhatsApp,

    abrirMapa,

    formatearPrecio,

    obtenerFechaActual,

    obtenerHoraActual

};

console.log("✔ Utilidades cargadas.");

async function protegerPagina() {

    try {

        const usuario = await obtenerUsuarioActual();

        if (!usuario) {

            console.log(
                "⚠️ Usuario no autenticado. Redirigiendo al login..."
            );

            window.location.href =
                "/src/pages/login/login.html";

            return false;
        }

        console.log(
            "✅ Usuario autenticado:",
            usuario.uid
        );

        return true;

    } catch (error) {

        console.error(
            "❌ Error verificando autenticación:",
            error
        );

        window.location.href =
            "/src/pages/login/login.html";

        return false;
    }
}