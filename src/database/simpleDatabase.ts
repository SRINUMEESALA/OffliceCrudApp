import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'react-native-uuid';

// Simple in-memory database with AsyncStorage persistence
export type BusinessType = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type ArticleType = {
  id: string;
  name: string;
  qty: number;
  selling_price: number;
  business_id: string;
  createdAt: number;
  updatedAt: number;
};

class SimpleDatabase {
  private businesses: BusinessType[] = [];
  private articles: ArticleType[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load data from AsyncStorage
      const businessesData = await AsyncStorage.getItem('businesses');
      const articlesData = await AsyncStorage.getItem('articles');

      if (businessesData) {
        this.businesses = JSON.parse(businessesData);
      }

      if (articlesData) {
        this.articles = JSON.parse(articlesData);
      }

      this.initialized = true;
      console.log('Simple database initialized successfully');
    } catch (error) {
      console.error('Error initializing simple database:', error);
      this.initialized = true; // Continue anyway
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem('businesses', JSON.stringify(this.businesses));
      await AsyncStorage.setItem('articles', JSON.stringify(this.articles));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Business operations
  async createBusiness(name: string): Promise<BusinessType> {
    const business: BusinessType = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.businesses.push(business);
    await this.saveToStorage();
    return business;
  }

  async getAllBusinesses(): Promise<BusinessType[]> {
    return [...this.businesses];
  }

  async getBusinessById(id: string): Promise<BusinessType | null> {
    return this.businesses.find(b => b.id === id) || null;
  }

  async updateBusiness(id: string, name: string): Promise<BusinessType | null> {
    const business = this.businesses.find(b => b.id === id);
    if (business) {
      business.name = name;
      business.updatedAt = Date.now();
      await this.saveToStorage();
      return business;
    }
    return null;
  }

  async deleteBusiness(id: string): Promise<boolean> {
    const index = this.businesses.findIndex(b => b.id === id);
    if (index !== -1) {
      this.businesses.splice(index, 1);
      // Also delete related articles
      this.articles = this.articles.filter(a => a.business_id !== id);
      await this.saveToStorage();
      return true;
    }
    return false;
  }

  // Article operations
  async createArticle(
    name: string,
    qty: number,
    selling_price: number,
    business_id: string,
  ): Promise<ArticleType> {
    const article: ArticleType = {
      id: uuidv4(),
      name,
      qty,
      selling_price,
      business_id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.articles.push(article);
    await this.saveToStorage();
    return article;
  }

  async getAllArticles(): Promise<ArticleType[]> {
    return [...this.articles];
  }

  async getArticlesByBusinessId(business_id: string): Promise<ArticleType[]> {
    return this.articles.filter(a => a.business_id === business_id);
  }

  async getArticleById(id: string): Promise<ArticleType | null> {
    return this.articles.find(a => a.id === id) || null;
  }

  async updateArticle(
    id: string,
    name: string,
    qty: number,
    selling_price: number,
  ): Promise<ArticleType | null> {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      article.name = name;
      article.qty = qty;
      article.selling_price = selling_price;
      article.updatedAt = Date.now();
      await this.saveToStorage();
      return article;
    }
    return null;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const index = this.articles.findIndex(a => a.id === id);
    if (index !== -1) {
      this.articles.splice(index, 1);
      await this.saveToStorage();
      return true;
    }
    return false;
  }
}

// Singleton instance
const simpleDatabase = new SimpleDatabase();

export default simpleDatabase;
