import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getDatabase } from '../database/database';
import { UnifiedBusinessService } from '../services/unifiedBusinessService';
import { BusinessType } from '../models/Business';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [businesses, setBusinesses] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [businessService, setBusinessService] =
    useState<UnifiedBusinessService | null>(null);

  useEffect(() => {
    initializeService();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (businessService) {
        loadBusinesses();
      }
    }, [businessService]),
  );

  const initializeService = async () => {
    try {
      const database = getDatabase();
      const service = new UnifiedBusinessService(database);
      setBusinessService(service);
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize database service');
    }
  };

  const loadBusinesses = async () => {
    if (!businessService) return;

    try {
      setLoading(true);
      const businessesData = await businessService.getAllBusinesses();
      setBusinesses(businessesData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBusinesses();
    setRefreshing(false);
  };

  const handleDeleteBusiness = (id: string, name: string) => {
    Alert.alert(
      'Delete Business',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!businessService) return;

            try {
              const success = await businessService.deleteBusiness(id);
              if (success) {
                await loadBusinesses();
              } else {
                Alert.alert('Error', 'Failed to delete business');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete business');
            }
          },
        },
      ],
    );
  };

  const renderBusinessItem = ({ item }: { item: BusinessType }) => (
    <TouchableOpacity
      style={styles.businessItem}
      onPress={() =>
        (navigation as any).navigate('BusinessDetail', { business: item })
      }
    >
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{item.name}</Text>
        <Text style={styles.businessDate}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteBusiness(item.id, item.name)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No businesses found</Text>
      <Text style={styles.emptyStateSubtext}>
        Create your first business to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Database: {businessService?.getDatabaseType() || 'Loading...'}
        </Text>
      </View>

      <FlatList
        data={businesses}
        renderItem={renderBusinessItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => (navigation as any).navigate('CreateBusiness')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  businessItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  businessDate: {
    fontSize: 14,
    color: '#666666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default HomeScreen;
