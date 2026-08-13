

import { obtenerUsuarioActual } from "../../services/auth.service.js";
import { obtenerPerfilUsuario } from "../../services/usuario.service.js";
import { crearTurno } from "../../services/turnos.services.js";


let usuarioActual = null;
let perfilUsuario = null;

const TOTAL_PASOS = 9;

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

        if (!usuarioActual) {

            console.warn("No hay ningún usuario autenticado.");

            return;

        }

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

    ori:{

        nombre:"Ori",

        foto:"../../assets/img/barberos/ori.jpg",

        rating:"4.9",

        estrellas:"★★★★★",

        experiencia:"7 años",

        descripcion:"Especialista en Fade, Taper y Barba.",

        especialidades:[

            "Fade",

            "Taper",

            "Barba",

            "Cortes Clásicos"

        ]

    },

    benja:{

        nombre:"Benja",

        foto:"../../assets/img/barberos/benja.jpg",

        rating:"4.8",

        estrellas:"★★★★★",

        experiencia:"5 años",

        descripcion:"Especialista en cortes modernos.",

        especialidades:[

            "Fade",

            "Barba",

            "Mullet"

        ]

    },

    dylan:{

        nombre:"Dylan",

        foto:"../../assets/img/barberos/dylan.jpg",

        rating:"4.9",

        estrellas:"★★★★★",

        experiencia:"6 años",

        descripcion:"Especialista en color y diseños.",

        especialidades:[

            "Color",

            "Diseños",

            "Fade"

        ]

    },

    tobi:{

        nombre:"Tobi",

        foto:"../../assets/img/barberos/tobi.jpg",

        rating:"5.0",

        estrellas:"★★★★★",

        experiencia:"10 años",

        descripcion:"Fundador de The Beast Barbershop.",

        especialidades:[

            "Fade",

            "Color",

            "Asesoramiento"

        ]

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
        SERVICIO
=========================================*/

function iniciarPaso2(){

    const servicios = document.querySelectorAll(".service-card");

    servicios.forEach(card=>{

        card.addEventListener("click",()=>{

            seleccionar(".service-card",card);

            turno.servicio = card.dataset.service;

            turno.precio = Number(card.dataset.price);

            actualizarResumen();

            mostrarPaso(3);

        });

    });

}

/*=========================================
        PASO 3
        FECHA
=========================================*/

function iniciarPaso3(){

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

            mostrarPaso(4);

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
        HORARIO
=========================================*/
/*=========================================
        PASO 4
        HORARIO
=========================================*/

function iniciarPaso4(){

    const horarios =
        document.querySelectorAll(".hours button");

    horarios.forEach(boton => {

        boton.addEventListener("click", () => {

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

            console.log("🕐 Horario seleccionado:", {
                horario: turno.horario,
                fechaHora: turno.fechaHora
            });

            actualizarResumen();

            mostrarPaso(5);

        });

    });

}





/*=========================================
        PASO 5
        BARBEROS
=========================================*/
function iniciarPaso5(){

    const tarjetas =
        document.querySelectorAll(".barber-card");

    const modal =
        document.getElementById("barberModal");

    const cerrar =
        document.querySelector(".close-modal");

    tarjetas.forEach(card => {

        card.addEventListener("click", () => {

            const idBarbero = card.dataset.barber;

            console.log(
                "💈 BARBERO SELECCIONADO PARA VER:",
                idBarbero
            );

            abrirModalBarbero(idBarbero);

        });

    });

    if (cerrar) {

        cerrar.addEventListener("click", () => {

            modal.classList.add("hidden");

        });

    }

    if (modal) {

        modal.addEventListener("click", (e) => {

            if (e.target === modal) {

                modal.classList.add("hidden");

            }

        });

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

    mostrarPaso(6);

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

    .forEach(step=>{

        step.classList.add("hidden");

    });

    const paso = document.getElementById(

        "step"+numero

    );

    if(paso){

        paso.classList.remove("hidden");

    }

    actualizarProgreso();

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

if(cerrarModal){

    cerrarModal.addEventListener("click", () => {

        window.location.href =
            "../cliente/dashboard/dashboard.html";

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