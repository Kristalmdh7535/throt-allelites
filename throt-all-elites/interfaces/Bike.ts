export interface Bike {
  id: number;
  name: string;
  brand: string;
  type: string;
  price: number;
  imageUrl: string;
  specifications: Record<string, string>;
}