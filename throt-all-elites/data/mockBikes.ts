import { Bike } from '../interfaces/Bike';

export const mockBikes: Bike[] = [
  {
    id: 1,
    name: 'Panigale V4',
    brand: 'Ducati',
    type: 'Sport',
    price: 32000,
    imageUrl: '/images/panigale-v4.jpg',
    specifications: {
      Engine: '1,103 cc Desmosedici Stradale V4',
      Power: '215.5 hp',
    },
  },
  {
    id: 2,
    name: 'S 1000 RR',
    brand: 'BMW',
    type: 'Sport',
    price: 17000,
    imageUrl: '/images/s1000rr.jpg',
    specifications: {
      Engine: '999 cc 4-cylinder',
      Power: '205 hp',
    },
  },
  {
    id: 3,
    name: 'Brutale 1000 RR',
    brand: 'MV Agusta',
    type: 'Naked',
    price: 34000,
    imageUrl: '/images/brutale-1000rr.jpg',
    specifications: {
      Engine: '998 cc 4-cylinder',
      Power: '208 hp',
    },
  },
  {
    id: 4,
    name: 'YZF-R1',
    brand: 'Yamaha',
    type: 'Sport',
    price: 17500,
    imageUrl: '/images/yzf-r1.jpg',
    specifications: {
      Engine: '998 cc crossplane 4-cylinder',
      Power: '197 hp',
    },
  },
  {
    id: 5,
    name: 'RSV4 Factory',
    brand: 'Aprilia',
    type: 'Sport',
    price: 25000,
    imageUrl: '/images/rsv4-factory.jpg',
    specifications: {
      Engine: '1,099 cc V4',
      Power: '217 hp',
    },
  },
  {
    id: 6,
    name: 'GSX-R1000R',
    brand: 'Suzuki',
    type: 'Sport',
    price: 18000,
    imageUrl: '/images/gsx-r1000r.jpg',
    specifications: {
      Engine: '999.8 cc 4-cylinder',
      Power: '199 hp',
    },
  },
  {
    id: 7,
    name: 'Ninja H2',
    brand: 'Kawasaki',
    type: 'Sport',
    price: 30000,
    imageUrl: '/images/ninja-h2.jpg',
    specifications: {
      Engine: '998 cc supercharged 4-cylinder',
      Power: '228 hp',
    },
  },
  {
    id: 8,
    name: 'CBR1000RR-R Fireblade SP',
    brand: 'Honda',
    type: 'Sport',
    price: 28500,
    imageUrl: '/images/cbr1000rr-r.jpg',
    specifications: {
      Engine: '1000 cc 4-cylinder',
      Power: '215 hp',
    },
  },
];