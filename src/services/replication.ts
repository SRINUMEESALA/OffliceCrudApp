import { Database } from '../database/database';
import NetInfo from '@react-native-community/netinfo';

const COUCHDB_URL = 'http://localhost:5984';
const COUCHDB_USERNAME = 'admin';
const COUCHDB_PASSWORD = 'password';

let replicationState = {
  businessesReplication: null as any,
  articlesReplication: null as any,
  isOnline: false,
  syncStatus: 'disconnected' as
    | 'connected'
    | 'disconnected'
    | 'syncing'
    | 'error',
};

const setupNetworkMonitoring = () => {
  NetInfo.addEventListener(state => {
    const wasOnline = replicationState.isOnline;
    replicationState.isOnline = state.isConnected ?? false;

    if (!wasOnline && replicationState.isOnline) {
      replicationState.syncStatus = 'syncing';
    } else if (wasOnline && !replicationState.isOnline) {
      replicationState.syncStatus = 'disconnected';
    }
  });
};

export const setupReplication = async (database: Database) => {
  try {
    setupNetworkMonitoring();

    if (!database.businesses.syncCouchDB) {
      replicationState.syncStatus = 'disconnected';
      return;
    }

    const replicationOptions = {
      remote: `${COUCHDB_URL}/businesses`,
      options: {
        auth: {
          username: COUCHDB_USERNAME,
          password: COUCHDB_PASSWORD,
        },
        live: true,
        retry: true,
      },
    };

    replicationState.businessesReplication =
      database.businesses.syncCouchDB(replicationOptions);

    replicationState.articlesReplication = database.articles.syncCouchDB({
      ...replicationOptions,
      remote: `${COUCHDB_URL}/articles`,
    });

    replicationState.businessesReplication.error$.subscribe((error: any) => {
      if (error) {
        replicationState.syncStatus = 'error';
      }
    });

    replicationState.businessesReplication.active$.subscribe((active: any) => {
      if (active) {
        replicationState.syncStatus = 'syncing';
      }
    });

    replicationState.businessesReplication.received$.subscribe(
      (received: any) => {
        replicationState.syncStatus = 'syncing';
      },
    );

    replicationState.businessesReplication.sent$.subscribe((sent: any) => {
      replicationState.syncStatus = 'syncing';
    });

    replicationState.articlesReplication.error$.subscribe((error: any) => {
      if (error) {
        replicationState.syncStatus = 'error';
      }
    });

    replicationState.articlesReplication.active$.subscribe((active: any) => {
      if (active) {
        replicationState.syncStatus = 'syncing';
      }
    });

    replicationState.articlesReplication.received$.subscribe(
      (received: any) => {
        replicationState.syncStatus = 'syncing';
      },
    );

    replicationState.articlesReplication.sent$.subscribe((sent: any) => {
      replicationState.syncStatus = 'syncing';
    });

    replicationState.syncStatus = 'connected';
  } catch (error) {
    replicationState.syncStatus = 'error';
  }
};

export const getSyncStatus = () => {
  return {
    isOnline: replicationState.isOnline,
    syncStatus: replicationState.syncStatus,
  };
};

export const forceSync = () => {
  if (replicationState.businessesReplication) {
    replicationState.businessesReplication.sync();
  }
  if (replicationState.articlesReplication) {
    replicationState.articlesReplication.sync();
  }
};
