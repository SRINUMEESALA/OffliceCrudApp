import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getSyncStatus, forceSync } from '../services/replication';

interface SyncStatusProps {
  onSyncPress?: () => void;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ onSyncPress }) => {
  const [syncInfo, setSyncInfo] = useState(getSyncStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncInfo(getSyncStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncPress = async () => {
    if (onSyncPress) {
      onSyncPress();
    } else {
      await forceSync();
    }
  };

  const getStatusColor = () => {
    switch (syncInfo.syncStatus) {
      case 'connected':
        return '#4CAF50';
      case 'syncing':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = () => {
    switch (syncInfo.syncStatus) {
      case 'connected':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      default:
        return 'Offline';
    }
  };

  const getConnectionText = () => {
    return syncInfo.isOnline ? 'Online' : 'Offline';
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View
          style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
        />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <Text style={styles.connectionText}>{getConnectionText()}</Text>

      {syncInfo.isOnline && syncInfo.syncStatus !== 'connected' && (
        <TouchableOpacity style={styles.syncButton} onPress={handleSyncPress}>
          <Text style={styles.syncButtonText}>Sync Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    margin: 8,
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  connectionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  syncButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SyncStatus;
