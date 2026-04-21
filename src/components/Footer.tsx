import { Link } from 'react-router-dom';
import { Rocket, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Footer() {
  const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", alt: "Visa", h: "h-6 md:h-8" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", alt: "Mastercard", h: "h-10 md:h-14" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg", alt: "AMEX", h: "h-10 md:h-14" },
    { src: "https://cryptologos.cc/logos/tether-usdt-logo.svg", alt: "USDT", h: "h-10 md:h-14" }
  ];

  return (
    <footer className="border-t border-white/10 bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="w-8 h-8 text-accent" />
              <span className="text-2xl font-black tracking-tighter uppercase text-white">UP2FLY</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Empowering global commerce with secure, high-speed USDT payment infrastructure. Seamlessly bridging fiat and the digital future.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white/50">Navigator</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-medium text-white/40 hover:text-accent transition-all duration-300">Home</Link></li>
              <li><a href="#features" className="text-sm font-medium text-white/40 hover:text-accent transition-all duration-300">Features</a></li>
              <li><Link to="/up2fly-secure-admin" className="text-sm font-medium text-white/40 hover:text-accent transition-colors">Portal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white/50">Governance</h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm font-medium text-white/40 hover:text-accent transition-all duration-300">Privacy</Link></li>
              <li><Link to="/terms" className="text-sm font-medium text-white/40 hover:text-accent transition-all duration-300">Terms</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white/50">Contact</h3>
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Mail className="w-4 h-4 text-white/40 group-hover:text-accent" />
              </div>
              <a href="mailto:ops@up2fly.net" className="text-sm font-medium text-white/40 hover:text-accent transition-colors">ops@up2fly.net</a>
            </div>
          </div>
        </div>
        
        {/* Trust Section */}
        <div className="py-12 border-t border-white/5 bg-white/[0.01]">
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8 px-1">Institutional Partners & Network</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {logos.map((logo, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-center justify-center p-4 rounded-2xl bg-white shadow-2xl shadow-black/20 transition-all duration-500",
                    "hover:scale-105 active:scale-95 cursor-default min-w-[90px] sm:min-w-[120px] ring-1 ring-black/5"
                  )}
                >
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={cn(
                      logo.h, 
                      "object-contain filter drop-shadow-sm"
                    )} 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
              © {new Date().getFullYear()} UP2FLY Engineering
            </p>
            <div className="hidden md:block w-px h-3 bg-white/10" />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
              Jurisdiction: TH/SEA Commercial Law
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#6D28D9]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Network: Mainnet v4.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
