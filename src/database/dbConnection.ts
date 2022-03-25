import { createRxDatabase } from "rxdb";
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
addPouchPlugin(require('pouchdb-adapter-idb'));
import {paymentSchema, expenseSchema} from "./dbSchema";

/**
 * Sets up an RxDB instance for this application - creates required collections if they don't exist
 */
export const createDB = async () => {
  const db = await createRxDatabase({
    name: 'conduit',
    storage: getRxStoragePouch('idb'),
    multiInstance: true,
    eventReduce: true
  });

  await db.addCollections({
    payments: {
      schema: paymentSchema,
    },
    expenses: {
      schema: expenseSchema,
    },
  });

  return db;
}

/**
 * this can be called to purge all indexedDB/rxdb databases and entries for debugging purpose
 */
export const purgeIndexedDB = async () => {
  indexedDB.databases().then((databases) => {
    databases.forEach((db) => {indexedDB.deleteDatabase(db.name)})
  });
}

// @ts-ignore - development demonstration/purposes only
window.purgeIndexedDB = purgeIndexedDB;