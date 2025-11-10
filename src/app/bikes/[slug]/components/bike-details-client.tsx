'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface BikeDetailsClientProps {
  gallery: { id: string, url: string; hint: string }[];
  bikeName: string;
}

export default function BikeDetailsClient({ gallery, bikeName }: BikeDetailsClientProps) {
  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <CarouselContent>
          {gallery.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <CardContent className="p-0 aspect-[4/3] relative">
                  <Image
                    src={image.url}
                    alt={`${bikeName} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
                    data-ai-hint={image.hint}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
        <Link href={`/contact?bike=${encodeURIComponent(bikeName)}`}>
          <Mail className="mr-2 h-5 w-5" />
          Request Info
        </Link>
      </Button>
    </div>
  );
}
