

import { obtenerUsuarioActual } from "../../services/auth.service.js";
import { obtenerPerfilUsuario } from "../../services/usuario.service.js";

import {
    crearTurno,
    obtenerTurnosDisponibles
} from "../../services/turnos.services.js";

import {
    obtenerPromociones
} from "../../services/promociones.service.js";

import {
    subirComprobante,
    subirComprobanteTurno
} from "../../firebase/firebase-storage.js";




let usuarioActual = null;
let perfilUsuario = null;
let promocionesDisponibles = [];

const TOTAL_PASOS = 9;

const SERVICIOS_COLOR = [
    "Aplicación de Color",
    "Global",
    "Claritos / Mechas"
];

function esServicioColor() {

    return SERVICIOS_COLOR.includes(
        turno.servicio
    );

}

let pasoActual = 1;

const turno = {

    clienteId: "",

    comprobanteTurnoUrl: "",

    sucursal: "",
    servicio: "",
    precio: 0,
    promocion: null,
    fecha: "",
   fechaISO: "",
   horario: "",
   fechaHora: null,
    barbero: "",
    pago: "",

    cliente: {
        nombre: "",
        apellido: "",
        telefono: "",
        correo: ""
    },

    observaciones: ""

};

export async function iniciarReserva() {

    console.log("🔥 iniciarReserva()");

    // ==========================================
    // CARGAR PROMOCIONES DESDE FIREBASE
    // ==========================================

    promocionesDisponibles =
        await obtenerPromociones();

    console.log(
        "🎁 Promociones disponibles:",
        promocionesDisponibles
    );

    // ==========================================
    // INICIAR PASOS
    // ==========================================

    iniciarPaso1();
    iniciarPaso2();
    iniciarPaso3();
    iniciarPaso4();
    iniciarPaso5();
    iniciarPaso6();
    iniciarPaso7();
    iniciarPaso8();

    console.log("✅ Todos los pasos iniciados");

    cargarUsuarioReserva();

}

async function cargarUsuarioReserva() {

    try {

        usuarioActual = await obtenerUsuarioActual();

        // ==========================================
        // CLIENTE SIN CUENTA
        // ==========================================

        if (!usuarioActual) {

            console.log("👤 Reserva como cliente invitado.");

            // No tiene clienteId porque no tiene cuenta
            turno.clienteId = "";

            // Los datos se completarán manualmente
            // en el PASO 7

            return;
        }

        // ==========================================
        // CLIENTE REGISTRADO
        // ==========================================

        console.log(
            "Usuario autenticado:",
            usuarioActual.uid
        );

        turno.clienteId = usuarioActual.uid;

        perfilUsuario =
            await obtenerPerfilUsuario(usuarioActual.uid);

        if (!perfilUsuario) {

            console.warn(
                "El usuario no tiene perfil en Firestore."
            );

            return;
        }

        console.log(
            "Perfil del usuario:",
            perfilUsuario
        );

        turno.cliente.nombre =
            perfilUsuario.nombre || "";

        turno.cliente.apellido =
            perfilUsuario.apellido || "";

        turno.cliente.telefono =
            perfilUsuario.telefono || "";

        turno.cliente.correo =
            perfilUsuario.email ||
            usuarioActual.email ||
            "";

        const nombre =
            document.getElementById("nombre");

        const apellido =
            document.getElementById("apellido");

        const telefono =
            document.getElementById("telefono");

        const correo =
            document.getElementById("correo");

        if (nombre) {
            nombre.value =
                turno.cliente.nombre;
        }

        if (apellido) {
            apellido.value =
                turno.cliente.apellido;
        }

        if (telefono) {
            telefono.value =
                turno.cliente.telefono;
        }

        if (correo) {
            correo.value =
                turno.cliente.correo;
        }

    } catch (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

    }

}

/*=========================================
            BARBEROS
=========================================*/

const barberos = {

    ori: {

        nombre: "Ori",

        foto: "../../assets/img/barbers/barberoori.png",

        rating: "4.0",

        estrellas: "★★★★★",

        experiencia: "2 años",

        descripcion: "Siempre brindar un servicio bueno y comodo para los clientes, hablar de lo que sea y ser un amigo mas en el servicio del corte",

        especialidades: [
            "Cualquier tipo de Fade",
            "Taper",
            "Barba",
            "Manejo de tijeras",

            "Cortes Clásicos"
        ],

        horarios: {

            "Marco Avellaneda": {

                lunes: ["12:00", "20:00"],
                martes: ["10:00", "16:00"],
                miercoles: null,
                jueves: ["10:00", "20:00"],
                viernes: ["10:00", "20:00"],
                sabado: null

            },

            "Santiago Plaul": {

                lunes: null,
                martes: null,
                miercoles: ["15:00", "20:00"],
                jueves: null,
                viernes: null,
                sabado: ["10:00", "20:00"]

            }

        }

    },


    benja: {

        nombre: "Benja",

        foto: "../../assets/img/barbers/barberobenja.png",

        rating: "4.0",

        estrellas: "★★★★★",

        experiencia: "2 años",

        descripcion:
            "Especialista en Fade de cualquier tipo, busco brindar el mejor servicio posible y atención a los clientes.",

        especialidades: [
            "Cualquier tipo de Fade",
            "Corte clásico",
            "Corte básico",
            "Corte con tijera"
        ],

        horarios: {

            "Marco Avellaneda": {

                lunes: null,
                martes: ["15:00", "20:00"],
                miercoles: ["15:00", "20:00"],
                jueves: null,
                viernes: ["15:00", "20:00"],
                sabado: ["10:00", "20:00"]

            },

            "Santiago Plaul": {

                lunes: null,
                martes: null,
                miercoles: null,
                jueves: null,
                viernes: null,
                sabado: null

            }

        }

    },


    dylan: {

        nombre: "Dylan",

        foto: "../../assets/img/barbers/barberodylan.png",

        rating: "4.0",

        estrellas: "★★★★★",

        experiencia: "4 años",

        descripcion:
            "Buena atención, buena calidad de trabajo y podemos aparte de hacer un buen corte tener una buena charla.",

        especialidades: [
            "Cualquier tipo de Fade",
            "Corte clásico",
            "Freestyle",
            "Barbas",
            "Corte a tijera",
            "Colorimetria",
            "Manejo de navaja"
        ],

        horarios: {

            "Marco Avellaneda": {

                lunes: null,
                martes: null,
                miercoles: ["15:00", "20:00"],
                jueves: ["17:00", "20:00"],
                viernes: ["17:00", "20:00"],
                sabado: ["10:00", "20:00"]

            },

            "Santiago Plaul": {

                lunes: null,
                martes: null,
                miercoles: null,
                jueves: null,
                viernes: null,
                sabado: null

            }

        }

    },


    tobi: {

        nombre: "Tobi",

        foto: "../../assets/img/barbers/barberotobi.png",

        rating: "4.0",

        estrellas: "★★★★★",

        experiencia: "2 años",

        descripcion:
            "Buena atención, especialista en charla.",

        especialidades: [
            "Cualquier tipo de Fade",
            "Corte clásico",
            "Especialista en color",
            "Asesoramiento"
        ],

        horarios: {

            "Marco Avellaneda": {

                lunes: null,
                martes: null,
                miercoles: null,
                jueves: ["11:00", "17:00"],
                viernes: ["11:00", "17:00"],
                sabado: null

            },

            "Santiago Plaul": {

                lunes: ["12:00", "20:00"],
                martes: ["10:00", "15:00"],
                miercoles: ["10:00", "15:00"],
                jueves: null,
                viernes: null,
                sabado: null

            }

        },

    },


    ivan: {

        nombre: "Ivan",

        foto: "../../assets/img/barbers/barberoivan.png",

        rating: "4.0",

        estrellas: "★★★★★",

        experiencia: "3 años",

        descripcion:
            "Venis como estas, salis como un rey, tu barbero de confianza esta en escalada",

        especialidades: [
            "Cualquier tipo de Fade",
            "Cortes con tijeras",
            "Cortes Clásicos",
            "Barba"
        ],

        horarios: {

            "Marco Avellaneda": {

                lunes: ["12:00", "20:00"],
                martes: ["16:00", "20:00"],
                miercoles: ["10:00", "16:00"],
                jueves: null,
                viernes: null,
                sabado: ["10:00", "20:00"]

            },

            "Santiago Plaul": {

                lunes: null,
                martes: null,
                miercoles: null,
                jueves: ["10:00", "20:00"],
                viernes: ["10:00", "20:00"],
                sabado: null

            }

        }

    }

};

/*=========================================
            INICIO
=========================================*/

/*=========================================
        INICIAR SISTEMA
=========================================*/

function iniciarSistema(){

    iniciarPaso1();

    iniciarPaso2();

    iniciarPaso3();

    iniciarPaso4();

    iniciarPaso5();

    iniciarPaso6();

    iniciarPaso7();

    iniciarPaso8();

    actualizarResumen();

    actualizarProgreso();

}

/*=========================================
        UTILIDADES
=========================================*/

function seleccionar(selector, elemento){

    document.querySelectorAll(selector)

    .forEach(item=>{

        item.classList.remove("selected");

    });

    elemento.classList.add("selected");

}

function actualizarCampo(id,valor){

    const campo = document.getElementById(id);

    if(campo){

        campo.textContent = valor || "-";

    }

}

/*=========================================
        PASO 1
        SUCURSAL
=========================================*/

function iniciarPaso1(){

    console.log("🔥 INICIANDO PASO 1");

    const opciones = document.querySelector(".options");

    if (!opciones) {

        console.error("❌ No existe .options");

        return;
    }

    console.log(
        "🏪 Sucursales encontradas:",
        opciones.querySelectorAll(".option-card").length
    );

    opciones.addEventListener("click", (e) => {

        const card = e.target.closest(".option-card");

        if (!card) return;

        console.log(
            "✅ CLICK FÍSICO EN SUCURSAL:",
            card.dataset.value
        );

        opciones
            .querySelectorAll(".option-card")
            .forEach(item => {
                item.classList.remove("selected");
            });

        card.classList.add("selected");

        turno.sucursal = card.dataset.value;

        actualizarResumen();

        mostrarPaso(2);

    });

}

/*=========================================
        PASO 2
        FECHA
=========================================*/

function iniciarPaso2(){

/*=========================================
        GENERAR DÍAS DISPONIBLES
=========================================*/

function generarDiasDisponibles(container){

    container.innerHTML = "";


    const hoy =
        obtenerFechaLocal();


    for(let i = 0; i < 4; i++){

        const fecha =
            new Date(hoy);


        fecha.setDate(
            hoy.getDate() + i
        );


        const esDomingo =
            fecha.getDay() === 0;


        const card =
            document.createElement("button");


        card.type = "button";

        card.className =
            "day-card";


        card.dataset.date =
            convertirFechaISO(fecha);


        // =====================================
        // TITULO
        // =====================================

        let titulo;


        if(esDomingo){

            titulo = "Domingo";

        }

        else if(i === 0){

            titulo = "Hoy";

        }

        else if(i === 1){

            titulo = "Mañana";

        }

        else{

            titulo =
                fecha.toLocaleDateString(
                    "es-AR",
                    {
                        weekday: "long"
                    }
                );


            titulo =
                titulo.charAt(0).toUpperCase()
                +
                titulo.slice(1);

        }


        // =====================================
        // FECHA MOSTRADA
        // =====================================

        const fechaTexto =
            fecha.toLocaleDateString(
                "es-AR",
                {
                    day: "2-digit",
                    month: "2-digit"
                }
            );


        card.innerHTML = `

            <strong>
                ${titulo}
            </strong>

            <small>
                ${
                    esDomingo
                        ? "Cerrado"
                        : i < 2
                            ? "Disponible"
                            : fechaTexto
                }
            </small>

        `;


        // =====================================
        // DOMINGO BLOQUEADO
        // =====================================

        if(esDomingo){

            card.disabled = true;

            card.classList.add(
                "disabled"
            );

        }


        // =====================================
        // CLICK
        // =====================================

        card.addEventListener(
            "click",
            () => {

                if(esDomingo){

                    return;

                }


                seleccionar(
                    ".day-card",
                    card
                );


                turno.fechaISO =
                    card.dataset.date;


                const fechaSeleccionada =
                    crearFechaDesdeISO(
                        turno.fechaISO
                    );


                turno.fecha =
                    fechaSeleccionada
                        .toLocaleDateString(
                            "es-AR",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long"
                            }
                        );


                if(turno.horario){

                    turno.fechaHora =
                        crearFechaHora(
                            turno.fechaISO,
                            turno.horario
                        );

                }


                console.log(
                    "📅 Fecha seleccionada:",
                    {
                        texto: turno.fecha,
                        iso: turno.fechaISO
                    }
                );


                actualizarResumen();

                mostrarPromociones();

                mostrarPaso(3);

            }
        );


        container.appendChild(
            card
        );

    }


    // =====================================
    // BOTÓN CALENDARIO
    // =====================================

    const botonCalendario =
        document.createElement("button");


    botonCalendario.type =
        "button";

    botonCalendario.className =
        "day-card calendar";


    botonCalendario.innerHTML = `

        <i class="fa-regular fa-calendar"></i>

        Elegir otra fecha

    `;


    container.appendChild(
        botonCalendario
    );

}
    const container =
        document.getElementById("daysContainer");

    const calendario =
        document.getElementById("fechaCalendario");


    if(!container){

        console.error(
            "❌ No existe #daysContainer"
        );

        return;
    }


    if(!calendario){

        console.error(
            "❌ No existe #fechaCalendario"
        );

        return;
    }


    // =====================================
    // GENERAR FECHAS
    // =====================================

    generarDiasDisponibles(container);


    // =====================================
    // CONFIGURAR CALENDARIO
    // =====================================

    const hoy =
        obtenerFechaLocal();


    const fechaMin =
        convertirFechaISO(hoy);


    const fechaMax =
        new Date(hoy);

    fechaMax.setDate(
        fechaMax.getDate() + 14
    );


    calendario.min =
        fechaMin;

    calendario.max =
        convertirFechaISO(fechaMax);


    // =====================================
    // ABRIR CALENDARIO
    // =====================================

    const botonCalendario =
        container.querySelector(".calendar");


    if(botonCalendario){

        botonCalendario.addEventListener(
            "click",
            () => {

                calendario.showPicker();

            }
        );

    }


    // =====================================
    // FECHA ELEGIDA DESDE CALENDARIO
    // =====================================

    calendario.addEventListener(
    "change",
    () => {

        if(!calendario.value){

            return;

        }


        const fecha =
            crearFechaDesdeISO(
                calendario.value
            );


        if(!fecha){

            console.error(
                "❌ Fecha de calendario inválida"
            );

            calendario.value = "";

            return;

        }


        // =====================================
        // DOMINGO = CERRADO
        // =====================================

        if(
            fecha.getDay() === 0
        ){

            console.log(
                "🚫 Domingo cerrado"
            );

            calendario.value = "";

            return;

        }


        // =====================================
        // GUARDAR FECHA
        // =====================================

        turno.fechaISO =
            calendario.value;


        turno.fecha =
            fecha.toLocaleDateString(
                "es-AR",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );


        // =====================================
        // RECONSTRUIR FECHA + HORARIO
        // =====================================

        if(turno.horario){

            turno.fechaHora =
                crearFechaHora(
                    turno.fechaISO,
                    turno.horario
                );

        }


        console.log(
            "📅 Fecha elegida desde calendario:",
            {
                texto: turno.fecha,
                iso: turno.fechaISO
            }
        );


        actualizarResumen();

        mostrarPromociones();

        mostrarPaso(3);

    }
);

}

/*=========================================
        FECHAS
=========================================*/

function obtenerFechaLocal(){

    const fecha =
        new Date();

    fecha.setHours(
        0,
        0,
        0,
        0
    );

    return fecha;

}


function convertirFechaISO(fecha){

    const año =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");


    return `${año}-${mes}-${dia}`;

}


function crearFechaDesdeISO(fechaISO){

    if(!fechaISO){

        return null;

    }


    const [
        año,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const fecha =
        new Date(
            año,
            mes - 1,
            dia
        );


    fecha.setHours(
        0,
        0,
        0,
        0
    );


    return fecha;

}

/*=========================================
        CREAR FECHA + HORA
=========================================*/

function crearFechaHora(
    fechaISO,
    horario
){

    if(
        !fechaISO ||
        !horario
    ){

        return null;

    }


    const [
        hora,
        minutos
    ] =
        horario.split(":");


    const fecha =
        new Date(
            `${fechaISO}T${hora}:${minutos}:00`
        );


    return fecha;

}

/*=========================================
        PASO 3
        PROMOCIONES + SERVICIOS
=========================================*/

function iniciarPaso3(){

    console.log("🔥 INICIANDO PASO 3");

    const servicios =
        document.querySelectorAll(".service-card");

    servicios.forEach(card => {

        card.addEventListener("click", () => {

            seleccionar(
                ".service-card",
                card
            );

            // Si eligió un servicio normal,
            // quitamos cualquier promoción anterior

            document
                .querySelectorAll(".promo-card")
                .forEach(item => {

                    item.classList.remove("selected");

                });

            turno.servicio =
                card.dataset.service;

            turno.precio =
                Number(card.dataset.price);

            turno.promocion = "";

            // =====================================
            // SERVICIO DE COLOR
            // =====================================

            if (esServicioColor()) {

                turno.barbero =
                    "Barbero disponible";

                console.log(
                    "🎨 Servicio de color seleccionado"
                );

            } else {

                turno.barbero = "";

            }

            actualizarResumen();

            mostrarPaso(4);

        });

    });

}


/*=========================================
        MOSTRAR PROMOCIONES
=========================================*/

function mostrarPromociones(){

    console.log("🎁 Mostrando promociones");

    const container =
        document.querySelector(
            "#promocionesContainer"
        );

    if(!container){

        console.error(
            "❌ No existe #promocionesContainer"
        );

        return;
    }

    container.innerHTML = "";


    // =====================================
    // SI NO HAY FECHA
    // =====================================

    if(!turno.fechaISO){

        console.warn(
            "⚠️ No hay fecha seleccionada"
        );

        return;
    }


    // =====================================
    // OBTENER DÍA DE LA SEMANA
    // =====================================

    const fecha =
        new Date(
            `${turno.fechaISO}T00:00:00`
        );


    const diasSemana = [

        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"

    ];


    const diaSemana =
        diasSemana[
            fecha.getDay()
        ];


    console.log(
        "📅 Día para promociones:",
        diaSemana
    );


    // =====================================
    // FILTRAR PROMOCIONES
    // =====================================

    const promocionesDelDia =
        promocionesDisponibles.filter(
            promo => {

                if(promo.activo === false){

                    return false;

                }

                if(!promo.dias){

                    return false;

                }

                return promo.dias.includes(
                    diaSemana
                );

            }
        );


    console.log(
        "🎁 Promociones del día:",
        promocionesDelDia
    );


    // =====================================
    // SI NO HAY PROMOS
    // =====================================

    if(
        promocionesDelDia.length === 0
    ){

        return;

    }


    // =====================================
    // TÍTULO
    // =====================================

    const titulo =
        document.createElement("div");

    titulo.className =
        "promociones-title";

    titulo.innerHTML = `

        <h3>
            🔥 Promociones del día
        </h3>

        <p>
            Aprovechá estos precios especiales.
        </p>

    `;

    container.appendChild(titulo);


    // =====================================
    // CREAR TARJETAS
    // =====================================

    promocionesDelDia.forEach(
        promo => {

            const card =
                document.createElement("div");


            card.className =
                "promo-card";


            card.dataset.tipo =
                promo.tipo;


            card.dataset.nombre =
                promo.nombre;


            card.dataset.precio =
                promo.precio;


            card.innerHTML = `

                <div class="promo-info">

                    <span class="promo-badge">
                        PROMO
                    </span>

                    <h3>
                        ${promo.nombre}
                    </h3>

                    <small>
                        ${obtenerDescripcionPromo(promo)}
                    </small>

                </div>

                <strong>
                    $${Number(
                        promo.precio
                    ).toLocaleString("es-AR")}
                </strong>

            `;


            // =================================
            // CLICK PROMOCIÓN
            // =================================

            card.addEventListener(
                "click",
                () => {

                    // Quitar selección
                    // de otras promociones

                    document
                        .querySelectorAll(
                            ".promo-card"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );

                        });


                    // Quitar selección
                    // de servicios normales

                    document
                        .querySelectorAll(
                            ".service-card"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );

                        });


                    card.classList.add(
                        "selected"
                    );


                    turno.servicio =
                        promo.nombre;


                    turno.precio =
                        Number(
                            promo.precio
                        );


                    turno.promocion =
                        promo.tipo;


                    turno.barbero = "";


                    console.log(
                        "🎁 Promoción seleccionada:",
                        promo
                    );


                    actualizarResumen();

                    mostrarPaso(4);

                }
            );


            container.appendChild(card);

        }
    );

}


/*=========================================
        DESCRIPCIÓN PROMOCIÓN
=========================================*/

function obtenerDescripcionPromo(promo){

    switch(promo.tipo){

        case "jubilados":

            return "Corte para jubilados";

        case "corte_lunes":

            return "Corte • 35 minutos";

        case "corte_barba_lunes":

            return "Corte + Barba • 60 minutos";

        case "dos_personas":

            return "2 personas juntas";

        case "padre_hijo":

            return "2 cortes • Padre e hijo";

        case "membresia":

            return "4 cortes durante el mes";

        default:

            return "Promoción especial";

    }

}

/*=========================================
        PASO 4
        BARBEROS
=========================================*/

function iniciarPaso4(){

    const contenedor =
        document.querySelector(".barbers");

    const modal =
        document.getElementById("barberModal");

    const cerrar =
        document.querySelector(".close-modal");


    if(!contenedor){

        console.error(
            "❌ No existe .barbers"
        );

        return;
    }


    /*=========================================
            SERVICIO DE COLOR
    =========================================*/

    if(esServicioColor()){

        console.log(
            "🎨 Servicio de color - barbero disponible"
        );

        turno.barbero =
            "Barbero disponible";


        contenedor.innerHTML = `

            <div class="barber-available">

                <div class="barber-available-icon">
                    💈
                </div>

                <h3>
                    Barbero disponible
                </h3>

                <p>
                    Este servicio será realizado
                    por un profesional disponible
                    en la sucursal.
                </p>

            </div>

        `;


        actualizarResumen();

        return;

    }


    /*=========================================
            COMPROBAR FECHA
    =========================================*/

    if(!turno.fechaISO){

        return;

    }


    /*=========================================
            OBTENER DÍA
    =========================================*/

    const fecha =
        new Date(
            turno.fechaISO + "T00:00:00"
        );


    const diasSemana = [

        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"

    ];


    const dia =
        diasSemana[
            fecha.getDay()
        ];


    console.log(
        "📅 Día para mostrar barberos:",
        dia
    );


    console.log(
        "🏪 Sucursal:",
        turno.sucursal
    );


    /*=========================================
            RECORRER TARJETAS
    =========================================*/

    const tarjetas =
        contenedor.querySelectorAll(
            ".barber-card"
        );


    tarjetas.forEach(card => {

        const idBarbero =
            card.dataset.barber;


        const barbero =
            barberos[idBarbero];


        if(!barbero){

            console.error(
                "❌ No existe el barbero:",
                idBarbero
            );

            return;

        }


        /*=====================================
                BUSCAR HORARIO
        =====================================*/

        const horariosSucursal =
            barbero.horarios?.[
                turno.sucursal
            ];


        const horarioDia =
            horariosSucursal?.[
                dia
            ];


        /*=====================================
                ELEMENTO ESTADO
        =====================================*/

        const estado =
            card.querySelector("small");


        /*=====================================
                NO TRABAJA
        =====================================*/

        if(!horarioDia){

            console.log(
                "🔴 No trabaja:",
                barbero.nombre
            );


            card.classList.add(
                "barber-unavailable"
            );


            if(estado){

                estado.textContent =
                    "No trabaja este día";

            }


            // Evitamos que pueda seleccionarlo
            card.style.pointerEvents =
                "none";


            card.style.opacity =
                "0.55";


            return;

        }


        /*=====================================
                DISPONIBLE
        =====================================*/

        console.log(
            "🟢 Disponible:",
            barbero.nombre,
            horarioDia
        );


        card.classList.remove(
            "barber-unavailable"
        );


        card.style.pointerEvents =
            "auto";


        card.style.opacity =
            "1";


        if(estado){

            estado.textContent =
                "Disponible";

        }


        /*=====================================
                CLICK EN BARBERO
        =====================================*/

        card.onclick = () => {

            console.log(
                "💈 BARBERO SELECCIONADO PARA VER:",
                idBarbero
            );


            abrirModalBarbero(
                idBarbero
            );

        };

    });


    /*=========================================
            CERRAR MODAL
    =========================================*/

    if(cerrar){

        cerrar.onclick = () => {

            modal.classList.add(
                "hidden"
            );

        };

    }


    if(modal){

        modal.onclick = (e) => {

            if(e.target === modal){

                modal.classList.add(
                    "hidden"
                );

            }

        };

    }

}

/*=========================================
        PASO 5
        HORARIOS
=========================================*/

/*=========================================
        PASO 5
        HORARIOS
=========================================*/

/*=========================================
        PASO 5
        HORARIOS
=========================================*/

function iniciarPaso5(){

    const contenedor =
        document.querySelector(".hours");

    if(!contenedor){

        console.error(
            "❌ No existe .hours"
        );

        return;
    }


    // Limpiar horarios anteriores
    contenedor.innerHTML = "";


    /*=========================================
            SERVICIOS DE COLOR
    =========================================*/

    if(esServicioColor()){

        console.log(
            "🎨 Servicio de color - horarios 10 a 16"
        );

        generarHorarios(
            contenedor,
            "10:00",
            "16:00"
        );

        return;
    }


    /*=========================================
            SERVICIO NORMAL
    =========================================*/

    if(!turno.fechaISO){

        return;
    }


    if(!turno.barbero){

        return;
    }


    /*=========================================
            BUSCAR BARBERO
    =========================================*/

    const idBarbero =
        Object.keys(barberos).find(
            id =>
                barberos[id].nombre ===
                turno.barbero
        );


    if(!idBarbero){

        console.error(
            "❌ No se encontró el barbero:",
            turno.barbero
        );

        return;
    }


    const barbero =
        barberos[idBarbero];


    /*=========================================
            OBTENER DÍA
    =========================================*/

    const fecha =
        new Date(
            turno.fechaISO + "T00:00:00"
        );


    const diasSemana = [

        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"

    ];


    const dia =
        diasSemana[
            fecha.getDay()
        ];


    console.log(
        "📅 Día seleccionado:",
        dia
    );


    /*=========================================
            HORARIO DEL BARBERO
    =========================================*/

    const horariosSucursal =
        barbero.horarios?.[
            turno.sucursal
        ];


    if(!horariosSucursal){

        console.error(
            "❌ No hay horarios para esta sucursal"
        );

        return;
    }


    const horarioDia =
        horariosSucursal[dia];


    if(!horarioDia){

        console.error(
            "❌ El barbero no trabaja este día"
        );

        return;
    }


    const horaInicio =
        horarioDia[0];

    const horaFin =
        horarioDia[1];


    console.log(
        "🕐 Horario del barbero:",
        horaInicio,
        horaFin
    );


    /*=========================================
            GENERAR HORARIOS
            TURNOS DE 1 HORA
    =========================================*/

    generarHorarios(
        contenedor,
        horaInicio,
        horaFin
    );

}

/*=========================================
        GENERAR HORARIOS
=========================================*/

async function generarHorarios(
    contenedor,
    horaInicio,
    horaFin
){

    if(!horaInicio || !horaFin){

        console.error(
            "❌ Horario inválido:",
            horaInicio,
            horaFin
        );

        return;
    }


    const [horaInicial] =
        horaInicio
            .split(":")
            .map(Number);


    const [horaFinal] =
        horaFin
            .split(":")
            .map(Number);


    contenedor.innerHTML = "";


    /*=========================================
        OBTENER TURNOS YA RESERVADOS
    =========================================*/

    let turnosOcupados = [];

    try {

        turnosOcupados =
            await obtenerTurnosDisponibles(
                turno.fechaISO,
                turno.sucursal
            );

        console.log(
            "📋 Turnos encontrados:",
            turnosOcupados
        );

    } catch(error){

        console.error(
            "❌ Error obteniendo turnos:",
            error
        );

        contenedor.innerHTML = `
            <p>
                No se pudieron cargar
                los horarios disponibles.
            </p>
        `;

        return;
    }


    /*=========================================
        CREAR HORARIOS DE 1 HORA
    =========================================*/

    for(
        let hora = horaInicial;
        hora < horaFinal;
        hora++
    ){

        const horario =
            `${String(hora).padStart(2,"0")}:00`;


        const boton =
            document.createElement(
                "button"
            );


        boton.type = "button";


        boton.dataset.hour =
            horario;


        /*=========================================
            COMPROBAR SI ESTÁ OCUPADO
        =========================================*/

        const ocupado =
            turnosOcupados.some(turnoExistente => {

                // El horario debe coincidir
                if(
                    turnoExistente.horario !==
                    horario
                ){

                    return false;
                }


                // =================================
                // SERVICIO DE COLOR
                // =================================

                if(esServicioColor()){

                    return (
                        turnoExistente.barbero ===
                        "Barbero disponible"
                    );

                }


                // =================================
                // SERVICIO NORMAL
                // =================================

                return (
                    turnoExistente.barbero ===
                    turno.barbero
                );

            });


        /*=========================================
            HORARIO OCUPADO
        =========================================*/

        if(ocupado){

            boton.classList.add(
                "occupied"
            );

            boton.textContent =
                `${horario} - OCUPADO`;

            boton.disabled = true;

            boton.title =
                "Este horario ya está reservado.";

        }


        /*=========================================
            HORARIO DISPONIBLE
        =========================================*/

        else{

            boton.textContent =
                horario;


            boton.addEventListener(
                "click",
                () => {

                    seleccionar(
                        ".hours button",
                        boton
                    );


                    turno.horario =
                        boton.dataset.hour;


                    turno.fechaHora =
                        crearFechaHora(
                            turno.fechaISO,
                            turno.horario
                        );


                    console.log(
                        "🕐 Horario seleccionado:",
                        {
                            horario:
                                turno.horario,

                            fechaHora:
                                turno.fechaHora
                        }
                    );


                    actualizarResumen();


                    mostrarPaso(6);

                }
            );

        }


        contenedor.appendChild(
            boton
        );

    }

}
/*=========================================
        ABRIR MODAL
=========================================*/

function abrirModalBarbero(id){

    const b = barberos[id];

    document.getElementById("modalPhoto").src = b.foto;

    document.getElementById("modalName").textContent = b.nombre;

    document.querySelector(".modal-stars").textContent = b.estrellas;

    document.getElementById("modalRating").textContent =

    "⭐ " + b.rating;

    document.getElementById("modalExperience").textContent =

    b.experiencia;

    document.getElementById("modalDescription").textContent =

    b.descripcion;

    const lista = document.getElementById("modalSkills");

    lista.innerHTML = "";

    b.especialidades.forEach(item=>{

        const li = document.createElement("li");

        li.textContent = item;

        lista.appendChild(li);

    });

    document.getElementById("barberModal")

    .classList.remove("hidden");

    document.getElementById("chooseBarber").onclick = ()=>{

        elegirBarbero(id);

    };

}

/*=========================================
        ELEGIR BARBERO
=========================================*/

function elegirBarbero(id){

    document.querySelectorAll(".barber-card")

    .forEach(card=>{

        card.classList.remove("selected");

    });

    const tarjeta = document.querySelector(

        `.barber-card[data-barber="${id}"]`

    );

    if(tarjeta){

        tarjeta.classList.add("selected");

    }

   turno.barbero = barberos[id].nombre;

actualizarResumen();

document.getElementById("barberModal")
.classList.add("hidden");

mostrarPaso(5);

}



/*=========================================
        PASO 6
        MEDIO DE PAGO
=========================================*/

let comprobantePagoFile = null;


function iniciarPaso6(){

    const pagos =
        document.querySelectorAll(".payment-card");

    const detalles =
        document.getElementById("payment-details");

    const continuar =
        document.getElementById("payment-continue");

    const alias =
        document.getElementById("payment-alias");

    const copiarAlias =
        document.getElementById("copy-alias");


    /*=========================================
            INPUT TRANSFERENCIA
    =========================================*/

    const archivoTransferencia =
        document.getElementById(
            "receipt-file-transferencia"
        );

    const previewTransferencia =
        document.getElementById(
            "receipt-preview-transferencia"
        );


    /*=========================================
            INPUT QR
    =========================================*/

    const archivoQR =
        document.getElementById(
            "receipt-file-qr"
        );

    const previewQR =
        document.getElementById(
            "receipt-preview-qr"
        );


    /*=========================================
            ACTUALIZAR BOTÓN CONTINUAR
    =========================================*/

    function actualizarEstadoContinuar(){

        if(!continuar){

            return;

        }


        /*
            QR REQUIERE COMPROBANTE
        */

        if(
            turno.pago &&
            turno.pago.metodo === "qr"
        ){

            continuar.disabled =
                !comprobantePagoFile;

            return;

        }


        /*
            EFECTIVO Y TRANSFERENCIA
            NO REQUIEREN COMPROBANTE
        */

        continuar.disabled = false;

    }


    /*=========================================
            LIMPIAR COMPROBANTE
    =========================================*/

    function limpiarComprobante(){

        comprobantePagoFile = null;


        if(archivoTransferencia){

            archivoTransferencia.value = "";

        }


        if(archivoQR){

            archivoQR.value = "";

        }


        if(previewTransferencia){

            previewTransferencia.innerHTML = "";

            previewTransferencia.classList.add(
                "hidden"
            );

        }


        if(previewQR){

            previewQR.innerHTML = "";

            previewQR.classList.add(
                "hidden"
            );

        }

    }


    /*=========================================
            SELECCIONAR MEDIO DE PAGO
    =========================================*/

    pagos.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                /* Crédito bloqueado */

                if(card.disabled){

                    return;

                }


                const metodo =
                    card.dataset.payment;


                console.log(
                    "💳 MEDIO DE PAGO:",
                    metodo
                );


                /*=================================
                    LIMPIAR COMPROBANTE ANTERIOR
                =================================*/

                limpiarComprobante();


                /*=================================
                    SELECCIONAR TARJETA
                =================================*/

                seleccionar(
                    ".payment-card",
                    card
                );


                /*=================================
                    OCULTAR DETALLES
                =================================*/

                document
                    .querySelectorAll(".payment-info")
                    .forEach(info => {

                        info.classList.add(
                            "hidden"
                        );

                    });


                /*=================================
                    MOSTRAR CONTENEDOR
                =================================*/

                if(detalles){

                    detalles.classList.remove(
                        "hidden"
                    );

                }


                /*=================================
                    MOSTRAR DETALLE
                =================================*/

                const detalle =
                    document.getElementById(
                        `payment-${metodo}`
                    );


                if(detalle){

                    detalle.classList.remove(
                        "hidden"
                    );

                }


                /*=================================
                    MOSTRAR CONTINUAR
                =================================*/

                if(continuar){

                    continuar.classList.remove(
                        "hidden"
                    );

                }


                /*=================================
                    GUARDAR PAGO
                =================================*/

                turno.pago = {

                    metodo: metodo,

                    estado: "pendiente",

                    comprobanteUrl: "",

                    fechaPago: null

                };


                console.log(
                    "💰 PAGO SELECCIONADO:",
                    turno.pago
                );


                /*=================================
                    ESTADO DEL BOTÓN
                =================================*/

                actualizarEstadoContinuar();

            }
        );

    });


    /*=========================================
            COPIAR ALIAS
    =========================================*/

    if(copiarAlias){

        copiarAlias.addEventListener(
            "click",
            async () => {

                try{

                    await navigator.clipboard.writeText(
                        alias.textContent.trim()
                    );


                    copiarAlias.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Copiado
                    `;


                    copiarAlias.classList.add(
                        "copied"
                    );


                    setTimeout(() => {

                        copiarAlias.innerHTML = `
                            <i class="fa-regular fa-copy"></i>
                            Copiar
                        `;

                        copiarAlias.classList.remove(
                            "copied"
                        );

                    },2000);


                }catch(error){

                    console.error(
                        "❌ Error copiando alias:",
                        error
                    );

                }

            }
        );

    }


    /*=========================================
            PROCESAR COMPROBANTE
    =========================================*/

    function procesarComprobante(
        archivo,
        preview
    ){

        if(!archivo){

            return;

        }


        archivo.addEventListener(
            "change",
            () => {

                const file =
                    archivo.files[0];


                /*=============================
                    NO HAY ARCHIVO
                =============================*/

                if(!file){

                    comprobantePagoFile =
                        null;


                    if(preview){

                        preview.innerHTML =
                            "";

                        preview.classList.add(
                            "hidden"
                        );

                    }


                    actualizarEstadoContinuar();

                    return;

                }


                /*=============================
                    VALIDAR IMAGEN
                =============================*/

                if(
                    !file.type.startsWith(
                        "image/"
                    )
                ){

                    alert(
                        "Por favor seleccioná una imagen."
                    );

                    archivo.value = "";

                    comprobantePagoFile =
                        null;

                    actualizarEstadoContinuar();

                    return;

                }


                /*=============================
                    VALIDAR TAMAÑO
                =============================*/

                const maxSize =
                    5 * 1024 * 1024;


                if(file.size > maxSize){

                    alert(
                        "La imagen no puede superar los 5 MB."
                    );

                    archivo.value = "";

                    comprobantePagoFile =
                        null;

                    actualizarEstadoContinuar();

                    return;

                }


                /*=============================
                    GUARDAR ARCHIVO
                =============================*/

                comprobantePagoFile =
                    file;


                console.log(
                    "📸 COMPROBANTE:",
                    file.name
                );


                /*=============================
                    PREVIEW
                =============================*/

                const reader =
                    new FileReader();


                reader.onload =
                    event => {

                        if(!preview){

                            return;

                        }


                        preview.innerHTML = `

                            <img
                                src="${event.target.result}"
                                alt="Vista previa del comprobante">

                        `;


                        preview.classList.remove(
                            "hidden"
                        );

                    };


                reader.readAsDataURL(
                    file
                );


                /*=============================
                    ACTUALIZAR BOTÓN
                =============================*/

                actualizarEstadoContinuar();

            }
        );

    }


    /*=========================================
        ACTIVAR COMPROBANTE TRANSFERENCIA
    =========================================*/

    procesarComprobante(
        archivoTransferencia,
        previewTransferencia
    );


    /*=========================================
        ACTIVAR COMPROBANTE QR
    =========================================*/

    procesarComprobante(
        archivoQR,
        previewQR
    );


    /*=========================================
            CONTINUAR
    =========================================*/

    if(continuar){

        continuar.addEventListener(
            "click",
            () => {

                /*=============================
                    SIN MÉTODO
                =============================*/

                if(!turno.pago){

                    alert(
                        "Seleccioná un medio de pago."
                    );

                    return;

                }


                /*=============================
                    QR REQUIERE COMPROBANTE
                =============================*/

                if(
                    turno.pago.metodo === "qr" &&
                    !comprobantePagoFile
                ){

                    alert(
                        "Tenés que cargar el comprobante del pago."
                    );

                    return;

                }


                /*=============================
                    CONTINUAR
                =============================*/

                console.log(
                    "➡️ CONTINUAR CON PAGO:",
                    turno.pago
                );


                actualizarResumen();

                mostrarPaso(7);

            }
        );

    }

}

/*=========================================
        PASO 7
        DATOS DEL CLIENTE
=========================================*/

function iniciarPaso7(){

    const nombre =
        document.getElementById("nombre");

    const apellido =
        document.getElementById("apellido");

    const telefono =
        document.getElementById("telefono");

    const correo =
        document.getElementById("correo");

    const botonPaso7 =
        document.getElementById("nextStep7");


    function actualizarDatosCliente(){

        turno.cliente.nombre =
            nombre.value.trim();

        turno.cliente.apellido =
            apellido.value.trim();

        turno.cliente.telefono =
            telefono.value.trim();

        turno.cliente.correo =
            correo.value.trim();


        actualizarResumen();


        // =====================================
        // VALIDAR WHATSAPP
        // =====================================

        const telefonoValido =
            turno.cliente.telefono
                .replace(/\D/g, "")
                .length >= 10;


        // =====================================
        // DATOS OBLIGATORIOS
        // =====================================

        const completo =
            turno.cliente.nombre !== "" &&
            turno.cliente.apellido !== "" &&
            telefonoValido;


        if(botonPaso7){

            botonPaso7.disabled =
                !completo;

        }

    }


    const campos = [
        nombre,
        apellido,
        telefono,
        correo
    ];


    campos.forEach(campo => {

        if(campo){

            campo.addEventListener(
                "input",
                actualizarDatosCliente
            );

        }

    });


    // Comprobar inmediatamente
    // los datos que Firebase ya cargó

    actualizarDatosCliente();


    if(botonPaso7){

        botonPaso7.addEventListener(
            "click",
            () => {

                actualizarDatosCliente();

                mostrarPaso(8);

            }
        );

    }

}

/*=========================================
        PASO 8
        OBSERVACIONES
=========================================*/

function iniciarPaso8(){

    const observaciones =

    document.getElementById("observaciones");

    observaciones.addEventListener("input",()=>{

        turno.observaciones = observaciones.value;

    });

    document.getElementById("nextStep8").addEventListener("click",()=>{

    turno.observaciones = observaciones.value;

    actualizarResumen();

    mostrarPaso(9);

});

}

/*=========================================
        MOSTRAR PASOS
=========================================*/

function mostrarPaso(numero){

    pasoActual = numero;

    document.querySelectorAll(".step")
    .forEach(step => {
        step.classList.add("hidden");
    });

    const paso = document.getElementById(
        "step" + numero
    );

    if(paso){
        paso.classList.remove("hidden");
    }

    // =========================================
    // ACTUALIZAR PASO 5 SEGÚN EL SERVICIO
    // =========================================

if(numero === 4){

    iniciarPaso4();

}

if(numero === 5){

    iniciarPaso5();

}

}
 

/*=========================================
        BARRA DE PROGRESO
=========================================*/

function actualizarProgreso(){

    const porcentaje =

    (pasoActual / TOTAL_PASOS) * 100;

    document.getElementById(

        "progressFill"

    ).style.width = porcentaje+"%";

    document.getElementById(

        "stepNumber"

    ).textContent = pasoActual;

}

/*=========================================
        RESUMEN
=========================================*/

function actualizarResumen(){

    actualizarCampo(

        "rSucursal",

        turno.sucursal

    );

    actualizarCampo(

        "rServicio",

        turno.servicio

    );

    actualizarCampo(

        "rFecha",

        turno.fecha

    );

    actualizarCampo(

        "rHorario",

        turno.horario

    );

    actualizarCampo(

        "rBarbero",

        turno.barbero

    );

    let medioPago = "-";

if(turno.pago){

    const nombresPago = {

        efectivo: "Efectivo",

        transferencia: "Transferencia bancaria",

        qr: "Pago con QR"

    };

    medioPago =
        nombresPago[turno.pago.metodo]
        || turno.pago.metodo
        || "-";

}

actualizarCampo(
    "rPago",
    medioPago
);

    actualizarCampo(

        "rCliente",

        turno.cliente.nombre +

        " " +

        turno.cliente.apellido

    );

    actualizarCampo(

    "rObservaciones",

    turno.observaciones

);

    actualizarCampo(

        "rTotal",

        "$"+

        turno.precio.toLocaleString(

            "es-AR"

        )

    );

}

/*=========================================
        GENERAR PDF DEL TURNO
=========================================*/

async function generarComprobanteTurno(codigo){

    console.log(
        "🧾 Generando comprobante PDF..."
    );


    // =====================================
    // COMPROBAR jsPDF
    // =====================================

    if(!window.jspdf){

        throw new Error(
            "jsPDF no está cargado."
        );

    }


    const { jsPDF } =
        window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    // =====================================
    // COLORES BEAST
    // =====================================

    const negro = [
        10,
        10,
        10
    ];

    const dorado = [
        212,
        175,
        55
    ];

    const blanco = [
        255,
        255,
        255
    ];

    const gris = [
        160,
        160,
        160
    ];


    // =====================================
    // FONDO
    // =====================================

    pdf.setFillColor(
        ...negro
    );

    pdf.rect(
        0,
        0,
        210,
        297,
        "F"
    );


    // =====================================
    // BORDE DORADO
    // =====================================

    pdf.setDrawColor(
        ...dorado
    );

    pdf.setLineWidth(
        0.6
    );

    pdf.rect(
        12,
        12,
        186,
        273
    );


    // =====================================
    // ENCABEZADO
    // =====================================

    
// =====================================
// ENCABEZADO DE LA BARBERÍA
// =====================================

pdf.setTextColor(
    ...dorado
);

pdf.setFont(
    "helvetica",
    "bold"
);

pdf.setFontSize(
    25
);

pdf.text(
    "BEAST BARBERSHOPS",
    105,
    35,
    {
        align: "center"
    }
);


pdf.setTextColor(
    ...blanco
);

pdf.setFontSize(
    13
);

pdf.text(
    "COMPROBANTE DE TURNO",
    105,
    44,
    {
        align: "center"
    }
);
   

    // =====================================
    // LÍNEA
    // =====================================

    pdf.setDrawColor(
        ...dorado
    );

    pdf.line(
        30,
        51,
        180,
        51
    );


    // =====================================
    // CÓDIGO
    // =====================================

    pdf.setTextColor(
        ...gris
    );

    pdf.setFontSize(
        10
    );

    pdf.text(
        "CÓDIGO DE RESERVA",
        105,
        62,
        {
            align: "center"
        }
    );


    pdf.setTextColor(
        ...dorado
    );

    pdf.setFontSize(
        19
    );

    pdf.text(
        codigo,
        105,
        72,
        {
            align: "center"
        }
    );


    // =====================================
    // DATOS DEL CLIENTE
    // =====================================

    let y = 90;


    function tituloSeccion(texto){

        pdf.setTextColor(
            ...dorado
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(
            11
        );

        pdf.text(
            texto,
            28,
            y
        );

        y += 8;

    }


    function dato(label, valor){

        pdf.setTextColor(
            ...gris
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(
            10
        );

        pdf.text(
            label,
            30,
            y
        );


        pdf.setTextColor(
            ...blanco
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.text(
            String(
                valor || "-"
            ),
            90,
            y
        );

        y += 7;

    }


    tituloSeccion(
        "CLIENTE"
    );


    dato(
        "Nombre",
        `${turno.cliente.nombre} ${turno.cliente.apellido}`
    );


    dato(
        "WhatsApp",
        turno.cliente.telefono
    );


    if(turno.cliente.correo){

        dato(
            "Correo",
            turno.cliente.correo
        );

    }


    y += 5;


    // =====================================
    // DATOS DEL TURNO
    // =====================================

    tituloSeccion(
        "DATOS DEL TURNO"
    );


    dato(
        "Sucursal",
        turno.sucursal
    );


    dato(
        "Servicio",
        turno.servicio
    );


    dato(
        "Barbero",
        turno.barbero
    );


    dato(
        "Fecha",
        turno.fecha
    );


    dato(
        "Horario",
        turno.horario
    );


    // =====================================
    // PAGO
    // =====================================

    y += 5;


    tituloSeccion(
        "PAGO"
    );


    let medioPago = "-";


    if(turno.pago){

        const nombresPago = {

            efectivo:
                "Efectivo",

            transferencia:
                "Transferencia bancaria",

            qr:
                "Pago con QR"

        };


        medioPago =
            nombresPago[
                turno.pago.metodo
            ]
            ||
            turno.pago.metodo
            ||
            "-";

    }


    dato(
        "Medio de pago",
        medioPago
    );


    // =====================================
    // TOTAL
    // =====================================

    y += 8;


    pdf.setFillColor(
        25,
        25,
        25
    );


    pdf.roundedRect(
        25,
        y,
        160,
        24,
        3,
        3,
        "F"
    );


    pdf.setTextColor(
        ...blanco
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        12
    );

    pdf.text(
        "TOTAL",
        35,
        y + 15
    );


    pdf.setTextColor(
        ...dorado
    );

    pdf.setFontSize(
        19
    );


    pdf.text(
        "$" +
        Number(
            turno.precio || 0
        ).toLocaleString(
            "es-AR"
        ),
        175,
        y + 15,
        {
            align: "right"
        }
    );


    // =====================================
    // OBSERVACIONES
    // =====================================

    if(
        turno.observaciones
    ){

        y += 35;


        tituloSeccion(
            "OBSERVACIONES"
        );


        pdf.setTextColor(
            ...blanco
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(
            10
        );


        const texto =
            pdf.splitTextToSize(
                turno.observaciones,
                150
            );


        pdf.text(
            texto,
            30,
            y
        );

    }

// =====================================
// PIE DEL COMPROBANTE
// =====================================

pdf.setTextColor(
    ...gris
);

pdf.setFontSize(
    9
);

pdf.text(
    "Gracias por elegir Beast Barbershops",
    105,
    260,
    {
        align: "center"
    }
);


pdf.setTextColor(
    ...dorado
);

pdf.setFont(
    "helvetica",
    "bold"
);

pdf.setFontSize(
    8
);

pdf.text(
    "Beast Managers",
    105,
    269,
    {
        align: "center"
    }
);


pdf.setTextColor(
    ...gris
);

pdf.setFont(
    "helvetica",
    "normal"
);

pdf.setFontSize(
    7
);

pdf.text(
    "Tu sistema de gestión",
    105,
    275,
    {
        align: "center"
    }
);

    // =====================================
    // GENERAR BLOB
    // =====================================

    const blob =
        pdf.output(
            "blob"
        );


    console.log(
        "✅ PDF generado:",
        blob
    );


    // =====================================
    // DESCARGA DE PRUEBA
    // =====================================

    const url =
        URL.createObjectURL(
            blob
        );


    const enlace =
        document.createElement(
            "a"
        );


    enlace.href =
        url;

    enlace.download =
        `Beast-${codigo}.pdf`;


    enlace.click();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );


    return blob;

}

/*=========================================
        GENERAR CÓDIGO DE RESERVA
=========================================*/

function generarCodigoReserva(){

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let codigo = "";

    for(let i = 0; i < 6; i++){

        codigo +=
            caracteres.charAt(
                Math.floor(
                    Math.random() * caracteres.length
                )
            );

    }

    return `BEAST-${codigo}`;

}

/*=========================================
        CONFIRMAR TURNO
=========================================*/

const confirmar =
    document.getElementById("confirmTurn");


if(confirmar){

    confirmar.addEventListener(
        "click",
        async () => {

            try{

                confirmar.disabled = true;


                /*=================================
                    TEXTO DEL BOTÓN
                =================================*/

                if(
                    comprobantePagoFile &&
                    turno.pago?.metodo === "qr"
                ){

                    confirmar.textContent =
                        "SUBIENDO COMPROBANTE...";

                }else{

                    confirmar.textContent =
                        "GUARDANDO...";

                }


                /*=================================
                    ACTUALIZAR RESUMEN
                =================================*/

                actualizarResumen();


               /*=================================
    GENERAR CÓDIGO
=================================*/

const codigo =
    generarCodigoReserva();


console.log(
    "🎫 Código de reserva:",
    codigo
);


/*=================================
    SUBIR COMPROBANTE QR
=================================*/

if(
    comprobantePagoFile &&
    turno.pago?.metodo === "qr"
){

    const comprobanteUrl =
        await subirComprobante(
            comprobantePagoFile,
            codigo,
            turno.clienteId
        );


    turno.pago.comprobanteUrl =
        comprobanteUrl;


    console.log(
        "✅ Comprobante de pago guardado:",
        comprobanteUrl
    );

}


/*=================================
    GENERAR COMPROBANTE PDF
=================================*/

confirmar.textContent =
    "GENERANDO COMPROBANTE...";


const comprobantePDF =
    await generarComprobanteTurno(
        codigo
    );


console.log(
    "📄 PDF del turno generado:",
    comprobantePDF
);


/*=================================
    SUBIR COMPROBANTE DEL TURNO
=================================*/

confirmar.textContent =
    "SUBIENDO COMPROBANTE...";


const comprobanteTurnoUrl =
    await subirComprobanteTurno(
        comprobantePDF,
        codigo,
        turno.clienteId
    );


turno.comprobanteTurnoUrl =
    comprobanteTurnoUrl;


console.log(
    "☁️ Comprobante del turno guardado:",
    comprobanteTurnoUrl
);


/*=================================
    GUARDAR TURNO EN FIREBASE
=================================*/

confirmar.textContent =
    "GUARDANDO TURNO...";


console.log(
    "💾 Guardando turno:",
    turno
);


const turnoId =
    await crearTurno(
        turno,
        codigo
    );


console.log(
    "✅ Turno guardado en Firebase:",
    turnoId
);


                /*=================================
                    MOSTRAR CONFIRMACIÓN
                =================================*/

                document.getElementById(
                    "reservationCode"
                ).textContent = codigo;


                document.getElementById(
                    "successSucursal"
                ).textContent =
                    turno.sucursal;


                document.getElementById(
                    "successFecha"
                ).textContent =
                    turno.fecha;


                document.getElementById(
                    "successHorario"
                ).textContent =
                    turno.horario;


                document.getElementById(
                    "successBarbero"
                ).textContent =
                    turno.barbero;


                document
                    .getElementById("successModal")
                    .classList.remove("hidden");


            }catch(error){

                console.error(
                    "❌ Error guardando turno:",
                    error
                );


                alert(
                    "No se pudo guardar el turno. Revisá la conexión e intentá nuevamente."
                );


            }finally{

                confirmar.disabled = false;

                confirmar.textContent =
                    "CONFIRMAR TURNO";

            }

        }
    );

}
    
/*=========================================
        CERRAR MODAL
=========================================*/

const cerrarModal = document.getElementById("closeSuccess");

if (cerrarModal) {

    cerrarModal.addEventListener("click", () => {

        if (usuarioActual) {

            // Usuario registrado
            window.location.href =
                "../cliente/dashboard/dashboard.html";

        } else {

            // Cliente sin usuario
            window.location.href =
                "../../index.html";

        }

    });

}
/*=========================================
        REINICIAR FORMULARIO
=========================================*/

function reiniciarFormulario(){

    /*-------------------------
        Reiniciar datos
    --------------------------*/

    pasoActual = 1;

    turno.sucursal = "";
    turno.servicio = "";
    turno.precio = 0;
    turno.fecha = "";
    turno.promocion = null;
    turno.horario = "";
    turno.barbero = "";
    turno.pago = "";
    turno.observaciones = "";

    turno.cliente.nombre = "";
    turno.cliente.apellido = "";
    turno.cliente.telefono = "";
    turno.cliente.correo = "";

    /*-------------------------
        Limpiar inputs
    --------------------------*/

    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("observaciones").value = "";

    /*-------------------------
        Desmarcar tarjetas
    --------------------------*/

    document.querySelectorAll(

        ".selected"

    ).forEach(item=>{

        item.classList.remove("selected");

    });

    /*-------------------------
        Deshabilitar botón paso 7
    --------------------------*/

    document.getElementById(

        "nextStep7"

    ).disabled = true;

  

    /*-------------------------
        Actualizar resumen
    --------------------------*/

    actualizarResumen();

    /*-------------------------
        Volver al paso 1
    --------------------------*/

    mostrarPaso(1);

}



/*=========================================
        DEBUG
=========================================*/



window.turno = turno;

if (document.querySelector(".option-card")) {

    iniciarReserva();

}

/*=========================================
        BOTÓN ATRÁS PRINCIPAL
=========================================*/

const backReservation =
    document.getElementById("backReservation");

if(backReservation){

    backReservation.addEventListener(
        "click",
        () => {

            if(pasoActual > 1){

                mostrarPaso(
                    pasoActual - 1
                );

            }else{

                window.location.href =
                    "../../index.html";

            }

        }
    );

}