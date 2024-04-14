import service from "../services/kunden.service.js";
import { wrapAsync } from "../utils.js";
import { logger } from "../utils.js";

const prefix = "/api/kunden";

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
 * Abruf einer Liste von Kunden, optional mit Stichwortsuche.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function search(req, res) {
    let result = await service.search(req.query.q);
    res.status(200).send(result);
}

/**
 * Anlegen eines neuen Kunden.
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
 * Abruf eines einzelnen Kunden anhand seiner ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function read(req, res) {
    let result = await service.read(req.params.id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({ error: "NOT-FOUND", message: "Der Kunde wurde nicht gefunden." });
    }
}

/**
 * Aktualisieren einzelner Felder eines Kunden oder Überschreiben des
 * gesamten Kunden.
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
            res.status(404).send({ error: "NOT-FOUND", message: "Der Kunde wurde nicht gefunden." });
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send({ name: error.name || "Error", message: error.message || "" });
    }
}

/**
 * Löschen eines Kunden anhand seiner ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function remove(req, res) {
    let count = await service.remove(req.params.id);
    if (count > 0) {
        res.status(204).send();
    } else {
        res.status(404).send({ error: "NOT-FOUND", message: "Der Kunde wurde nicht gefunden." });
    }
}
