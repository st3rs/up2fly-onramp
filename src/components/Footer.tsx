import { Link } from 'react-router-dom';
import { Rocket, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Rocket className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold tracking-tighter uppercase">UP2FLY</span>
            </Link>
            <p className="text-white/50 text-sm max-w-xs">
              The fastest and most secure way to buy USDT with your credit card. Instant delivery to your TRC20 wallet.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-white/50 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/50 hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="/up2fly-secure-admin" className="text-sm text-white/50 hover:text-accent transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Support</h3>
            <div className="flex items-center space-x-2 text-sm text-white/50">
              <Mail className="w-4 h-4" />
              <a href="mailto:ops@up2fly.net" className="hover:text-accent transition-colors">ops@up2fly.net</a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} UP2FLY. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-xs text-white/30">Thailand Governing Law</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
