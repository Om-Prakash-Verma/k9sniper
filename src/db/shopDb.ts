import Dexie, { Table } from 'dexie';
import { Pet, Product, Metadata, Order, ShopSettings } from '../types';

export class ShopDatabase extends Dexie {
  pets!: Table<Pet>;
  products!: Table<Product>;
  metadata!: Table<Metadata>;
  orders!: Table<Order>;
  settings!: Table<ShopSettings & { id: string }>;

  private _failedToOpen = false;

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
    if (this._failedToOpen) return false;
    try {
      if (!this.isOpen()) {
        await this.open();
      }
      return true;
    } catch (err) {
      console.warn("IndexedDB unavailable, falling back to network-only mode:", err);
      this._failedToOpen = true;
      return false;
    }
  }

  isAvailable() {
    return this.isOpen() && !this._failedToOpen;
  }
}

export const shopDb = new ShopDatabase();
// We don't call safeOpen() at top level to avoid race conditions with React mount
