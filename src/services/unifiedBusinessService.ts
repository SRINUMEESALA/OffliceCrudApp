import { Database } from '../database/database';
import { BusinessType } from '../models/Business';
import simpleDatabase from '../database/simpleDatabase';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export class UnifiedBusinessService {
  private rxdbDatabase: Database | null = null;
  private useRxDB = false;

  constructor(database?: Database) {
    this.rxdbDatabase = database || null;
    this.useRxDB = !!this.rxdbDatabase && !!this.rxdbDatabase.businesses;
  }

  async createBusiness(name: string): Promise<BusinessType> {
    if (this.useRxDB && this.rxdbDatabase) {
      const now = Date.now();
      const business: BusinessType = {
        id: generateId(),
        name,
        createdAt: now,
        updatedAt: now,
      };

      await this.rxdbDatabase.businesses.insert(business);
      return business;
    } else {
      return await simpleDatabase.createBusiness(name);
    }
  }

  async getAllBusinesses(): Promise<BusinessType[]> {
    if (this.useRxDB && this.rxdbDatabase) {
      const businesses = await this.rxdbDatabase.businesses.find().exec();
      return businesses.map((business: any) => business.toJSON());
    } else {
      return await simpleDatabase.getAllBusinesses();
    }
  }

  async getBusinessById(id: string): Promise<BusinessType | null> {
    if (this.useRxDB && this.rxdbDatabase) {
      const business = await this.rxdbDatabase.businesses.findOne(id).exec();
      return business ? business.toJSON() : null;
    } else {
      return await simpleDatabase.getBusinessById(id);
    }
  }

  async updateBusiness(id: string, name: string): Promise<BusinessType | null> {
    if (this.useRxDB && this.rxdbDatabase) {
      const business = await this.rxdbDatabase.businesses.findOne(id).exec();
      if (business) {
        business.name = name;
        business.updatedAt = Date.now();
        await business.save();
        return business.toJSON();
      }
      return null;
    } else {
      return await simpleDatabase.updateBusiness(id, name);
    }
  }

  async deleteBusiness(id: string): Promise<boolean> {
    if (this.useRxDB && this.rxdbDatabase) {
      const business = await this.rxdbDatabase.businesses.findOne(id).exec();
      if (business) {
        await business.remove();
        return true;
      }
      return false;
    } else {
      return await simpleDatabase.deleteBusiness(id);
    }
  }

  getDatabaseType(): string {
    return this.useRxDB ? 'RxDB' : 'Simple';
  }
}
