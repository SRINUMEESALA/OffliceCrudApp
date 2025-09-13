import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'react-native-uuid';

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
      const businessesData = await AsyncStorage.getItem('businesses');
      const articlesData = await AsyncStorage.getItem('articles');

      if (businessesData) {
        this.businesses = JSON.parse(businessesData);
      }

      if (articlesData) {
        this.articles = JSON.parse(articlesData);
      }

      this.initialized = true;
    } catch (error) {
      this.initialized = true;
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem('businesses', JSON.stringify(this.businesses));
      await AsyncStorage.setItem('articles', JSON.stringify(this.articles));
    } catch (error) {
      throw new Error('Failed to save data to storage');
    }
  }

  async createBusiness(name: string): Promise<BusinessType> {
    const now = Date.now();
    const business: BusinessType = {
      id: uuidv4(),
      name,
      createdAt: now,
      updatedAt: now,
    };

    this.businesses.push(business);
    await this.saveToStorage();
    return business;
  }

  async getAllBusinesses(): Promise<BusinessType[]> {
    return [...this.businesses];
  }

  async getBusinessById(id: string): Promise<BusinessType | null> {
    return this.businesses.find(business => business.id === id) || null;
  }

  async updateBusiness(id: string, name: string): Promise<BusinessType | null> {
    const businessIndex = this.businesses.findIndex(
      business => business.id === id,
    );

    if (businessIndex === -1) {
      return null;
    }

    this.businesses[businessIndex] = {
      ...this.businesses[businessIndex],
      name,
      updatedAt: Date.now(),
    };

    await this.saveToStorage();
    return this.businesses[businessIndex];
  }

  async deleteBusiness(id: string): Promise<boolean> {
    const businessIndex = this.businesses.findIndex(
      business => business.id === id,
    );

    if (businessIndex === -1) {
      return false;
    }

    this.businesses.splice(businessIndex, 1);

    this.articles = this.articles.filter(article => article.business_id !== id);

    await this.saveToStorage();
    return true;
  }

  async createArticle(
    name: string,
    qty: number,
    selling_price: number,
    business_id: string,
  ): Promise<ArticleType> {
    const now = Date.now();
    const article: ArticleType = {
      id: uuidv4(),
      name,
      qty,
      selling_price,
      business_id,
      createdAt: now,
      updatedAt: now,
    };

    this.articles.push(article);
    await this.saveToStorage();
    return article;
  }

  async getArticlesByBusinessId(business_id: string): Promise<ArticleType[]> {
    return this.articles.filter(article => article.business_id === business_id);
  }

  async getAllArticles(): Promise<ArticleType[]> {
    return [...this.articles];
  }

  async getArticleById(id: string): Promise<ArticleType | null> {
    return this.articles.find(article => article.id === id) || null;
  }

  async updateArticle(
    id: string,
    name: string,
    qty: number,
    selling_price: number,
  ): Promise<ArticleType | null> {
    const articleIndex = this.articles.findIndex(article => article.id === id);

    if (articleIndex === -1) {
      return null;
    }

    this.articles[articleIndex] = {
      ...this.articles[articleIndex],
      name,
      qty,
      selling_price,
      updatedAt: Date.now(),
    };

    await this.saveToStorage();
    return this.articles[articleIndex];
  }

  async deleteArticle(id: string): Promise<boolean> {
    const articleIndex = this.articles.findIndex(article => article.id === id);

    if (articleIndex === -1) {
      return false;
    }

    this.articles.splice(articleIndex, 1);
    await this.saveToStorage();
    return true;
  }
}

const simpleDatabase = new SimpleDatabase();
export default simpleDatabase;
