import { slugify } from './utils';
import type { Motorbike, Brand, BikeType } from './types';
import { placeholderImages } from './placeholder-images';

const motorbikes: Motorbike[] = [
  {
    id: '1',
    name: 'Ducati Panigale V4',
    brand: 'Ducati',
    types: ['Sports'],
    year: 2023,
    price: 24995,
    description: 'The Panigale V4 is the essence of motorcycling evolution. A family of sports bikes that from the track to the road, through the adoption of the most sophisticated technologies, allows any rider to feel like a protagonist.',
    specs: {
      engine: '1,103 cc Desmosedici Stradale 90° V4',
      power: '215.5 hp @ 13,000 rpm',
      torque: '123.6 Nm @ 9,500 rpm',
      weight: '175 kg (dry)',
    },
    gallery: [
      { id: 'ducati-panigale-v4-1', url: placeholderImages.find(p => p.id === 'ducati-panigale-v4-1')?.imageUrl || '', hint: 'red sports motorcycle' },
      { id: 'ducati-panigale-v4-2', url: placeholderImages.find(p => p.id === 'ducati-panigale-v4-2')?.imageUrl || '', hint: 'motorcycle engine' },
      { id: 'ducati-panigale-v4-3', url: placeholderImages.find(p => p.id === 'ducati-panigale-v4-3')?.imageUrl || '', hint: 'motorcycle headlight' },
    ],
  },
  {
    id: '2',
    name: 'BMW R 1250 GS Adventure',
    brand: 'BMW',
    types: ['Adventure'],
    year: 2023,
    price: 20345,
    description: 'The world is there to be discovered. There’s always something new. The R 1250 GS is the queen of the touring enduro. It’s just made for impassable routes, adverse conditions and the most remote destinations.',
    specs: {
      engine: '1,254 cc Air/liquid-cooled twin-cylinder boxer engine',
      power: '136 hp @ 7,750 rpm',
      torque: '143 Nm @ 6,250 rpm',
      weight: '268 kg (wet)',
    },
    gallery: [
        { id: 'bmw-r1250gs-1', url: placeholderImages.find(p => p.id === 'bmw-r1250gs-1')?.imageUrl || '', hint: 'adventure motorcycle desert' },
        { id: 'bmw-r1250gs-2', url: placeholderImages.find(p => p.id === 'bmw-r1250gs-2')?.imageUrl || '', hint: 'motorcycle dashboard' },
        { id: 'bmw-r1250gs-3', url: placeholderImages.find(p => p.id === 'bmw-r1250gs-3')?.imageUrl || '', hint: 'motorcycle mountain' },
    ],
  },
  {
    id: '3',
    name: 'Harley-Davidson Fat Boy 114',
    brand: 'Harley-Davidson',
    types: ['Cruiser'],
    year: 2023,
    price: 21999,
    description: 'The original fat custom icon, now with bright chrome finishes. The Fat Boy 114 is an absolute steamroller, with its solid-disc Lakester wheels and muscular Milwaukee-Eight 114 engine.',
    specs: {
      engine: '1,868 cc Milwaukee-Eight™ 114',
      power: '94 hp @ 5,020 rpm',
      torque: '155 Nm @ 3,250 rpm',
      weight: '317 kg (wet)',
    },
    gallery: [
        { id: 'harley-fat-boy-1', url: placeholderImages.find(p => p.id === 'harley-fat-boy-1')?.imageUrl || '', hint: 'cruiser motorcycle city' },
        { id: 'harley-fat-boy-2', url: placeholderImages.find(p => p.id === 'harley-fat-boy-2')?.imageUrl || '', hint: 'chrome motorcycle engine' },
        { id: 'harley-fat-boy-3', url: placeholderImages.find(p => p.id === 'harley-fat-boy-3')?.imageUrl || '', hint: 'motorcycle rear wheel' },
    ],
  },
  {
    id: '4',
    name: 'Kawasaki Z H2',
    brand: 'Kawasaki',
    types: ['Naked'],
    year: 2023,
    price: 18500,
    description: 'The Z H2 naked supercharged machine is an exercise in sublime excess. A streetfighter that is not for the faint of heart, it combines the raw power of a supercharged engine with a nimble, responsive chassis.',
    specs: {
      engine: '998cc, 4-stroke, 4-cylinder, DOHC, liquid-cooled, supercharged',
      power: '197 hp @ 11,000 rpm',
      torque: '137 Nm @ 8,500 rpm',
      weight: '239 kg (wet)',
    },
    gallery: [
        { id: 'kawasaki-zh2-1', url: placeholderImages.find(p => p.id === 'kawasaki-zh2-1')?.imageUrl || '', hint: 'naked motorcycle green' },
        { id: 'kawasaki-zh2-2', url: placeholderImages.find(p => p.id === 'kawasaki-zh2-2')?.imageUrl || '', hint: 'motorcycle detail' },
        { id: 'kawasaki-zh2-3', url: placeholderImages.find(p => p.id === 'kawasaki-zh2-3')?.imageUrl || '', hint: 'aggressive motorcycle' },
    ],
  },
  {
    id: '5',
    name: 'Triumph Bonneville T120',
    brand: 'Triumph',
    types: ['Modern Classic'],
    year: 2023,
    price: 12695,
    description: 'The timeless style and iconic character of the original Bonneville is reborn in the classy and capable T120. A modern classic that is beautifully refined, with the performance and capability to match its name.',
    specs: {
      engine: '1200cc, liquid-cooled, 8-valve, SOHC, 270° crank angle parallel-twin',
      power: '79 hp @ 6,550 rpm',
      torque: '105 Nm @ 3,500 rpm',
      weight: '236 kg (wet)',
    },
    gallery: [
        { id: 'triumph-bonneville-1', url: placeholderImages.find(p => p.id === 'triumph-bonneville-1')?.imageUrl || '', hint: 'classic motorcycle' },
        { id: 'triumph-bonneville-2', url: placeholderImages.find(p => p.id === 'triumph-bonneville-2')?.imageUrl || '', hint: 'motorcycle fuel tank' },
        { id: 'triumph-bonneville-3', url: placeholderImages.find(p => p.id === 'triumph-bonneville-3')?.imageUrl || '', hint: 'motorcycle speedometer' },
    ],
  },
].map(bike => ({ ...bike, slug: slugify(bike.name) }));

export function getBikes(): Motorbike[] {
  return motorbikes;
}

export function getBikeBySlug(slug: string): Motorbike | undefined {
  return motorbikes.find(bike => bike.slug === slug);
}

export const brands = [...new Set(motorbikes.map(bike => bike.brand))] as Brand[];
export const types = [...new Set(motorbikes.flatMap(bike => bike.types))] as BikeType[];
