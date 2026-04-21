import { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, ShoppingCart, TrendingUp, Users, DollarSign, Save, AlertCircle, Menu, X, Lock, LogOut, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';

interface Order {
  id: string;
  created_at: string;
  amount: number;
  usdt_amount: number;
  status: string;
  wallet_address: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loginStep, setLoginStep] = useState<1 | 2 | 'setup'>(1);
  const [qrCode, setQrCode] = useState<string>('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'settings' | 'orders'>('stats');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    partnerUuid: '',
    hmacKey: '',
    markup: '3.5',
    mode: 'sandbox',
    minAmount: '10'
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = sessionStorage.getItem('admin_token');
    if (adminToken === 'admin-session-token') {
      setIsAuthenticated(true);
    }

    const saved = localStorage.getItem('up2fly_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Initial fetch
    const fetchOrders = async () => {
      try {
        setOrdersError(null);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError('Failed to load orders. Please check your connection.');
      }
    };

    fetchOrders();

    // Real-time subscription
    const channel = supabase
      .channel('orders_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => [payload.new as Order, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Password is required');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const response = await axios.post('/api/admin/login', { password });
      if (response.data.success) {
        if (response.data.requires2FA) {
          setLoginStep(2);
        } else {
          sessionStorage.setItem('admin_token', response.data.token);
          setIsAuthenticated(true);
        }
      }
    } catch (error: any) {
      const debug = error.response?.data?.debug;
      if (debug) {
        setLoginError(`Invalid password. (Server expected ${debug.expectedLen} chars, received ${debug.receivedLen} chars. Env set: ${debug.envSet ? 'Yes' : 'No'})`);
      } else {
        setLoginError('Invalid password');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setLoginError('Enter 6-digit code');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const response = await axios.post('/api/admin/verify-2fa', { pin });
      if (response.data.success) {
        sessionStorage.setItem('admin_token', response.data.token);
        setIsAuthenticated(true);
        setLoginError('');
      }
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSetup2FA = async () => {
    try {
      const response = await axios.get('/api/admin/2fa-setup');
      setQrCode(response.data.qrCodeUrl);
      setLoginStep('setup');
    } catch (error: any) {
      setLoginError(error.response?.data?.error || 'Failed to load setup');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
    setPin('');
    setLoginStep(1);
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('up2fly_settings', JSON.stringify(settings));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('idle');
      alert('Failed to save settings. Local storage might be full or disabled.');
    }
  };

  const stats = [
    { label: 'Total Volume', value: '$128,430', icon: <DollarSign className="w-5 h-5 text-accent" />, trend: '+12.5%' },
    { label: 'Total Orders', value: '1,240', icon: <ShoppingCart className="w-5 h-5 text-accent" />, trend: '+8.2%' },
    { label: 'Active Users', value: '842', icon: <Users className="w-5 h-5 text-accent" />, trend: '+5.1%' },
    { label: 'Net Profit', value: '$4,495', icon: <TrendingUp className="w-5 h-5 text-accent" />, trend: '+15.3%' },
  ];

  const NavItems = () => (
    <>
      <button
        onClick={() => { setActiveTab('stats'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
          activeTab === 'stats' ? "bg-accent text-accent-foreground font-bold" : "hover:bg-white/5 text-white/60"
        )}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </button>
      <button
        onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
          activeTab === 'settings' ? "bg-accent text-accent-foreground font-bold" : "hover:bg-white/5 text-white/60"
        )}
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>
      <button
        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
          activeTab === 'orders' ? "bg-accent text-accent-foreground font-bold" : "hover:bg-white/5 text-white/60"
        )}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Orders</span>
      </button>
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-card p-8 rounded-3xl border border-white/5 w-full max-w-md accent-glow relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: "33.33%" }}
              animate={{ 
                width: loginStep === 1 ? "33.33%" : loginStep === 2 ? "66.66%" : "100%" 
              }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>

          <div className="flex flex-col items-center mb-8 pt-4">
            <motion.div 
              key={loginStep}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-accent/10 rounded-2xl mb-4"
            >
              {loginStep === 1 ? <Lock className="w-8 h-8 text-accent" /> : <Shield className="w-8 h-8 text-accent" />}
            </motion.div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">
              {loginStep === 1 ? 'Admin Login' : 'Security Verification'}
            </h1>
            <p className="text-sm text-white/40 mt-2 text-center max-w-[280px]">
              {loginStep === 1 ? 'Enter your administrative password to access the dashboard' : 
               loginStep === 2 ? 'Enter the 6-digit code from your Google Authenticator app' :
               'Scan this QR code with Google Authenticator to set up 2FA'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {loginStep === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full bg-white/5 border rounded-xl py-4 px-4 focus:outline-none transition-all",
                        loginError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                      )}
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  {loginError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 ml-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {loginError}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : loginStep === 2 ? (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify2FA} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">Authenticator Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className={cn(
                      "w-full bg-white/5 border rounded-xl py-4 px-4 text-center text-xl sm:text-2xl tracking-[0.5em] sm:tracking-[1em] font-bold focus:outline-none transition-all",
                      loginError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                    )}
                    placeholder="000000"
                    autoFocus
                  />
                  {loginError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 ml-1 text-center flex items-center justify-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {loginError}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Verify & Access</span>
                      </>
                    )}
                  </button>
                  <div className="flex flex-col items-center space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setLoginStep(1); setLoginError(''); }}
                      className="text-xs font-bold uppercase text-white/20 hover:text-white/40 transition-colors"
                    >
                      Back to Password
                    </button>
                    <button
                      type="button"
                      onClick={handleSetup2FA}
                      className="text-[10px] font-bold uppercase text-accent/40 hover:text-accent transition-colors border border-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/5"
                    >
                      Setup Google Authenticator
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                  <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 sm:w-48 sm:h-48" />
                </div>
                <div className="space-y-3 text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest mb-2">Instructions</p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    1. Open Google Authenticator app<br/>
                    2. Tap the "+" icon and select "Scan a QR code"<br/>
                    3. Scan the image above to link your account
                  </p>
                </div>
                <button
                  onClick={() => setLoginStep(2)}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                >
                  <span>I've scanned it</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight hidden md:block">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-xs font-bold uppercase text-white/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent rounded-lg">
            {activeTab === 'stats' && <LayoutDashboard className="w-5 h-5 text-accent-foreground" />}
            {activeTab === 'settings' && <Settings className="w-5 h-5 text-accent-foreground" />}
            {activeTab === 'orders' && <ShoppingCart className="w-5 h-5 text-accent-foreground" />}
          </div>
          <span className="font-bold uppercase tracking-tight">
            {activeTab === 'stats' && 'Dashboard'}
            {activeTab === 'settings' && 'Settings'}
            {activeTab === 'orders' && 'Orders'}
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 px-4">
          <div className="space-y-2">
            <NavItems />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 space-y-2">
          <NavItems />
        </aside>

        {/* Content */}
        <div className="flex-grow">
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="glass-card p-4 md:p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                      <div className="p-1.5 md:p-2 bg-accent/10 rounded-lg">{s.icon}</div>
                      <span className="text-[10px] md:text-xs font-bold text-accent">{s.trend}</span>
                    </div>
                    <p className="text-[10px] md:text-xs font-bold uppercase text-white/40 mb-1">{s.label}</p>
                    <p className="text-lg md:text-2xl font-bold tracking-tight">{s.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="glass-card p-8 rounded-2xl border border-white/5 h-64 flex items-center justify-center">
                <p className="text-white/20 font-mono uppercase tracking-widest text-center">Volume Chart Placeholder</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 max-w-2xl">
              <h2 className="text-xl md:text-2xl font-bold mb-8 uppercase tracking-tight">System Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Partner UUID</label>
                    <input
                      type="text"
                      value={settings.partnerUuid}
                      onChange={(e) => setSettings({ ...settings, partnerUuid: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50"
                      placeholder="uuid-..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">HMAC Key</label>
                    <input
                      type="password"
                      value={settings.hmacKey}
                      onChange={(e) => setSettings({ ...settings, hmacKey: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Markup %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.markup}
                      onChange={(e) => setSettings({ ...settings, markup: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Operation Mode</label>
                    <select
                      value={settings.mode}
                      onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50 appearance-none"
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Min Purchase (USD)</label>
                    <input
                      type="number"
                      value={settings.minAmount}
                      onChange={(e) => setSettings({ ...settings, minAmount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-[10px] md:text-xs text-white/40">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Changes affect live calculations instantly.</span>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus !== 'idle'}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold uppercase tracking-tight">Recent Orders</h2>
              </div>

              {ordersError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-400 font-bold uppercase tracking-tight">{ordersError}</p>
                </div>
              )}

              {/* Desktop Table */}
              <div className="hidden md:block glass-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">USDT</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Wallet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono text-sm">{o.id.slice(0, 8)}...</td>
                          <td className="px-6 py-4 text-sm text-white/60 whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-bold">${o.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm font-bold text-accent">{o.usdt_amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                              o.status === 'Completed' ? "bg-accent/10 text-accent" :
                              o.status === 'Processing' ? "bg-blue-500/10 text-blue-400" :
                              "bg-red-500/10 text-red-400"
                            )}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-white/40">{o.wallet_address.slice(0, 6)}...{o.wallet_address.slice(-4)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-white/20 uppercase tracking-widest text-xs">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile List */}
              <div className="md:hidden space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-white/40">Order ID</p>
                        <p className="font-mono text-sm">{o.id.slice(0, 8)}...</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold uppercase text-white/40">Amount</p>
                        <p className="font-bold">${o.amount.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-4 flex justify-between items-center">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                        o.status === 'Completed' ? "bg-accent/10 text-accent" :
                        o.status === 'Processing' ? "bg-blue-500/10 text-blue-400" :
                        "bg-red-500/10 text-red-400"
                      )}>
                        {o.status}
                      </span>
                      <button 
                        onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40"
                      >
                        {expandedOrderId === o.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {expandedOrderId === o.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-white/[0.02] space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/40 mb-1">Date</p>
                            <p className="text-xs text-white/60">{new Date(o.created_at).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/40 mb-1">USDT Amount</p>
                            <p className="text-xs font-bold text-accent">{o.usdt_amount.toFixed(2)} USDT</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-white/40 mb-1">Wallet Address</p>
                          <p className="text-[10px] font-mono text-white/40 break-all bg-black/20 p-2 rounded-lg">{o.wallet_address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="glass-card p-12 rounded-2xl border border-white/5 text-center">
                    <p className="text-white/20 uppercase tracking-widest text-xs">No orders found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
