import Dexie, { Table } from 'dexie';

export interface Pet {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  slug?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  slug?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Metadata {
  id: string; // 'pets' or 'products'
  lastUpdated: number;
  version: number;
}

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
