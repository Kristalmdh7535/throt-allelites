import { Facebook, Twitter, Instagram } from 'lucide-react';
import Logo from './logo';
import { Button } from './ui/button';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Experience the Pinnacle of Performance and Luxury.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Showroom</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#"><Facebook className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#"><Twitter className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#"><Instagram className="h-5 w-5" /></a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TorqueElite. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
