import Link from "next/link";
import { Motorcycle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center space-x-2 text-primary",
        className
      )}
    >
      <Motorcycle className="h-7 w-7" />
      <span className="font-headline text-2xl font-bold">TorqueElite</span>
    </Link>
  );
}
