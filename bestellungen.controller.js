import service from "../services/bestellungen.service.js";
import { wrapAsync } from "../utils.js";
import { logger } from "../utils.js";

const prefix = "/api/bestellungen";

/**
 * Diese Funktion fügt die unten ausprogrammierten Route Handler der
 * Express Application hinzu.
 *
 * @param {Express.Application} app Express Application
 */
export default function registerRoutes(app) {
    // Ganze Collection
    app.get(prefix, wrapAsync(search));
    app.post(prefix, wrapAsync(create));

    // Einzelne Ressource
    app.get(`${prefix}/:id`, wrapAsync(read));
    app.put(`${prefix}/:id`, wrapAsync(update));
    app.patch(`${prefix}/:id`, wrapAsync(update));
    app.delete(`${prefix}/:id`, wrapAsync(remove));
};

/**
 * Abruf einer Liste von Bestellungen, optional mit Stichwortsuche.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function search(req, res) {
    let result = await service.search(req.query.q);
    res.status(200).send(result);
}

/**
 * Anlegen einer neuen Bestellung.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function create(req, res) {
    try {
        let result = await service.create(req.body);
        res.status(201).header("location", `${prefix}/${result.id}`).send(result);
    } catch (error) {
        logger.error(error);
        res.status(400).send({ name: error.name || "Error", message: error.message || "" });
    }
}

/**
 * Abruf einer einzelnen Bestellung anhand ihrer ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function read(req, res) {
    let result = await service.read(req.params.id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({ error: "NOT-FOUND", message: "Die Bestellung wurde nicht gefunden." });
    }
}

/**
 * Aktualisieren einzelner Felder einer Bestellung oder Überschreiben der
 * gesamten Bestellung.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function update(req, res) {
    try {
        let result = await service.update(req.params.id, req.body);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ error: "NOT-FOUND", message: "Die Bestellung wurde nicht gefunden." });
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send({ name: error.name || "Error", message: error.message || "" });
    }
}

/**
 * Löschen einer Bestellung anhand ihrer ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function remove(req, res) {
    let count = await service.remove(req.params.id);
    if (count > 0) {
        res.status(204).send();
    } else {
        res.status(404).send({ error: "NOT-FOUND", message: "Die Bestellung wurde nicht gefunden." });
    }
}
