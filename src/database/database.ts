import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

// Import schemas
import { businessSchema } from '../models/Business';
import { articleSchema } from '../models/Article';

// Add plugins
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

// Disable dev mode warnings for cleaner console output
import { disableWarnings } from 'rxdb/plugins/dev-mode';
disableWarnings();

// Database types
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

export type Database = RxDatabase<DatabaseCollections>;

// Database instance
let database: Database | null = null;

export const createDatabase = async (): Promise<Database> => {
  if (database) {
    return database;
  }

  try {
    // Create database with memory storage (simplified approach)
    database = await createRxDatabase({
      name: 'offlinecruddb',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageMemory(),
      }),
    });

    // Add collections
    await database.addCollections({
      businesses: {
        schema: businessSchema,
      },
      articles: {
        schema: articleSchema,
      },
    });

    console.log('Database created successfully');
    return database;
  } catch (error) {
    console.error('Error creating database:', error);
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
