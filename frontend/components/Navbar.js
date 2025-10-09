import Link from 'next/link';
import { Film } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black backdrop-blur-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white hover:text-violet-400 transition-colors">
            <Film className="w-6 h-6" />
            <span className="text-xl font-bold">That Line</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/library" 
              className="text-slate-400 hover:text-white transition-colors font-medium"
            >
              Library
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}