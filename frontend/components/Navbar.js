import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          That Line
        </Link>
    
        <div className="space-x-6">
          <Link href="/" className="text-gray-600 hover:text-sky-600 transition-colors">
            Upload
          </Link>
          <Link href="/library" className="text-gray-600 hover:text-sky-600 transition-colors">
            Library
          </Link>
        </div>
      </div>
    </nav>
  );
}