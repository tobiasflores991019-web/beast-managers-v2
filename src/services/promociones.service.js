import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

import { db } from "../firebase/firebase-firestore.js";


// ======================================================
// OBTENER PROMOCIONES ACTIVAS
// ======================================================

export async function obtenerPromociones() {

    try {

        const promocionesRef =
            collection(db, "promociones");

        const consulta =
            query(
                promocionesRef,
                where("activo", "==", true)
            );

        const snapshot =
            await getDocs(consulta);

        const promociones = [];

        snapshot.forEach(documento => {

            promociones.push({
                id: documento.id,
                ...documento.data()
            });

        });

        console.log(
            "🎁 Promociones obtenidas:",
            promociones
        );

        return promociones;

    } catch (error) {

        console.error(
            "❌ Error obteniendo promociones:",
            error
        );

        return [];
    }
}