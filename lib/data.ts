import simbaData from '../data/simba_products.json';
import { Product, SimbaData } from '../types';

const typedData = simbaData as SimbaData;

export function getProducts(): Product[] {
  return typedData.products;
}

export function getCategories(): string[] {
  const categories = typedData.products.map(p => p.category);
  return Array.from(new Set(categories));
}
