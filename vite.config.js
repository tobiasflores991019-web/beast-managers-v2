import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "src/pages/login/login.html"),
                registro: resolve(__dirname, "src/pages/registro/registro.html")
            }
        }
    }
});