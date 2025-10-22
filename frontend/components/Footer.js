import Link from 'next/link';
import { Github, Twitter, Mail, Film, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Film className="w-6 h-6" />
              <span className="text-xl font-bold">That Line</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Find any movie dialogue instantly with semantic search. Upload subtitles and search naturally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a 
                href="https://github.com/shivasaireddyp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/shivasaipalnati/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:shivasaireddyp@gmail.com"
                className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} That Line. All rights reserved. @shivasaireddyp
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-500 hover:text-emerald-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/" className="text-slate-500 hover:text-emerald-400 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}