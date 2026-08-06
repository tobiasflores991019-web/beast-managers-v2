import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-firestore.js";

export async function obtenerEmpresa(idEmpresa) {

    try {

        const empresaRef = doc(db, "empresas", idEmpresa);

        const empresaSnap = await getDoc(empresaRef);

        if (empresaSnap.exists()) {

            return empresaSnap.data();

        } else {

            console.log("La empresa no existe");

            return null;

        }

    } catch (error) {

        console.error(error);

        return null;

    }

}