import Dexie, { Table } from 'dexie';
import { Pet, Product, Metadata, Order, ShopSettings } from '../types';

export class ShopDatabase extends Dexie {
  pets!: Table<Pet>;
  products!: Table<Product>;
  metadata!: Table<Metadata>;
  orders!: Table<Order>;
  settings!: Table<ShopSettings & { id: string }>;

  constructor() {
    super('K9ShopDB');
    this.version(3).stores({
      pets: 'id, name, slug, category, price, updatedAt, lastAccessed',
      products: 'id, name, slug, category, price, updatedAt, lastAccessed',
      metadata: 'id',
      orders: 'id, userId, status, createdAt',
      settings: 'id'
    });
  }

  async safeOpen() {
    try {
      if (!this.isOpen()) {
        await this.open();
      }
    } catch (err) {
      console.error("Failed to open Dexie database:", err);
      // If it fails, we might be in a restricted iframe.
      // We don't throw here to allow the app to continue, 
      // but subsequent DB operations will fail.
    }
  }
}

export const shopDb = new ShopDatabase();
shopDb.safeOpen();
