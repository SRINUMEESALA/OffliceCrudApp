import { Database } from '../database/database';
import { RxReplicationWriteToMasterRow } from 'rxdb/plugins/replication-couchdb';

// CouchDB configuration
const COUCHDB_URL = 'http://localhost:5984'; // Change this to your CouchDB URL
const COUCHDB_USERNAME = 'admin'; // Change this to your CouchDB username
const COUCHDB_PASSWORD = 'password'; // Change this to your CouchDB password

export const setupReplication = async (database: Database) => {
  try {
    // Check if syncCouchDB method is available
    if (!database.businesses.syncCouchDB) {
      console.warn(
        'CouchDB replication plugin not available, skipping replication setup',
      );
      return null;
    }

    // Setup replication for businesses collection
    const businessesReplication = database.businesses.syncCouchDB({
      remote: `${COUCHDB_URL}/businesses`,
      options: {
        live: true,
        retry: true,
        back_off_function: (delay: number) => {
          if (delay === 0) return 1000;
          return Math.min(delay * 2, 30000);
        },
        checkpoint: 'businesses-checkpoint',
        auth: {
          username: COUCHDB_USERNAME,
          password: COUCHDB_PASSWORD,
        },
      },
    });

    // Setup replication for articles collection
    const articlesReplication = database.articles.syncCouchDB({
      remote: `${COUCHDB_URL}/articles`,
      options: {
        live: true,
        retry: true,
        back_off_function: (delay: number) => {
          if (delay === 0) return 1000;
          return Math.min(delay * 2, 30000);
        },
        checkpoint: 'articles-checkpoint',
        auth: {
          username: COUCHDB_USERNAME,
          password: COUCHDB_PASSWORD,
        },
      },
    });

    // Handle replication events
    businessesReplication.error$.subscribe(error => {
      console.error('Businesses replication error:', error);
    });

    businessesReplication.active$.subscribe(active => {
      console.log('Businesses replication active:', active);
    });

    articlesReplication.error$.subscribe(error => {
      console.error('Articles replication error:', error);
    });

    articlesReplication.active$.subscribe(active => {
      console.log('Articles replication active:', active);
    });

    console.log('Replication setup completed');
    return { businessesReplication, articlesReplication };
  } catch (error) {
    console.error('Error setting up replication:', error);
    throw error;
  }
};

export const stopReplication = async (replications: any) => {
  try {
    if (replications.businessesReplication) {
      await replications.businessesReplication.cancel();
    }
    if (replications.articlesReplication) {
      await replications.articlesReplication.cancel();
    }
    console.log('Replication stopped');
  } catch (error) {
    console.error('Error stopping replication:', error);
  }
};
