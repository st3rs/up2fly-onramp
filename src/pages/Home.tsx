import { motion } from 'motion/react';
import { Shield, Zap, CreditCard, CheckCircle2 } from 'lucide-react';
import BuyCard from '../components/BuyCard';

export default function Home() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Secure",
      description: "Bank-grade security with 256-bit SSL encryption and PCI compliance."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Instant",
      description: "USDT delivered to your wallet within minutes of payment confirmation."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-accent" />,
      title: "Visa/Mastercard",
      description: "Support for all major credit and debit cards worldwide."
    }
  ];

  const steps = [
    { number: "01", title: "Enter Amount", description: "Choose how much USD you want to spend." },
    { number: "02", title: "Wallet Address", description: "Provide your TRC20 USDT wallet address." },
    { number: "03", title: "Verify & Pay", description: "Complete a quick KYC and pay with your card." },
    { number: "04", title: "Receive USDT", description: "USDT is sent instantly to your wallet." }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">On-Ramp Solution</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="text-xs font-medium text-white/50">v2.4.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
              Buy USDT <br />
              <span className="text-accent">Instantly</span> With <br />
              Your Card.
            </h1>
            <p className="text-lg text-white/60 max-w-lg mb-10 leading-relaxed">
              UP2FLY provides a seamless bridge between fiat and crypto. No complex exchanges, no long waits. Just pure, instant liquidity.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-white/80">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-white/80">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Global Support</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01] 
            }}
          >
            <BuyCard />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4">How It Works</h2>
            <p className="text-white/50 max-w-xl mx-auto">Four simple steps to get USDT into your wallet.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-black text-white/[0.03] absolute -top-8 -left-4 group-hover:text-accent/[0.05] transition-colors">
                  {s.number}
                </div>
                <div className="relative z-10 space-y-2">
                  <h4 className="text-lg font-bold uppercase tracking-tight">{s.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
