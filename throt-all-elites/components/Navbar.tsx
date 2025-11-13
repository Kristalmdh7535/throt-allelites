import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-throt-dark-red text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/images/motorbike.jpg" 
            alt="Throt-All Elites Logo"
            className="h-10 w-10 rounded-full object-cover" 
          />
          <span className="text-2xl font-bold text-yellow-300">Throt-All Elites</span> {/* Original color */}
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link href="/bikes" className="hover:text-gray-300">Bikes</Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">About</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}