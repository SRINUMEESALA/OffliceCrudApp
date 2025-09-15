import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import {
  getRxStorageSQLiteTrial,
  getSQLiteBasicsQuickSQLite,
} from 'rxdb/plugins/storage-sqlite';
import { open } from 'react-native-quick-sqlite';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { businessSchema } from '../models/Business';
import { articleSchema } from '../models/Article';
// import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { disableWarnings } from 'rxdb/plugins/dev-mode';
disableWarnings();

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
// addRxPlugin(RxDBReplicationCouchDBPlugin);

export type BusinessDocType = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type ArticleDocType = {
  id: string;
  name: string;
  qty: number;
  selling_price: number;
  business_id: string;
  createdAt: number;
  updatedAt: number;
};

export type DatabaseCollections = {
  businesses: BusinessDocType;
  articles: ArticleDocType;
};

export type Database = any;

let database: Database | null = null;

// SQLite trial storage setup
const storage = wrappedValidateAjvStorage({
  storage: getRxStorageSQLiteTrial({
    sqliteBasics: getSQLiteBasicsQuickSQLite(open),
  }),
});

// In memory
// const storage = wrappedValidateAjvStorage({
//   storage: getRxStorageMemory
// });

export const createDatabase = async (): Promise<Database> => {
  if (database) return database;

  try {
    database = await createRxDatabase({
      name: 'offlinecruddb',
      storage,
      multiInstance: false,
    });

    await database.addCollections({
      businesses: {
        schema: businessSchema,
      },
      articles: {
        schema: articleSchema,
      },
    });

    return database;
  } catch (error) {
    console.log('RxDB creation error:', error);
    throw error;
  }
};

export const getDatabase = (): Database | null => database;

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.destroy();
    database = null;
  }
};
