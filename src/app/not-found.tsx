import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Motorcycle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center text-center py-20">
      <Motorcycle className="w-24 h-24 text-primary" />
      <h1 className="mt-8 font-headline text-6xl font-bold">404</h1>
      <h2 className="mt-4 font-headline text-3xl font-semibold">Page Not Found</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you might have a typo in the URL.
      </p>
      <Button asChild className="mt-8 bg-accent hover:bg-accent/90">
        <Link href="/">Return to Showroom</Link>
      </Button>
    </div>
  );
}
