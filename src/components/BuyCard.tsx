import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Info, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'motion/react';

export default function BuyCard() {
  const { address, isConnected } = useAccount();
  const [usdAmount, setUsdAmount] = useState<string>('100');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [usdError, setUsdError] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [usdtPrice, setUsdtPrice] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [markup, setMarkup] = useState(3.5); // Default 3.5%
  const [minAmount, setMinAmount] = useState(10); // Default $10
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setPriceError(null);
        const response = await axios.get('/api/price');
        if (response.data && response.data.price) {
          setUsdtPrice(response.data.price);
        } else {
          throw new Error('Invalid price data');
        }
      } catch (error: any) {
        console.error('Error fetching price:', error);
        const msg = error.response?.data?.message || 'Failed to update live price. Using fallback.';
        setPriceError(msg);
        // Fallback to 1.00 if API fails
        setUsdtPrice(1.00);
      } finally {
        setLoading(false);
      }
    };

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('up2fly_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setMarkup(parseFloat(settings.markup) || 3.5);
      setMinAmount(parseFloat(settings.minAmount) || 10);
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const amount = parseFloat(usdAmount) || 0;
  const fee = amount * (markup / 100);
  const netAmount = amount - fee;
  const usdtToReceive = netAmount / usdtPrice;

  const validateUsd = (val: string) => {
    if (!val) return "Amount is required";
    const num = parseFloat(val);
    if (isNaN(num)) return "Invalid amount";
    if (num < minAmount) return `Minimum purchase is $${minAmount} USD`;
    if (num > 20000) return "Maximum purchase is $20,000 USD";
    return null;
  };

  const validateWallet = (val: string) => {
    if (!val) return "Wallet address is required";
    // TRC20 Regex: Starts with T, 34 chars, alphanumeric
    const trc20Regex = /^T[A-Za-z1-9]{33}$/;
    if (!trc20Regex.test(val)) return "Invalid TRC20 wallet address";
    return null;
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsdAmount(val);
    setUsdError(validateUsd(val));
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWalletAddress(val);
    setWalletError(validateWallet(val));
  };

  const handlePay = () => {
    const uErr = validateUsd(usdAmount);
    const wErr = validateWallet(walletAddress);
    
    setUsdError(uErr);
    setWalletError(wErr);

    if (uErr || wErr) return;
    setShowModal(true);
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    // Create order in Supabase
    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            amount: amount,
            usdt_amount: usdtToReceive,
            wallet_address: walletAddress,
            status: 'Processing'
          }
        ]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating order:', error);
    }

    // Paybis widget URL logic
    const partnerId = JSON.parse(localStorage.getItem('up2fly_settings') || '{}').partnerUuid || 'YOUR_PARTNER_UUID';
    const paybisUrl = `https://widget.paybis.com/?partnerId=${partnerId}&cryptoAmount=${usdtToReceive.toFixed(2)}&cryptoCurrency=USDT&fiatCurrency=USD&fiatAmount=${usdAmount}&address=${walletAddress}`;
    
    // Use window.location.href instead of window.open to avoid pop-up blockers
    setTimeout(() => {
      window.location.href = paybisUrl;
      setIsProcessing(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card rounded-3xl p-6 md:p-8 w-full max-w-md mx-auto accent-glow"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold uppercase tracking-tight">Buy USDT</h2>
            <img 
              src="https://cryptologos.cc/logos/tether-usdt-logo.svg" 
              alt="USDT" 
              className="w-6 h-6"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <div className={cn("w-2 h-2 rounded-full", priceError ? "bg-red-400" : "bg-accent animate-pulse")} />
              <span className="text-[10px] font-mono font-bold text-accent uppercase">
                {priceError ? "Price Offline" : `Live Price: $${usdtPrice.toFixed(4)}`}
              </span>
            </div>
            {priceError && (
              <span className="text-[8px] font-bold text-red-400 uppercase mt-1 tracking-tighter">
                {priceError}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* USD Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-white/50 ml-1">You Pay (USD)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <CreditCard className="w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="number"
                value={usdAmount}
                onChange={handleUsdChange}
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-xl font-bold focus:outline-none transition-all",
                  usdError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                )}
                placeholder="0.00"
              />
            </div>
            {usdError && (
              <p className="text-[10px] font-bold text-red-400 uppercase ml-1">
                {usdError}
              </p>
            )}
          </div>

          {/* Wallet Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-white/50 ml-1">TRC20 Wallet Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Wallet className="w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                value={walletAddress}
                onChange={handleWalletChange}
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-mono focus:outline-none transition-all",
                  walletError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                )}
                placeholder="T..."
              />
            </div>
            {walletError && (
              <p className="text-[10px] font-bold text-red-400 uppercase ml-1">
                {walletError}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Exchange Rate</span>
              <span className="font-mono">1 USDT = ${usdtPrice.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50 flex items-center">
                Service Fee ({markup}%)
                <Info className="w-3 h-3 ml-1 opacity-30" />
              </span>
              <span className="font-mono text-red-400">-${fee.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between items-end">
              <span className="text-xs font-bold uppercase text-white/50">You Receive</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-accent">{usdtToReceive.toFixed(2)}</span>
                <span className="text-sm font-bold text-accent ml-1">USDT</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={!!usdError || !!walletError || !usdAmount || !walletAddress}
            className="w-full bg-accent text-accent-foreground py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span>Pay with Card</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-2 flex flex-col items-center">
            <div className="flex items-center justify-center space-x-4 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" loading="lazy" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" loading="lazy" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="AMEX" className="h-6" referrerPolicy="no-referrer" loading="lazy" />
              <div className="h-4 w-px bg-white/20" />
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" className="h-5" referrerPolicy="no-referrer" loading="lazy" />
            </div>

            <div className="w-full flex items-center space-x-4 mb-4">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Or Connect Wallet</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>
            <w3m-connect-wallet />
          </div>

          <p className="text-[10px] text-center text-white/30 uppercase tracking-widest">
            Powered by Paybis • Secure 256-bit SSL
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass-card rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/20">
                {isProcessing && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-full bg-accent"
                  />
                )}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Confirm Order</h3>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Transaction Summary</p>
                </div>
                {!isProcessing && (
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                  <span className="text-xs font-bold uppercase text-white/40">Pay</span>
                  <span className="text-xl font-bold">${usdAmount} USD</span>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-accent rotate-90" />
                </div>

                <div className="flex justify-between items-center p-4 bg-accent/10 rounded-2xl border border-accent/20">
                  <div className="flex items-center space-x-2">
                    <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" className="w-5 h-5" referrerPolicy="no-referrer" loading="lazy" />
                    <span className="text-xs font-bold uppercase text-accent/60">Receive</span>
                  </div>
                  <span className="text-xl font-bold text-accent">{usdtToReceive.toFixed(2)} USDT</span>
                </div>

                <div className="space-y-2 px-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>Network</span>
                    <span>TRC20 (Tron)</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>Wallet</span>
                    <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Pay</span>
                    </>
                  )}
                </button>
                {!isProcessing && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 text-xs font-bold uppercase text-white/30 hover:text-white/60 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="mt-6 text-[9px] text-center text-white/20 leading-relaxed">
                By confirming, you agree to our Terms of Service. You will be redirected to Paybis to complete your secure payment.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
