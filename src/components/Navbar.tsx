import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-accent rounded-lg group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">UP2FLY</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-white/70 hover:text-accent transition-colors">Buy USDT</Link>
            <a href="#features" className="text-sm font-medium text-white/70 hover:text-accent transition-colors">Features</a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <w3m-button />
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block text-lg font-bold uppercase tracking-tight text-white/70 hover:text-accent"
          >
            Buy USDT
          </Link>
          <a 
            href="#features" 
            onClick={() => setIsOpen(false)}
            className="block text-lg font-bold uppercase tracking-tight text-white/70 hover:text-accent"
          >
            Features
          </a>
          <div className="pt-4 border-t border-white/5">
            <w3m-button />
          </div>
        </div>
      )}
    </nav>
  );
}
