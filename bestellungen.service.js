import daten from "../daten.js";

/**
 * Bestellungen suchen anhand beliebiger Suchbegriffe.
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Bestellungen
 */
export async function search(query) {
    let result = daten.Bestellungen;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.id.toString().includes(query)
                || entry.produktId.toString().includes(query)
                || entry.menge.toString().includes(query)
                || entry.preis.toString().includes(query);
        });
    }

    return result;
}

/**
 * Neue Bestellung erstellen.
 * 
 * @param {Object} bestellung Zu speichernde Bestelldaten
 * @returns {Promise<Object>} Gespeicherte Bestellung
 */
export async function create(bestellung) {
    if (!bestellung) return;

    let entry = {
        id: daten.getNextId(daten.Bestellungen),
        kundenId: parseInt(bestellung.kundenId),
        produktId: parseInt(bestellung.produktId),
        menge: parseInt(bestellung.menge),
        preis: parseFloat(bestellung.preis),
    };

    validateBestellung(entry);
    daten.Bestellungen.push(entry);
    await daten.db.write();

    return entry;
}

/**
 * Bestellung anhand ihrer ID auslesen.
 * 
 * @param {integer} id Bestellungs-ID
 * @returns {Promise<Object>} Gefundene Bestellung oder undefined
 */
export async function read(id) {
    let index = daten.findIndex(daten.Bestellungen, parseInt(id));
    if (index >= 0) return daten.Bestellungen[index];
}

/**
 * Bestellungsinformationen aktualisieren.
 * 
 * @param {integer} id Bestellungs-ID
 * @param {Object} bestellung Zu aktualisierende Bestelldaten
 * @returns {Promise<Object>} Aktualisierte Bestelldaten oder undefined
 */
export async function update(id, bestellung) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (bestellung.kundenId) existing.kundenId = parseInt(bestellung.kundenId);
    if (bestellung.produktId) existing.produktId = parseInt(bestellung.produktId);
    if (bestellung.menge) existing.menge = parseInt(bestellung.menge);
    if (bestellung.preis) existing.preis = parseFloat(bestellung.preis);

    validateBestellung(existing);
    await daten.db.write();

    return existing;
}

/**
 * Bestellung anhand ihrer ID löschen.
 * 
 * @param {integer} id Bestellungs-ID
 * @returns {Promise<integer>} Anzahl der gelöschten Bestellungen
 */
export async function remove(id) {
    let countBefore = daten.Bestellungen.length;
    daten.Bestellungen = daten.Bestellungen.filter(entry => entry.id !== parseInt(id));
    let countAfter = daten.Bestellungen.length;

    await daten.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Bestelldaten auf Vollständigkeit.
 * 
 * @param {Object} bestellung Zu prüfende Bestellung
 */
function validateBestellung(bestellung) {
    if (isNaN(bestellung.kundenId) || isNaN(bestellung.produktId) || isNaN(bestellung.menge) || isNaN(bestellung.preis)) {
        throw new Error("Ungültige Bestelldaten");
    }
}

export default { search, create, read, update, remove };
