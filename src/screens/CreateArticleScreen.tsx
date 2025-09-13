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
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDatabase } from '../database/database';
import { ArticleService } from '../services/articleService';
import { BusinessType } from '../models/Business';

const CreateArticleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { business } = route.params as { business: BusinessType };

  const [articleName, setArticleName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [articleService, setArticleService] = useState<ArticleService | null>(
    null,
  );

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      console.log('Initializing article service...');
      const database = getDatabase();
      console.log('Database available:', !!database);
      if (database) {
        const service = new ArticleService(database);
        setArticleService(service);
        console.log('Article service initialized successfully');
      } else {
        console.log('Database not available during service initialization');
      }
    } catch (error) {
      console.error('Error initializing article service:', error);
      Alert.alert('Error', 'Failed to initialize database service');
    }
  };

  const handleCreateArticle = async () => {
    console.log('=== Create Article Flow Start ===');
    console.log('Article name:', articleName.trim());
    console.log('Quantity:', quantity);
    console.log('Selling price:', sellingPrice);
    console.log('Business ID:', business.id);
    console.log('Article service available:', !!articleService);

    if (!articleName.trim()) {
      console.log('Validation failed: No article name');
      Alert.alert('Error', 'Please enter an article name');
      return;
    }

    if (!quantity.trim()) {
      console.log('Validation failed: No quantity');
      Alert.alert('Error', 'Please enter a quantity');
      return;
    }

    if (!sellingPrice.trim()) {
      console.log('Validation failed: No selling price');
      Alert.alert('Error', 'Please enter a selling price');
      return;
    }

    const qty = parseFloat(quantity);
    const price = parseFloat(sellingPrice);

    if (isNaN(qty) || qty < 0) {
      console.log('Validation failed: Invalid quantity');
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (isNaN(price) || price < 0) {
      console.log('Validation failed: Invalid selling price');
      Alert.alert('Error', 'Please enter a valid selling price');
      return;
    }

    if (!articleService) {
      console.log('Validation failed: No article service');
      Alert.alert('Error', 'Database service not available');
      return;
    }

    try {
      console.log('Starting article creation...');
      setLoading(true);
      const result = await articleService.createArticle(
        articleName.trim(),
        qty,
        price,
        business.id,
      );
      console.log('Article creation successful:', result);
      console.log('Showing success alert...');

      Alert.alert(
        '✅ Success!',
        'Article created successfully!',
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
      console.error('Error creating article:', error);
      Alert.alert('Error', 'Failed to create article');
    } finally {
      setLoading(false);
      console.log('=== Create Article Flow End ===');
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
                <Text style={styles.label}>Article Name</Text>
                <TextInput
                  style={styles.input}
                  value={articleName}
                  onChangeText={setArticleName}
                  placeholder="Enter article name"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Enter quantity"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Selling Price</Text>
                <TextInput
                  style={styles.input}
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                  placeholder="Enter selling price"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={handleCreateArticle}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  loading && styles.createButtonDisabled,
                ]}
                onPress={handleCreateArticle}
                disabled={loading}
              >
                <Text style={styles.createButtonText}>
                  {loading ? 'Creating...' : 'Create Article'}
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

export default CreateArticleScreen;
