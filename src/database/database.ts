import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
// import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { businessSchema } from '../models/Business';
import { articleSchema } from '../models/Article';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
// addRxPlugin(RxDBReplicationCouchDBPlugin);

import { disableWarnings } from 'rxdb/plugins/dev-mode';
disableWarnings();

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

export const createDatabase = async (): Promise<Database> => {
  if (database) {
    return database;
  }

  try {
    database = await createRxDatabase({
      name: 'offlinecruddb',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageMemory(),
      }),
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
    throw error;
  }
};

export const getDatabase = (): Database | null => {
  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.destroy();
    database = null;
  }
};
