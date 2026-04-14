export interface ProductImage{
  id: number;
  imageUrl: string;
  primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;
  dimensionMmLWH: string;
  engineCapacityCc: number;
  engineType: string;
  maxPower: string;
  maxTorque: string;
  mileageKmpl: string | null;
  topSpeedKmph: string | null;
  gearbox: string | null;
  clutchType: string | null;
  frontBrake: string | null;
  rearBrake: string | null;
  frontSuspension: string | null;
  rearSuspension: string | null;
  frontTyre: string | null;
  rearTyre: string | null;
  tyreType: string | null;
  fuelTankCapacityL: string | null;
  seatHeightMm: string | null;
  groundClearanceMm: string | null;
  kerbWeightKg: string | null;
  stock: number;
  price: number;
  active: boolean;
  images: ProductImage[];
}