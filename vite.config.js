import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(
                    __dirname,
                    "index.html"
                ),

                login: resolve(
                    __dirname,
                    "src/pages/login/login.html"
                ),

                registro: resolve(
                    __dirname,
                    "src/pages/registro/registro.html"
                ),

                dashboard: resolve(
                    __dirname,
                    "src/pages/cliente/dashboard/dashboard.html"
                ),

                misTurnos: resolve(
                    __dirname,
                    "src/pages/cliente/mis-turnos/mis-turnos.html"
                ),

                perfil: resolve(
                    __dirname,
                    "src/pages/cliente/perfil/perfil.html"
                ),

                reservar: resolve(
                    __dirname,
                    "src/pages/reservar/reservar.html"
                )
            }
        }
    }
});