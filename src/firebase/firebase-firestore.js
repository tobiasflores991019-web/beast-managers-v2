import { getFirestore } from "firebase/firestore";
import { app } from "./firebase-config.js";

export const db = getFirestore(app);