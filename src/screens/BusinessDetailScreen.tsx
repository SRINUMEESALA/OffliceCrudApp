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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { getDatabase } from '../database/database';
import { ArticleService } from '../services/articleService';
import { ArticleType } from '../models/Article';
import { BusinessType } from '../models/Business';

const BusinessDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { business } = route.params as { business: BusinessType };

  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [articleService, setArticleService] = useState<ArticleService | null>(
    null,
  );

  useEffect(() => {
    initializeService();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (articleService) {
        loadArticles();
      }
    }, [articleService]),
  );

  const initializeService = async () => {
    try {
      const database = getDatabase();
      if (database) {
        const service = new ArticleService(database);
        setArticleService(service);
      }
    } catch (error) {
      console.error('Error initializing article service:', error);
      Alert.alert('Error', 'Failed to initialize database service');
    }
  };

  const loadArticles = async () => {
    if (!articleService) return;

    try {
      setLoading(true);
      const articleList = await articleService.getArticlesByBusinessId(
        business.id,
      );
      setArticles(articleList);
    } catch (error) {
      console.error('Error loading articles:', error);
      Alert.alert('Error', 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };

  const handleDeleteArticle = (article: ArticleType) => {
    Alert.alert(
      'Delete Article',
      `Are you sure you want to delete "${article.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!articleService) return;
            try {
              await articleService.deleteArticle(article.id);
              await loadArticles();
              Alert.alert('Success', 'Article deleted successfully');
            } catch (error) {
              console.error('Error deleting article:', error);
              Alert.alert('Error', 'Failed to delete article');
            }
          },
        },
      ],
    );
  };

  const renderArticleItem = ({ item }: { item: ArticleType }) => (
    <View style={styles.articleItem}>
      <View style={styles.articleInfo}>
        <Text style={styles.articleName}>{item.name}</Text>
        <Text style={styles.articleDetails}>
          Quantity: {item.qty} | Price: ₹{item.selling_price}
        </Text>
        <Text style={styles.articleDate}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteArticle(item)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No articles found</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.businessHeader}>
        <Text style={styles.businessName}>{business.name}</Text>
        <Text style={styles.businessDate}>
          Created: {new Date(business.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.articleCount}>
          {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Articles</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('CreateArticle' as never, { business } as never)
          }
        >
          <Text style={styles.addButtonText}>+ Add Article</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={articles}
        keyExtractor={item => item.id}
        renderItem={renderArticleItem}
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
  businessHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  businessDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  articleCount: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
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
  articleItem: {
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
  articleInfo: {
    flex: 1,
  },
  articleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  articleDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  articleDate: {
    fontSize: 12,
    color: '#999',
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

export default BusinessDetailScreen;
