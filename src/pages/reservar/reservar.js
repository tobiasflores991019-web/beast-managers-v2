

import { obtenerUsuarioActual } from "../../services/auth.service.js";
import { obtenerPerfilUsuario } from "../../services/usuario.service.js";

import {
    crearTurno,
    obtenerTurnosDisponibles
} from "../../services/turnos.services.js";

import {
    obtenerPromociones
} from "../../services/promociones.service.js";

let usuarioActual = null;
let perfilUsuario = null;

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

    sucursal: "",
    servicio: "",
    precio: 0,
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

        foto: "../../assets/img/barberos/ori.jpg",

        rating: "4.9",

        estrellas: "★★★★★",

        experiencia: "7 años",

        descripcion: "Especialista en Fade, Taper y Barba.",

        especialidades: [
            "Fade",
            "Taper",
            "Barba",
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

        foto: "../../assets/img/barberos/benja.jpg",

        rating: "4.8",

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

        foto: "../../assets/img/barberos/dylan.jpg",

        rating: "4.9",

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

        foto: "../../assets/img/barberos/tobi.jpg",

        rating: "5.0",

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

        foto: "../../assets/img/barberos/ivan.jpg",

        rating: "5.0",

        estrellas: "★★★★★",

        experiencia: "",

        descripcion:
            "Barbero especializado en cortes modernos y clásicos.",

        especialidades: [
            "Fade",
            "Taper",
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
        PASO 3
        SERVICIO
=========================================*/

function iniciarPaso3(){

    const servicios =
        document.querySelectorAll(".service-card");

    servicios.forEach(card => {

        card.addEventListener("click", () => {

            seleccionar(
                ".service-card",
                card
            );

            turno.servicio =
                card.dataset.service;

            turno.precio =
                Number(card.dataset.price);

            // =====================================
            // SERVICIO DE COLOR
            // =====================================

            if (esServicioColor()) {

                turno.barbero =
                    "Barbero disponible";

                console.log(
                    "🎨 Servicio de color seleccionado"
                );

                console.log(
                    "💈 Barbero:",
                    turno.barbero
                );

            } else {

                // Servicio normal
                turno.barbero = "";

            }

            actualizarResumen();

            mostrarPaso(4);

        });

    });

}
/*=========================================
        PASO 2
        FECHA
=========================================*/

function iniciarPaso2(){

    const dias = document.querySelectorAll(".day-card");

    dias.forEach(card => {

        card.addEventListener("click", () => {

            if(card.classList.contains("calendar")){
                return;
            }

            seleccionar(".day-card", card);

            const fecha = obtenerFechaReal(card);

            if(!fecha){
                console.error("❌ No se pudo obtener la fecha");
                return;
            }

            turno.fecha = fecha.fechaTexto;
            turno.fechaISO = fecha.fechaISO;

            // Si ya eligió horario antes, reconstruimos fechaHora
            if(turno.horario){

                turno.fechaHora =
                    crearFechaHora(
                        turno.fechaISO,
                        turno.horario
                    );

            }

            console.log("📅 Fecha seleccionada:", {
                texto: turno.fecha,
                iso: turno.fechaISO
            });

            actualizarResumen();

            mostrarPaso(3);

        });

    });

}

function obtenerFechaReal(card){

    const valor = card.dataset.date;

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    let fecha;

    if(valor === "Hoy"){

        fecha = new Date(hoy);

    }

    else if(valor === "Mañana"){

        fecha = new Date(hoy);

        fecha.setDate(
            fecha.getDate() + 1
        );

    }

    else {

        const match =
            valor.match(
                /(\d{1,2})\/(\d{1,2})/
            );

        if(!match){

            return null;

        }

        const dia =
            Number(match[1]);

        const mes =
            Number(match[2]) - 1;

        fecha =
            new Date(
                hoy.getFullYear(),
                mes,
                dia
            );

        /*
        Si la fecha ya pasó este año,
        la interpretamos para el próximo año.
        */

        if(fecha < hoy){

            fecha.setFullYear(
                fecha.getFullYear() + 1
            );

        }

    }

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

    const fechaISO =
        `${año}-${mes}-${dia}`;

    const fechaTexto =
        fecha.toLocaleDateString(
            "es-AR",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

    return {

        fecha,

        fechaISO,

        fechaTexto

    };

}


function crearFechaHora(
    fechaISO,
    horario
){

    if(!fechaISO || !horario){
        return null;
    }

    const [hora, minutos] =
        horario.split(":");

    const fecha =
        new Date(
            `${fechaISO}T${hora}:${minutos}:00`
        );

    return fecha;

}



/*=========================================
        PASO 4
        BARBEROS
=========================================*/

/*=========================================
        PASO 4
        BARBEROS
=========================================*/

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

function iniciarPaso6(){

    const pagos = document.querySelectorAll(".payment-card");

    pagos.forEach(card=>{

        card.addEventListener("click",()=>{

            seleccionar(".payment-card",card);

            turno.pago = card.dataset.payment;

            actualizarResumen();

            mostrarPaso(7);

        });

    });

}

/*=========================================
        PASO 7
        DATOS DEL CLIENTE
=========================================*/

function iniciarPaso7(){

    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const telefono = document.getElementById("telefono");
    const correo = document.getElementById("correo");

    const botonPaso7 = document.getElementById("nextStep7");

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

        const completo =
            turno.cliente.nombre !== "" &&
            turno.cliente.apellido !== "" &&
            turno.cliente.telefono !== "" &&
            turno.cliente.correo !== "";

        if(botonPaso7){

            botonPaso7.disabled = !completo;

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

    // Comprobar inmediatamente los datos
    // que Firebase ya cargó
    actualizarDatosCliente();

    if(botonPaso7){

        botonPaso7.addEventListener("click", () => {

            actualizarDatosCliente();

            mostrarPaso(8);

        });

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

    actualizarCampo(

        "rPago",

        turno.pago

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
        GENERAR RESERVA
=========================================*/

function generarCodigoReserva(){

    const ahora = new Date();

    const año = String(ahora.getFullYear()).slice(-2);

    const mes = String(
        ahora.getMonth()+1
    ).padStart(2,"0");

    const dia = String(
        ahora.getDate()
    ).padStart(2,"0");

    const numero = Math.floor(
        Math.random()*9000
    )+1000;

    return `BM-${año}${mes}${dia}-${numero}`;

}

/*=========================================
        CONFIRMAR TURNO
=========================================*/

const confirmar = document.getElementById("confirmTurn");

if(confirmar){

    confirmar.addEventListener("click", async () => {

        try {

            confirmar.disabled = true;

            confirmar.textContent = "GUARDANDO...";

            actualizarResumen();

            const codigo = generarCodigoReserva();

            console.log("💾 Guardando turno:", turno);

            const turnoId = await crearTurno(
                turno,
                codigo
            );

            console.log(
                "✅ Turno guardado en Firebase:",
                turnoId
            );

            document.getElementById(
                "reservationCode"
            ).textContent = codigo;

            document.getElementById(
                "successSucursal"
            ).textContent = turno.sucursal;

            document.getElementById(
                "successFecha"
            ).textContent = turno.fecha;

            document.getElementById(
                "successHorario"
            ).textContent = turno.horario;

            document.getElementById(
                "successBarbero"
            ).textContent = turno.barbero;

            document
                .getElementById("successModal")
                .classList.remove("hidden");

        } catch (error) {

            console.error(
                "❌ Error guardando turno:",
                error
            );

            alert(
                "No se pudo guardar el turno. Revisá la conexión e intentá nuevamente."
            );

        } finally {

            confirmar.disabled = false;

            confirmar.textContent = "CONFIRMAR TURNO";

        }

    });

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