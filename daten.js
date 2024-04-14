import { JSONFilePreset } from "lowdb/node";

// Default-Daten für unsere kleine Datenbank
const defaultData = {
  Kunden: [
    {
      id: 1,
      vorname: "Ceylin",
      nachname: "Atas",
    },
    {
      id: 2,
      vorname: "Krenar",
      nachname: "Beka",
    },
  ],
  Bestellungen: [
    {
      id: 1,
      kundenId: 1,
      produktId: 1,
      menge: 2,
      preis: 20.5,
    },
    {
      id: 2,
      kundenId: 2,
      produktId: 2,
      menge: 1,
      preis: 15.75,
    },
  ],
  Produkte: [
    {
      id: 1,
      name: "Orientalischer Teppich",
      preis: 10.25,
    },
    {
      id: 2,
      name: "Blumenstrauß",
      preis: 15.75,
    },
  ],
};

export const db = await JSONFilePreset("db.json", defaultData);

/**
 * 
 * @param {Object[]} dataset Zu durchsuchende Datenmenge
 * @param {integer} id ID des gesuchten Datensatzes
 * @returns {integer} Gefundener Index oder -1
 */
export function findIndex(dataset, id) {
  return dataset.findIndex((entry) => entry.id === id);
}

/**
 * 
 * 
 * @param {Object[]} dataset Zu durchsuchende Datenmenge
 */
export function getNextId(dataset) {
  let maxId = -1;
  for (let entry of dataset || []) maxId = Math.max(maxId, entry.id);
  return maxId + 1;
}

export default { db, findIndex, getNextId };
