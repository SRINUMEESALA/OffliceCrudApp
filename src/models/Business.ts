import { RxJsonSchema } from 'rxdb';

export const businessSchema: RxJsonSchema = {
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
    createdAt: {
      type: 'number',
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: ['id', 'name', 'createdAt', 'updatedAt'],
  indexes: ['name'],
};

export type BusinessType = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};
