'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterControlsProps {
  brands: string[];
  types: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

export default function FilterControls({
  brands,
  types,
  selectedBrands,
  setSelectedBrands,
  selectedTypes,
  setSelectedTypes,
}: FilterControlsProps) {

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter(b => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(
      selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type]
    );
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-bold mb-3">Brand</h3>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="font-normal cursor-pointer">{brand}</Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="font-bold mb-3">Type</h3>
          <div className="space-y-2">
            {types.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeChange(type)}
                />
                <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">{type}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
