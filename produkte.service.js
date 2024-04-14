import daten from "../daten.js";

/**
 * Produkte suchen anhand beliebiger Suchbegriffe.
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Produkte
 */
export async function search(query) {
    let result = daten.Produkte;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.id.toString().includes(query)
                || entry.name.toLowerCase().includes(query)
                || entry.preis.toString().includes(query);
        });
    }

    return result;
}

/**
 * Neues Produkt erstellen.
 * 
 * @param {Object} produkt Zu speichernde Produktinformationen
 * @returns {Promise<Object>} Gespeichertes Produkt
 */
export async function create(produkt) {
    if (!produkt) return;

    let entry = {
        id: daten.getNextId(daten.Produkte),
        name: `${produkt.name || ""}`.trim(),
        preis: parseFloat(produkt.preis),
    };

    validateProdukt(entry);
    daten.Produkte.push(entry);
    await daten.db.write();

    return entry;
}

/**
 * Produkt anhand seiner ID auslesen.
 * 
 * @param {integer} id Produkt-ID
 * @returns {Promise<Object>} Gefundenes Produkt oder undefined
 */
export async function read(id) {
    let index = daten.findIndex(daten.Produkte, parseInt(id));
    if (index >= 0) return daten.Produkte[index];
}

/**
 * Produktinformationen aktualisieren.
 * 
 * @param {integer} id Produkt-ID
 * @param {Object} produkt Zu aktualisierende Produktinformationen
 * @returns {Promise<Object>} Aktualisierte Produktinformationen oder undefined
 */
export async function update(id, produkt) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (produkt.name) existing.name = `${produkt.name}`.trim();
    if (produkt.preis) existing.preis = parseFloat(produkt.preis);

    validateProdukt(existing);
    await daten.db.write();

    return existing;
}

/**
 * Produkt anhand seiner ID löschen.
 * 
 * @param {integer} id Produkt-ID
 * @returns {Promise<integer>} Anzahl der gelöschten Produkte
 */
export async function remove(id) {
    let countBefore = daten.Produkte.length;
    daten.Produkte = daten.Produkte.filter(entry => entry.id !== parseInt(id));
    let countAfter = daten.Produkte.length;

    await daten.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Produktinformationen auf Vollständigkeit.
 * 
 * @param {Object} produkt Zu prüfendes Produkt
 */
function validateProdukt(produkt) {
    if (!produkt.name) throw new Error("Name fehlt");
    if (isNaN(produkt.preis) || produkt.preis <= 0) throw new Error("Ungültiger Preis");
}

export default { search, create, read, update, remove };
