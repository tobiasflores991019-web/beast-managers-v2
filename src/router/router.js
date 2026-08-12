import { iniciarDashboard } from "../pages/cliente/dashboard/dashboard.js";

export function navegar(pagina) {

    const app = document.getElementById("app");

    switch (pagina) {

         case "dashboard":

             iniciarDashboard();

         break;


        case "turnos":

            app.innerHTML = "<h1>Mis Turnos</h1>";

            break;

        case "beneficios":

            app.innerHTML = "<h1>Beneficios</h1>";

            break;

        case "perfil":

            app.innerHTML = "<h1>Perfil</h1>";

            break;

        default:

            app.innerHTML = "<h1>404</h1>";

    }

}