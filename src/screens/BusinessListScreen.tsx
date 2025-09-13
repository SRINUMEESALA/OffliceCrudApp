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
import { BusinessService } from '../services/businessService';
import { BusinessType } from '../models/Business';

const BusinessListScreen = () => {
  const navigation = useNavigation();
  const [businesses, setBusinesses] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [businessService, setBusinessService] =
    useState<BusinessService | null>(null);

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
      if (database) {
        const service = new BusinessService(database);
        setBusinessService(service);
      }
    } catch (error) {
      console.error('Error initializing business service:', error);
      Alert.alert('Error', 'Failed to initialize database service');
    }
  };

  const loadBusinesses = async () => {
    if (!businessService) return;

    try {
      setLoading(true);
      const businessList = await businessService.getAllBusinesses();
      setBusinesses(businessList);
    } catch (error) {
      console.error('Error loading businesses:', error);
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

  const handleDeleteBusiness = (business: BusinessType) => {
    Alert.alert(
      'Delete Business',
      `Are you sure you want to delete "${business.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!businessService) return;
            try {
              await businessService.deleteBusiness(business.id);
              await loadBusinesses();
              Alert.alert('Success', 'Business deleted successfully');
            } catch (error) {
              console.error('Error deleting business:', error);
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
        navigation.navigate(
          'BusinessDetail' as never,
          { business: item } as never,
        )
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
        onPress={() => handleDeleteBusiness(item)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No businesses found</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading businesses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {businesses.length}{' '}
          {businesses.length === 1 ? 'Business' : 'Businesses'}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateBusiness' as never)}
        >
          <Text style={styles.addButtonText}>+ Add Business</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={businesses}
        keyExtractor={item => item.id}
        renderItem={renderBusinessItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  businessItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  businessDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff3b30',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
});

export default BusinessListScreen;
