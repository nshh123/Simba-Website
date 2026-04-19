export interface Store {
  name: string;
  location: string;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

export interface SimbaData {
  store: Store;
  products: Product[];
}
