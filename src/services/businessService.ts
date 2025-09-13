import { Database } from '../database/database';
import { BusinessType } from '../models/Business';
import { map } from 'rxjs/operators';

// Simple ID generator for React Native
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export class BusinessService {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  // Create a new business
  async createBusiness(name: string): Promise<BusinessType> {
    try {
      console.log('BusinessService: Starting business creation for:', name);
      const now = Date.now();
      const business: BusinessType = {
        id: generateId(),
        name,
        createdAt: now,
        updatedAt: now,
      };

      console.log('BusinessService: About to insert business:', business);
      await this.database.businesses.insert(business);
      console.log('BusinessService: Business inserted successfully:', business);
      return business;
    } catch (error) {
      console.error('BusinessService: Error creating business:', error);
      throw error;
    }
  }

  // Get all businesses
  async getAllBusinesses(): Promise<BusinessType[]> {
    try {
      const businesses = await this.database.businesses.find().exec();
      return businesses.map((business: any) => business.toJSON());
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  }

  // Get business by ID
  async getBusinessById(id: string): Promise<BusinessType | null> {
    try {
      const business = await this.database.businesses
        .findOne({
          selector: { id },
        })
        .exec();

      return business ? business.toJSON() : null;
    } catch (error) {
      console.error('Error fetching business by ID:', error);
      throw error;
    }
  }

  // Update business
  async updateBusiness(id: string, name: string): Promise<BusinessType | null> {
    try {
      const business = await this.database.businesses
        .findOne({
          selector: { id },
        })
        .exec();

      if (business) {
        await business.patch({
          name,
          updatedAt: Date.now(),
        });
        return business.toJSON();
      }
      return null;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  // Delete business
  async deleteBusiness(id: string): Promise<boolean> {
    try {
      const business = await this.database.businesses
        .findOne({
          selector: { id },
        })
        .exec();

      if (business) {
        await business.remove();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  }

  // Subscribe to businesses changes
  subscribeToBusinesses() {
    return this.database.businesses.find().$.pipe(
      // Convert RxDocument to plain object
      map((businesses: any) =>
        businesses.map((business: any) => business.toJSON()),
      ),
    );
  }
}
