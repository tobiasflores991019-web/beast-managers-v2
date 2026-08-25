import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

import { app } from "../firebase/firebase-config";


// ======================================================
// STORAGE
// ======================================================

export const storage = getStorage(app);


// ======================================================
// SUBIR COMPROBANTE
// ======================================================



export async function subirComprobante(
    archivo,
    codigoReserva,
    clienteId
){

    if(!archivo){
        throw new Error(
            "No se recibió el comprobante."
        );
    }

    if(!archivo.type.startsWith("image/")){
        throw new Error(
            "El comprobante debe ser una imagen."
        );
    }

    if(archivo.size > 5 * 1024 * 1024){
        throw new Error(
            "El comprobante no puede superar los 5 MB."
        );
    }

    const extension =
        archivo.name.split(".").pop();

    const nombreArchivo =
        `comprobante_${Date.now()}.${extension}`;

    const ruta =
        `comprobantes/${clienteId || "invitado"}/${codigoReserva}/${nombreArchivo}`;

    const archivoRef =
        ref(storage, ruta);

    console.log(
        "☁️ Subiendo comprobante:",
        ruta
    );

    await uploadBytes(
        archivoRef,
        archivo,
        {
            contentType: archivo.type
        }
    );

    const url =
        await getDownloadURL(
            archivoRef
        );

    console.log(
        "✅ COMPROBANTE SUBIDO:",
        url
    );

    return url;
}

// ======================================================
// SUBIR COMPROBANTE DEL TURNO
// ======================================================

export async function subirComprobanteTurno(
    archivo,
    codigoReserva,
    clienteId
){

    if(!archivo){
        throw new Error(
            "No se recibió el comprobante del turno."
        );
    }

    const nombreArchivo =
        `turno_${codigoReserva}.pdf`;

    const ruta =
        `turnos/comprobantes/${clienteId || "invitado"}/${codigoReserva}/${nombreArchivo}`;

    const archivoRef =
        ref(storage, ruta);

    console.log(
        "☁️ Subiendo comprobante del turno:",
        ruta
    );

    await uploadBytes(
        archivoRef,
        archivo,
        {
            contentType: "application/pdf"
        }
    );

    const url =
        await getDownloadURL(
            archivoRef
        );

    console.log(
        "✅ COMPROBANTE DEL TURNO SUBIDO:",
        url
    );

    return url;
}