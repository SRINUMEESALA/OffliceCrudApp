// Crypto polyfill must be imported first
import 'react-native-get-random-values';
import { getRandomValues } from 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

// Set up crypto polyfill for React Native
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues,
    subtle: {
      digest: async (algorithm: string, data: Uint8Array) => {
        const wordArray = CryptoJS.lib.WordArray.create(data);
        const hash = CryptoJS.SHA256(wordArray);
        return new Uint8Array(hash.sigBytes);
      },
    },
  } as any;
}

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import BusinessListScreen from './src/screens/BusinessListScreen';
import BusinessDetailScreen from './src/screens/BusinessDetailScreen';
import CreateBusinessScreen from './src/screens/CreateBusinessScreen';
import CreateArticleScreen from './src/screens/CreateArticleScreen';

// Import database
import { createDatabase, getDatabase } from './src/database/database';

const Stack = createStackNavigator();

const App = (): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');

      // Create database
      const database = await createDatabase();
      console.log('Database created successfully');

      // Database is ready for CRUD operations
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Database...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Business Manager' }}
          />
          <Stack.Screen
            name="BusinessList"
            component={BusinessListScreen}
            options={{ title: 'Businesses' }}
          />
          <Stack.Screen
            name="BusinessDetail"
            component={BusinessDetailScreen}
            options={{ title: 'Business Details' }}
          />
          <Stack.Screen
            name="CreateBusiness"
            component={CreateBusinessScreen}
            options={{ title: 'Create Business' }}
          />
          <Stack.Screen
            name="CreateArticle"
            component={CreateArticleScreen}
            options={{ title: 'Create Article' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default App;
