import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';
import supabase from '../../supabase';

// Define our types based on the SQL schema
type UserCard = {
  card_number: string;
  card_holder: string;
  main_balance: number;
  smarthold_active: number;
  hold_limit: number;
};

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: 'capture' | 'release';
  merchant: string;
  reference_id: string;
  created_at: string;
};

export default function Wallet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardInfo, setCardInfo] = useState<UserCard | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the first card
        const { data: cardData, error: cardError } = await supabase
          .from('user_cards')
          .select('*')
          .limit(1)
          .single();

        if (cardError) throw cardError;
        setCardInfo(cardData);

        // Fetch recent transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (txError) throw txError;
        setTransactions(txData);

      } catch (err) {
        console.error("Failed to load Wallet data from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && location.hash === '#transaction-history') {
      setTimeout(() => {
        const el = document.getElementById('transaction-history');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, isLoading]);

  // Compute values for UI if cardInfo is loaded
  const percentUsed = cardInfo
    ? Math.min((cardInfo.smarthold_active / cardInfo.hold_limit) * 100, 100).toFixed(1)
    : "0.0";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden pb-0">
        
        {/* Header Section */}
        <header className="sticky top-0 z-50 glass border-b border-primary/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 p-2 rounded-lg">
              <span className="material-symbols-outlined text-accent">account_balance_wallet</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">KBhold</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-accent transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-primary/40 border border-primary/30 flex items-center justify-center hover:bg-primary/50 transition-colors"
            >
              <span className="material-symbols-outlined text-accent">person</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-6 overflow-y-auto pb-32 z-10">
          {/* Hero: 3D Card Section */}
          <section className="relative group">
            <div 
              className="w-full aspect-[1.58/1] rounded-xl bg-linear-to-br from-slate-900 via-primary/40 to-slate-900 border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
              data-alt="3D rendered holographic black credit card with cyan accents"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-accent tracking-[0.2em] uppercase">Premium Tier</span>
                  <div className="flex items-center gap-1 mt-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                    <span className="material-symbols-outlined text-[12px] text-accent fill-1">verified</span>
                    <span className="text-[10px] font-bold text-white">KBhold Verified</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-3xl text-white/40">contactless</span>
              </div>
              <div className="z-10">
                <p className="text-2xl font-mono tracking-[0.2em] text-white">
                  {isLoading ? '•••• •••• •••• ••••' : (cardInfo?.card_number || '•••• •••• •••• 8899')}
                </p>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Card Holder</p>
                    <p className="text-sm font-medium text-white">
                      {isLoading ? 'LOADING...' : (cardInfo?.card_holder || 'NO CARD FOUND')}
                    </p>
                  </div>
                  <div className="h-8 w-12 bg-white/10 rounded border border-white/5 flex items-center justify-center">
                    <div className="flex -space-x-2">
                      <div className="w-5 h-5 rounded-full bg-red-500/80"></div>
                      <div className="w-5 h-5 rounded-full bg-yellow-500/80"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Funds Breakdown */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col gap-1">
              <p className="text-xs text-slate-400">Main Balance</p>
              <p className="text-xl font-bold text-slate-100">
                {isLoading ? 'Rp ...' : `Rp ${(cardInfo?.main_balance || 0).toLocaleString('id-ID')}`}
              </p>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex flex-col gap-1">
              <p className="text-xs text-accent">KBhold Active</p>
              <p className="text-sm font-bold text-slate-100 leading-snug">
                Harga Belanja + 15%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Hold dihitung otomatis saat sesi belanja berlangsung
              </p>
            </div>
          </section>

          {/* Hold Limit Consumption */}
          <section className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-semibold text-slate-300">Hold Limit Consumption</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Rp {(cardInfo?.smarthold_active || 0).toLocaleString('id-ID')} of Rp {(cardInfo?.hold_limit || 0).toLocaleString('id-ID')} threshold used
                </p>
              </div>
              <p className="text-xl font-bold text-accent">{percentUsed}%</p>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-linear-to-r from-primary to-accent h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </section>

          {/* Security: Toggles & Vault */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 px-1">Security & Automation</h3>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4 flex items-center justify-between border border-primary/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">bolt</span>
                  <div>
                    <p className="text-sm font-medium">Auto-Authorization</p>
                    <p className="text-[10px] text-slate-500">Instant pre-auth for trusted merchants</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              <div className="glass rounded-xl p-4 flex items-center justify-between border border-primary/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">shield_with_heart</span>
                  <div>
                    <p className="text-sm font-medium">Risk Buffer</p>
                    <p className="text-[10px] text-slate-500">Dynamic +5% safety margin on holds</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              <div className="bg-linear-to-r from-primary/20 to-accent/20 border border-accent/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent">fingerprint</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Secure Vault</p>
                    <p className="text-[10px] text-slate-400">Biometric Layer Active</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-tighter bg-accent text-slate-900 px-3 py-1.5 rounded-lg">Access</button>
              </div>
            </div>
          </section>

          {/* Transaction History */}
          <section id="transaction-history" className="space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Transaction Logs</h3>
              <button className="text-xs text-accent font-medium">View All</button>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center text-slate-500 py-6 text-sm">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center text-slate-500 py-6 text-sm">No recent transactions</div>
              ) : (
                transactions.map((tx) => {
                  const isRelease = tx.type === 'release';
                  // Calculate time ago, simplified version
                  const date = new Date(tx.created_at);
                  const timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateFormatted = date.toLocaleDateString();

                  return (
                    <div key={tx.id} className="glass border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isRelease ? 'bg-emerald-500/20' : 'bg-primary/30'
                          }`}>
                            <span className={`material-symbols-outlined ${
                              isRelease ? 'text-emerald-500' : 'text-accent'
                            }`}>
                              {isRelease ? 'add_circle' : 'shopping_cart_checkout'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{tx.title}</p>
                            <p className="text-[10px] text-slate-500">{tx.merchant} • ID: #{tx.reference_id}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold ${
                          isRelease ? 'text-emerald-500' : 'text-slate-100'
                        }`}>
                          {isRelease ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-500">{dateFormatted} at {timeFormatted}</span>
                        <button 
                          onClick={() => {
                            // If it's a capture, the amount IS the total purchase.
                            // If it's a release, the amount is the 15% hold, so the total purchase was (amount * 100 / 15).
                            const totalPurchase = isRelease ? (tx.amount * 100 / 15) : tx.amount;
                            navigate('/smart-receipt', { state: { cartData: { total_harga: totalPurchase } } });
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-lg border border-accent/20 transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                          View AI Receipt
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Floating Decorative Element */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      </div>
    </div>
  );
}
