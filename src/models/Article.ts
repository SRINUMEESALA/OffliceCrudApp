import { RxJsonSchema } from 'rxdb';

export const articleSchema: RxJsonSchema = {
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
    qty: {
      type: 'number',
    },
    selling_price: {
      type: 'number',
    },
    business_id: {
      type: 'string',
      maxLength: 100,
    },
    createdAt: {
      type: 'number',
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: [
    'id',
    'name',
    'qty',
    'selling_price',
    'business_id',
    'createdAt',
    'updatedAt',
  ],
  indexes: ['name', 'business_id'],
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
