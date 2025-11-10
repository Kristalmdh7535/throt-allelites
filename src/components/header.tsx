"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Showroom" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center space-x-2 lg:space-x-4", className)}>
      {navLinks.map((link) => (
        <Button
          key={link.href}
          asChild
          variant="link"
          className={cn(
            "text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2",
            pathname === link.href && "text-primary font-bold"
          )}
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <Logo />
                <NavLinks className="flex-col items-start space-x-0 space-y-2 mt-8" />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search bar here if needed */}
          </div>
          <div className="hidden md:flex">
            <NavLinks />
          </div>
          <div className="flex md:hidden flex-1 justify-center">
             <Logo />
          </div>
        </div>
      </div>
    </header>
  );
}
