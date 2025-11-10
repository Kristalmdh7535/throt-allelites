import Image from 'next/image';
import Link from 'next/link';
import type { Motorbike } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function BikeCard({ bike }: { bike: Motorbike }) {
  const firstImage = bike.gallery[0];
  
  return (
    <Link href={`/bikes/${bike.slug}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
             {firstImage && (
              <Image
                src={firstImage.url}
                alt={bike.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                data-ai-hint={firstImage.hint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary">{bike.brand}</Badge>
          <CardTitle className="mt-2 font-headline text-2xl leading-tight">
            {bike.name}
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-lg font-bold text-primary">{formatCurrency(bike.price)}</p>
          <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-semibold">Details</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
