import kundenController from "./kunden.controller.js";
import bestellungenController  from "./bestellungen.controller.js";
import produkteController  from "./produkte.controller.js";


// Reexport alle Controller, um die main.js nicht anpassen zu müssen,
// wenn künftig ein neuer Controller hinzugefügt wird.
export default [
    kundenController,
    bestellungenController,
    produkteController,
];