import Image from 'next/image';
import { getBikes } from '@/lib/motorbikes';
import Showroom from '@/components/showroom';
import { placeholderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const bikes = getBikes();
  const heroImage = placeholderImages.find(p => p.id === 'hero');

  return (
    <div>
      <section className="relative h-[60vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-shadow-lg tracking-wider">
            TorqueElite
          </h1>
          <p className="mt-4 font-body text-lg md:text-xl max-w-2xl text-shadow">
            Experience the Pinnacle of Performance and Luxury
          </p>
        </div>
      </section>

      <Showroom bikes={bikes} />
    </div>
  );
}
