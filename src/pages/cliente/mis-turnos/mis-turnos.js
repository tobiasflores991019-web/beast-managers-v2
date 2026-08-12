import {
    obtenerUsuarioActual
} from "../../../services/auth.service.js";

import {
    obtenerTurnosCliente
} from "../../../services/turnos.services.js";


// ======================================================
// ESTADO
// ======================================================

let turnos = [];

let vistaActual = "proximos";


// ======================================================
// INICIO
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    iniciar();

});


async function iniciar(){

    console.log("🔥 Iniciando Mis Turnos...");

    configurarEventos();

    await cargarTurnos();

}


// ======================================================
// CARGAR FIREBASE
// ======================================================

async function cargarTurnos(){

    const lista =
        document.getElementById("listaTurnos");

    lista.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Cargando tus turnos...</p>
        </div>
    `;

    try {

        const usuario =
            await obtenerUsuarioActual();

        if(!usuario){

            console.warn(
                "No hay usuario autenticado."
            );

            mostrarSinTurnos();

            return;

        }

        console.log(
            "👤 Usuario:",
            usuario.uid
        );

        turnos =
            await obtenerTurnosCliente(
                usuario.uid
            );

        console.log(
            "📅 Turnos encontrados:",
            turnos
        );

        ordenarTurnos();

        renderizar();

    } catch(error){

        console.error(
            "❌ Error cargando turnos:",
            error
        );

        lista.innerHTML = `
            <div class="empty-state">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>No pudimos cargar tus turnos</h3>

                <p>
                    Intentá nuevamente en unos segundos.
                </p>

            </div>
        `;

    }

}


// ======================================================
// ORDENAR
// ======================================================

function ordenarTurnos(){

    turnos.sort((a,b) => {

        const fechaA =
            a.fechaCreacion?.toMillis?.() || 0;

        const fechaB =
            b.fechaCreacion?.toMillis?.() || 0;

        return fechaB - fechaA;

    });

}


// ======================================================
// RENDER
// ======================================================

function renderizar(){

    const lista =
        document.getElementById("listaTurnos");

    let filtrados;

    if(vistaActual === "proximos"){

        filtrados =
            turnos.filter(turno =>
                turno.estado !== "cancelado" &&
                turno.estado !== "finalizado"
            );

    }else{

        filtrados =
            turnos.filter(turno =>
                turno.estado === "cancelado" ||
                turno.estado === "finalizado"
            );

    }

    document.getElementById(
        "tituloLista"
    ).textContent =
        vistaActual === "proximos"
            ? "Próximos Turnos"
            : "Historial";

    document.getElementById(
        "contadorTurnos"
    ).textContent =
        `${filtrados.length} ${filtrados.length === 1 ? "turno" : "turnos"}`;


    if(filtrados.length === 0){

        mostrarSinTurnos();

        return;

    }

    document
        .getElementById("sinTurnos")
        .classList.add("hidden");

    lista.innerHTML = "";

    filtrados.forEach(turno => {

        lista.appendChild(
            crearTarjetaTurno(turno)
        );

    });

}


// ======================================================
// CREAR TARJETA
// ======================================================

function crearTarjetaTurno(turno){

    const card =
        document.createElement("article");

    const estado =
        normalizarEstado(turno.estado);

    card.className =
        `turno-card ${estado}`;

    const fecha =
        prepararFecha(turno.fecha);

    card.innerHTML = `

        <div class="fecha">

            <div class="dia">
                ${fecha.diaSemana}
            </div>

            <span class="numero">
                ${fecha.dia}
            </span>

            <div class="mes">
                ${fecha.mes}
            </div>

        </div>


        <div class="turno-info">

            <p class="hora">
                <i class="fa-regular fa-clock"></i>
                ${turno.horario || "--:--"} hs
            </p>

            <h3>
                ${turno.servicio || "Servicio"}
            </h3>

            <p>
                <i class="fa-regular fa-user"></i>
                ${turno.barbero || "Sin asignar"}
            </p>

            <p>
                <i class="fa-solid fa-location-dot"></i>
                ${turno.sucursal || "-"}
            </p>

        </div>


        <div class="turno-side">

            <span class="estado ${estado}">
                ${formatearEstado(turno.estado)}
            </span>

            <div class="turno-actions">

                <button
                    class="btn-detalles"
                    data-id="${turno.id}">

                    <i class="fa-regular fa-eye"></i>

                    Ver Detalles

                </button>

                <button
                    class="btn-menu"
                    data-id="${turno.id}">

                    <i class="fa-solid fa-ellipsis-vertical"></i>

                </button>

            </div>

        </div>

    `;


    const btnDetalles =
        card.querySelector(".btn-detalles");

    btnDetalles.addEventListener(
        "click",
        () => {

            mostrarDetalles(turno);

        }
    );


    const btnMenu =
        card.querySelector(".btn-menu");

    btnMenu.addEventListener(
        "click",
        () => {

            mostrarDetalles(turno);

        }
    );


    return card;

}


// ======================================================
// FECHA
// ======================================================

function prepararFecha(fecha){

    const ahora = new Date();

    let date = null;


    if(fecha === "Hoy"){

        date = new Date();

    }

    else if(fecha === "Mañana"){

        date = new Date();

        date.setDate(
            date.getDate() + 1
        );

    }

    else {

        const match =
            String(fecha).match(
                /(\d{1,2})\/(\d{1,2})/
            );

        if(match){

            date = new Date(
                ahora.getFullYear(),
                Number(match[2]) - 1,
                Number(match[1])
            );

        }

    }


    if(!date){

        return {

            diaSemana: "",
            dia: "--",
            mes: ""

        };

    }


    return {

        diaSemana:
            date
                .toLocaleDateString(
                    "es-AR",
                    { weekday: "short" }
                )
                .replace(".", "")
                .toUpperCase(),

        dia:
            date.getDate(),

        mes:
            date
                .toLocaleDateString(
                    "es-AR",
                    { month: "short" }
                )
                .replace(".", "")
                .toUpperCase()

    };

}


// ======================================================
// ESTADO
// ======================================================

function normalizarEstado(estado){

    return String(
        estado || "pendiente"
    )
    .toLowerCase()
    .replaceAll(" ", "-");

}


function formatearEstado(estado){

    switch(
        String(estado || "").toLowerCase()
    ){

        case "confirmado":
            return "Confirmado";

        case "pendiente":
            return "Pendiente";

        case "finalizado":
            return "Terminado";

        case "cancelado":
            return "Cancelado";

        case "en curso":
            return "En curso";

        default:
            return "Pendiente";

    }

}


// ======================================================
// DETALLES
// ======================================================

function mostrarDetalles(turno){

    const contenido =
        document.getElementById(
            "detalleContenido"
        );

    contenido.innerHTML = `

        <div class="detalle-row">
            <span>Reserva</span>
            <strong>
                ${turno.codigoReserva || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Servicio</span>
            <strong>
                ${turno.servicio || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Precio</span>
            <strong>
                ${formatearPrecio(turno.precio)}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Fecha</span>
            <strong>
                ${turno.fecha || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Horario</span>
            <strong>
                ${turno.horario || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Barbero</span>
            <strong>
                ${turno.barbero || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Sucursal</span>
            <strong>
                ${turno.sucursal || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Pago</span>
            <strong>
                ${turno.pago || "-"}
            </strong>
        </div>

        <div class="detalle-row">
            <span>Estado</span>
            <strong>
                ${formatearEstado(turno.estado)}
            </strong>
        </div>

    `;

    document
        .getElementById("modalDetalles")
        .classList.remove("hidden");

}


// ======================================================
// SIN TURNOS
// ======================================================

function mostrarSinTurnos(){

    document
        .getElementById("listaTurnos")
        .innerHTML = "";

    document
        .getElementById("sinTurnos")
        .classList.remove("hidden");

}


// ======================================================
// EVENTOS
// ======================================================

function configurarEventos(){

    document
        .getElementById("tabProximos")
        .addEventListener(
            "click",
            () => {

                vistaActual = "proximos";

                cambiarTab();

                renderizar();

            }
        );


    document
        .getElementById("tabHistorial")
        .addEventListener(
            "click",
            () => {

                vistaActual = "historial";

                cambiarTab();

                renderizar();

            }
        );


    document
        .getElementById("cerrarModal")
        .addEventListener(
            "click",
            cerrarModal
        );


    document
        .getElementById("modalDetalles")
        .addEventListener(
            "click",
            e => {

                if(
                    e.target.id ===
                    "modalDetalles"
                ){

                    cerrarModal();

                }

            }
        );

}


function cambiarTab(){

    document
        .getElementById("tabProximos")
        .classList.toggle(
            "active",
            vistaActual === "proximos"
        );

    document
        .getElementById("tabHistorial")
        .classList.toggle(
            "active",
            vistaActual === "historial"
        );

}


// ======================================================
// MODAL
// ======================================================

function cerrarModal(){

    document
        .getElementById("modalDetalles")
        .classList.add("hidden");

}


// ======================================================
// PRECIO
// ======================================================

function formatearPrecio(precio){

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }
    ).format(
        Number(precio || 0)
    );

}