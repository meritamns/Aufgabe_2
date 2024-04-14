import daten from "../daten.js";

/**
 * Kunden suchen anhand beliebiger Suchbegriffe.
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Kunden
 */
export async function search(query) {
    let result = daten.Kunden;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.vorname.toLowerCase().includes(query)
                || entry.nachname.toLowerCase().includes(query);
        });
    }

    return result;
}

/**
 * Neuen Kunden anlegen.
 * 
 * @param {Object} kunde Zu speichernde Kundendaten
 * @returns {Promise<Object>} Gespeicherter Kunde
 */
export async function create(kunde) {
    if (!kunde) return;

    let entry = {
        id: daten.getNextId(daten.Kunden),
        vorname: `${kunde.vorname || ""}`.trim(),
        nachname: `${kunde.nachname || ""}`.trim(),
    };

    validateKunde(entry);
    daten.Kunden.push(entry);
    await daten.db.write();

    return entry;
}

/**
 * Kunden anhand ihrer ID auslesen.
 * 
 * @param {integer} id Kunden-ID
 * @returns {Promise<Object>} Gefundener Kunde oder undefined
 */
export async function read(id) {
    let index = daten.findIndex(daten.Kunden, parseInt(id));
    if (index >= 0) return daten.Kunden[index];
}

/**
 * Kundeninformationen aktualisieren.
 * 
 * @param {integer} id Kunden-ID
 * @param {Object} kunde Zu aktualisierende Kundendaten
 * @returns {Promise<Object>} Aktualisierte Kundendaten oder undefined
 */
export async function update(id, kunde) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (kunde.vorname) existing.vorname = `${kunde.vorname}`.trim();
    if (kunde.nachname) existing.nachname = `${kunde.nachname}`.trim();

    validateKunde(existing);
    await daten.db.write();

    return existing;
}

/**
 * Kunden anhand ihrer ID löschen.
 * 
 * @param {integer} id Kunden-ID
 * @returns {Promise<integer>} Anzahl der gelöschten Kundendaten
 */
export async function remove(id) {
    let countBefore = daten.Kunden.length;
    daten.Kunden = daten.Kunden.filter(entry => entry.id !== parseInt(id));
    let countAfter = daten.Kunden.length;

    await daten.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Kundendaten auf Vollständigkeit.
 * 
 * @param {Object} kunde Zu prüfender Kunde
 */
function validateKunde(kunde) {
    if (!kunde.vorname) throw new Error("Vorname fehlt");
    if (!kunde.nachname) throw new Error("Nachname fehlt");
}

export default { search, create, read, update, remove };
