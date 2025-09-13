import { Database } from '../database/database';
import { ArticleType } from '../models/Article';
import { map } from 'rxjs/operators';

// Simple ID generator for React Native
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export class ArticleService {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  // Create a new article
  async createArticle(
    name: string,
    qty: number,
    selling_price: number,
    business_id: string,
  ): Promise<ArticleType> {
    try {
      const now = Date.now();
      const article: ArticleType = {
        id: generateId(),
        name,
        qty,
        selling_price,
        business_id,
        createdAt: now,
        updatedAt: now,
      };

      await this.database.articles.insert(article);
      console.log('Article created:', article);
      return article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // Get all articles
  async getAllArticles(): Promise<ArticleType[]> {
    try {
      const articles = await this.database.articles.find().exec();
      return articles.map(article => article.toJSON());
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  // Get articles by business ID
  async getArticlesByBusinessId(business_id: string): Promise<ArticleType[]> {
    try {
      const articles = await this.database.articles
        .find({
          selector: { business_id },
        })
        .sort({ createdAt: 'desc' })
        .exec();
      return articles.map(article => article.toJSON());
    } catch (error) {
      console.error('Error fetching articles by business ID:', error);
      throw error;
    }
  }

  // Get article by ID
  async getArticleById(id: string): Promise<ArticleType | null> {
    try {
      const article = await this.database.articles
        .findOne({
          selector: { id },
        })
        .exec();

      return article ? article.toJSON() : null;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
  }

  // Update article
  async updateArticle(
    id: string,
    name: string,
    qty: number,
    selling_price: number,
  ): Promise<ArticleType | null> {
    try {
      const article = await this.database.articles
        .findOne({
          selector: { id },
        })
        .exec();

      if (article) {
        await article.patch({
          name,
          qty,
          selling_price,
          updatedAt: Date.now(),
        });
        return article.toJSON();
      }
      return null;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const article = await this.database.articles
        .findOne({
          selector: { id },
        })
        .exec();

      if (article) {
        await article.remove();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  // Subscribe to articles changes
  subscribeToArticles() {
    return this.database.articles
      .find()
      .$.pipe(map(articles => articles.map(article => article.toJSON())));
  }

  // Subscribe to articles by business ID
  subscribeToArticlesByBusinessId(business_id: string) {
    return this.database.articles
      .find({
        selector: { business_id },
      })
      .sort({ createdAt: 'desc' })
      .$.pipe(map(articles => articles.map(article => article.toJSON())));
  }
}
