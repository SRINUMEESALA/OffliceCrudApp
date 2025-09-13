import './src/polyfills/crypto-polyfill';

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

import HomeScreen from './src/screens/HomeScreen';
import BusinessListScreen from './src/screens/BusinessListScreen';
import BusinessDetailScreen from './src/screens/BusinessDetailScreen';
import CreateBusinessScreen from './src/screens/CreateBusinessScreen';
import CreateArticleScreen from './src/screens/CreateArticleScreen';

import { createDatabase } from './src/database/database';
import simpleDatabase from './src/database/simpleDatabase';
import { setupReplication } from './src/services/replication';

const Stack = createStackNavigator();

const App = (): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      try {
        const database = await createDatabase();
        try {
          await setupReplication(database);
        } catch (replicationError) {
          // Continue without replication if setup fails
        }
      } catch (rxdbError) {
        await simpleDatabase.initialize();
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#e1e1e1',
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Offline CRUD App' }}
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
    color: '#666666',
  },
});

export default App;
