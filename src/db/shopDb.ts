import Dexie, { Table } from 'dexie';
import { Pet, Product, Metadata } from '../types';

export class ShopDatabase extends Dexie {
  pets!: Table<Pet>;
  products!: Table<Product>;
  metadata!: Table<Metadata>;

  constructor() {
    super('K9ShopDB');
    this.version(2).stores({
      pets: 'id, name, slug, category, price, updatedAt, lastAccessed',
      products: 'id, name, slug, category, price, updatedAt, lastAccessed',
      metadata: 'id'
    });
  }
}

export const shopDb = new ShopDatabase();
