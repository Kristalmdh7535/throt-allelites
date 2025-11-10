'use client';

import { useState, useMemo } from 'react';
import type { Motorbike } from '@/lib/types';
import BikeCard from '@/components/bike-card';
import FilterControls from '@/components/filter-controls';
import { brands, types } from '@/lib/motorbikes';

export default function Showroom({ bikes }: { bikes: Motorbike[] }) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(bike.brand);
      const typeMatch = selectedTypes.length === 0 || bike.types.some(type => selectedTypes.includes(type));
      return brandMatch && typeMatch;
    });
  }, [bikes, selectedBrands, selectedTypes]);

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <FilterControls
            brands={brands}
            types={types}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />
        </aside>
        <div className="md:col-span-3">
          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBikes.map(bike => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <h3 className="font-headline text-2xl">No Matches Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find your perfect ride.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
