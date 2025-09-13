import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getDatabase } from '../database/database';
import { BusinessService } from '../services/businessService';

const CreateBusinessScreen = () => {
  const navigation = useNavigation();
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [businessService, setBusinessService] =
    useState<BusinessService | null>(null);

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      console.log('Initializing business service...');
      const database = getDatabase();
      console.log('Database available:', !!database);
      if (database) {
        const service = new BusinessService(database);
        setBusinessService(service);
        console.log('Business service initialized successfully');
      } else {
        console.log('Database not available during service initialization');
      }
    } catch (error) {
      console.error('Error initializing business service:', error);
      Alert.alert('Error', 'Failed to initialize database service');
    }
  };

  const handleCreateBusiness = async () => {
    console.log('=== Create Business Flow Start ===');
    console.log('Business name:', businessName.trim());
    console.log('Business service available:', !!businessService);

    if (!businessName.trim()) {
      console.log('Validation failed: No business name');
      Alert.alert('Error', 'Please enter a business name');
      return;
    }

    if (!businessService) {
      console.log('Validation failed: No business service');
      Alert.alert('Error', 'Database service not available');
      return;
    }

    try {
      console.log('Starting business creation...');
      setLoading(true);
      const result = await businessService.createBusiness(businessName.trim());
      console.log('Business creation successful:', result);
      console.log('Showing success alert...');

      Alert.alert(
        '✅ Success!',
        'Business created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Success alert OK pressed, navigating back');
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
      console.log('Success alert shown');
    } catch (error) {
      console.error('Error creating business:', error);
      Alert.alert('Error', 'Failed to create business');
    } finally {
      setLoading(false);
      console.log('=== Create Business Flow End ===');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                  style={styles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="Enter business name"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleCreateBusiness}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  loading && styles.createButtonDisabled,
                ]}
                onPress={handleCreateBusiness}
                disabled={loading}
              >
                <Text style={styles.createButtonText}>
                  {loading ? 'Creating...' : 'Create Business'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateBusinessScreen;
