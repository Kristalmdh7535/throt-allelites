import { Bike } from '../interfaces/Bike';

interface BikeCardProps {
  bike: Bike;
}

export default function BikeCard({ bike }: BikeCardProps) {
  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-lg bg-white text-gray-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
        {bike.type}
      </div>
      <div className="overflow-hidden">
        <img src={bike.imageUrl} alt={bike.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{bike.name}</h3>
        <p className="text-gray-600">{bike.brand}</p>
        <p className="text-2xl font-bold mt-4 text-right text-red-600">${bike.price.toLocaleString()}</p>
      </div>
    </div>
  );
}