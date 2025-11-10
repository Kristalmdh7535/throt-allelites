import { getBikeBySlug, getBikes } from '@/lib/motorbikes';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import BikeDetailsClient from './components/bike-details-client';
import { Separator } from '@/components/ui/separator';

type BikePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const bikes = getBikes();
  return bikes.map(bike => ({
    slug: bike.slug,
  }));
}

export default async function BikePage({ params }: BikePageProps) {
  const bike = getBikeBySlug(params.slug);

  if (!bike) {
    notFound();
  }

  const specs = [
    { label: 'Engine', value: bike.specs.engine },
    { label: 'Power', value: bike.specs.power },
    { label: 'Torque', value: bike.specs.torque },
    { label: 'Dry Weight', value: bike.specs.weight },
    { label: 'Model Year', value: bike.year.toString() },
  ];

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <BikeDetailsClient gallery={bike.gallery} bikeName={bike.name} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit">{bike.brand}</Badge>
              <CardTitle className="font-headline text-4xl mt-2">{bike.name}</CardTitle>
              <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(bike.price)}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{bike.description}</p>
              <Separator className="my-6" />
              <h3 className="font-headline text-xl font-semibold mb-4">Specifications</h3>
              <ul className="space-y-2 text-sm">
                {specs.map(spec => (
                  <li key={spec.label} className="flex justify-between">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium text-right">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
