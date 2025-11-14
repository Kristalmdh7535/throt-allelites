import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">Throt-All Elites</h3>
        <p className="mb-4">Contact us: kristalmdhr7535@gmail.com | +977 9823141414</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-gray-300">Facebook</a>
          <a href="#" className="hover:text-gray-300">Instagram</a>
          <a href="#" className="hover:text-gray-300">Twitter</a>
        </div>
        <p className="mt-4">&copy; 2025 Throt-All Elites. All rights reserved.</p>
      </div>
    </footer>
  );
}