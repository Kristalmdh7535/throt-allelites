export type Brand = 'Ducati' | 'BMW' | 'Harley-Davidson' | 'Kawasaki' | 'Triumph';
export type BikeType = 'Sports' | 'Adventure' | 'Cruiser' | 'Naked' | 'Modern Classic';

export interface Motorbike {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  types: BikeType[];
  year: number;
  price: number;
  description: string;
  specs: {
    engine: string;
    power: string;
    torque: string;
    weight: string;
  };
  gallery: {
    id: string,
    url: string;
    hint: string;
  }[];
}
