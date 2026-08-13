import {
    obtenerUsuarioActual
} from "../../../services/auth.service.js";



import {
    obtenerTurnosCliente,
    cancelarTurno
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

function ordenarTurnos() {

    turnos.sort((a, b) => {

        const fechaA =
            a.fechaHora?.toMillis?.() ||
            new Date(
                `${a.fechaISO}T${a.horario || "00:00"}`
            ).getTime();

        const fechaB =
            b.fechaHora?.toMillis?.() ||
            new Date(
                `${b.fechaISO}T${b.horario || "00:00"}`
            ).getTime();

        return fechaA - fechaB;

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
    prepararFecha(
        turno.fechaISO,
        turno.fecha
    );

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


    const btnMenu =
    card.querySelector(".btn-menu");

btnMenu.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        mostrarMenuGestion(
            turno,
            btnMenu
        );

    }
);


    


    return card;

}

// ======================================================
// MENU GESTIONAR TURNO
// ======================================================

function mostrarMenuGestion(turno, boton) {

    // Cerrar cualquier menú anterior

    const menuAnterior =
        document.querySelector(".gestion-menu");

    if (menuAnterior) {
        menuAnterior.remove();
    }


    // Crear menú

    const menu =
        document.createElement("div");

    menu.className =
        "gestion-menu";


    // Estado actual

    const estado =
        String(
            turno.estado || "pendiente"
        ).toLowerCase();


    // Acciones disponibles

    let acciones = `
        <button
            class="gestion-item"
            data-accion="detalles">

            <i class="fa-regular fa-eye"></i>

            <span>Ver detalles</span>

        </button>
    `;


    // Solo permitir modificar
    // turnos pendientes o confirmados

    if (
        estado === "pendiente" ||
        estado === "confirmado"
    ) {

        acciones += `

            <button
                class="gestion-item"
                data-accion="reprogramar">

                <i class="fa-solid fa-calendar-days"></i>

                <span>Reprogramar</span>

            </button>


            <button
                class="gestion-item cancelar"
                data-accion="cancelar">

                <i class="fa-solid fa-xmark"></i>

                <span>Cancelar turno</span>

            </button>

        `;

    }


    menu.innerHTML = acciones;


    document.body.appendChild(menu);


    // Posición del menú

    const rect =
        boton.getBoundingClientRect();

    const ancho =
        menu.offsetWidth;

    let left =
        rect.right - ancho;

    let top =
        rect.bottom + 8;


    // Evitar que salga de la pantalla

    if (
        left < 10
    ) {
        left = 10;
    }

    if (
        left + ancho >
        window.innerWidth - 10
    ) {
        left =
            window.innerWidth -
            ancho -
            10;
    }


    if (
        top + menu.offsetHeight >
        window.innerHeight - 10
    ) {

        top =
            rect.top -
            menu.offsetHeight -
            8;

    }


    menu.style.left =
        `${left}px`;

    menu.style.top =
        `${top}px`;


    // Acciones

    menu
        .querySelectorAll(".gestion-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const accion =
                        item.dataset.accion;


                    menu.remove();


                    if (
                        accion ===
                        "detalles"
                    ) {

                        mostrarDetalles(
                            turno
                        );

                    }


                    if (
                        accion ===
                        "reprogramar"
                    ) {

                        console.log(
                            "🔄 Reprogramar turno:",
                            turno.id
                        );

                        alert(
                            "La reprogramación la vamos a conectar en el próximo paso."
                        );

                    }


                   if (
                    accion ===
                          "cancelar"
                    ) {

                     mostrarConfirmacionCancelacion(
                           turno
                 );

                 }

                }
            );

        });


    // Cerrar al hacer click afuera

    setTimeout(() => {

        document.addEventListener(
            "click",
            cerrarMenuGestion,
            {
                once: true
            }
        );

    }, 0);


    function cerrarMenuGestion(event) {

        if (
            !menu.contains(event.target) &&
            event.target !== boton
        ) {

            menu.remove();

        }

    }

}

// ======================================================
// CONFIRMAR CANCELACION
// ======================================================

function mostrarConfirmacionCancelacion(turno) {

    const modal =
        document.createElement("div");

    modal.className =
        "modal modal-cancelacion";


    modal.innerHTML = `

        <div class="modal-card cancelacion-card">

            <button
                class="modal-close"
                id="cerrarCancelacion">

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="cancelacion-icon">

                <i class="fa-solid fa-calendar-xmark"></i>

            </div>


            <h2>
                ¿Cancelar turno?
            </h2>


            <p class="cancelacion-texto">

                Estás por cancelar tu turno.
                Esta acción cambiará el estado
                de la reserva a cancelado.

            </p>


            <div class="cancelacion-info">

                <strong>
                    ${turno.servicio || "Servicio"}
                </strong>

                <span>
                    ${turno.fecha || "-"}
                </span>

                <span>
                    ${turno.horario || "--:--"} hs
                </span>

                <span>
                    ${turno.barbero || "Sin asignar"}
                </span>

            </div>


            <div class="cancelacion-actions">

                <button
                    class="btn-volver"
                    id="btnVolverCancelacion">

                    VOLVER

                </button>


                <button
                    class="btn-confirmar-cancelacion"
                    id="btnConfirmarCancelacion">

                    CANCELAR TURNO

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // CERRAR

    const cerrar =
        () => {

            modal.remove();

        };


    document
        .getElementById(
            "cerrarCancelacion"
        )
        .addEventListener(
            "click",
            cerrar
        );


    document
        .getElementById(
            "btnVolverCancelacion"
        )
        .addEventListener(
            "click",
            cerrar
        );


    // CONFIRMAR

    document
        .getElementById(
            "btnConfirmarCancelacion"
        )
        .addEventListener(
            "click",
            async () => {

                const boton =
                    document.getElementById(
                        "btnConfirmarCancelacion"
                    );


                boton.disabled = true;

                boton.textContent =
                    "CANCELANDO...";


                try {

                    await cancelarTurno(
                        turno.id
                    );


                    console.log(
                        "✅ Turno cancelado:",
                        turno.id
                    );


                    modal.remove();


                    // Actualizar objeto local

                    turno.estado =
                        "cancelado";


                    // Volver a renderizar

                    renderizar();


                } catch(error) {

                    console.error(
                        "❌ Error cancelando turno:",
                        error
                    );


                    boton.disabled =
                        false;

                    boton.textContent =
                        "CANCELAR TURNO";


                    alert(
                        "No pudimos cancelar el turno. Intentá nuevamente."
                    );

                }

            }
        );


    // Cerrar haciendo click
    // fuera de la tarjeta

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                cerrar();

            }

        }
    );

}


// ======================================================
// FECHA
// ======================================================

function prepararFecha(fechaISO, fechaTexto) {

    // NUEVO FORMATO
    // Ejemplo: 2026-08-14

    if (fechaISO) {

        const partes =
            fechaISO.split("-");

        if (partes.length === 3) {

            const fecha =
                new Date(
                    Number(partes[0]),
                    Number(partes[1]) - 1,
                    Number(partes[2])
                );

            return {

                diaSemana:
                    fecha
                        .toLocaleDateString(
                            "es-AR",
                            {
                                weekday: "short"
                            }
                        )
                        .replace(".", "")
                        .toUpperCase(),

                dia:
                    fecha.getDate(),

                mes:
                    fecha
                        .toLocaleDateString(
                            "es-AR",
                            {
                                month: "short"
                            }
                        )
                        .replace(".", "")
                        .toUpperCase()

            };

        }

    }


    // FORMATO ANTIGUO
    // Ejemplo: "Viernes, 14 de agosto"

    if (fechaTexto) {

        const match =
            String(fechaTexto).match(
                /(\d{1,2})\s+de\s+([a-záéíóú]+)/i
            );

        if (match) {

            const dia =
                Number(match[1]);

            const meses = {
                enero: 0,
                febrero: 1,
                marzo: 2,
                abril: 3,
                mayo: 4,
                junio: 5,
                julio: 6,
                agosto: 7,
                septiembre: 8,
                octubre: 9,
                noviembre: 10,
                diciembre: 11
            };

            const mes =
                meses[
                    match[2].toLowerCase()
                ];

            if (mes !== undefined) {

                const fecha =
                    new Date(
                        new Date().getFullYear(),
                        mes,
                        dia
                    );

                return {

                    diaSemana:
                        fecha
                            .toLocaleDateString(
                                "es-AR",
                                {
                                    weekday: "short"
                                }
                            )
                            .replace(".", "")
                            .toUpperCase(),

                    dia:
                        dia,

                    mes:
                        fecha
                            .toLocaleDateString(
                                "es-AR",
                                {
                                    month: "short"
                                }
                            )
                            .replace(".", "")
                            .toUpperCase()

                };

            }

        }

    }


    // SI NO HAY FECHA

    return {

        diaSemana: "",
        dia: "--",
        mes: ""

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

        <div class="detalle-row">
    <span>Observaciones</span>
    <strong>
        ${turno.observaciones || "Sin observaciones"}
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