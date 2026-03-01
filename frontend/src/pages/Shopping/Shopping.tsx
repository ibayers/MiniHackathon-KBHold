import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';

const Shopping: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="dark relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Header */}
      <header className="sticky top-0 z-50 glass px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
          </div>
          <div>
            <h1 className="text-sm font-medium text-slate-400">KBhold Live</h1>
            <p className="text-base font-bold tracking-tight text-white">Connected to Smart Cart #021</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="size-2 bg-green-500 rounded-full"></span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Live</span>
          </div>
          <span className="material-symbols-outlined text-slate-400">battery_horiz_075</span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Summary Stats Card */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Total Items</span>
            <span className="text-3xl font-bold text-white">12</span>
          </div>
          <div className="glass p-4 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Current Total</span>
            <span className="text-3xl font-bold text-primary">Rp 4.267.500</span>
          </div>
        </div>
        {/* Payment Status Bar */}
        <div className="glass p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-sm font-semibold text-slate-300">Payment Status</h2>
              <p className="text-xs text-slate-500">Security verification in progress</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white">Rp 2.775.000</span>
              <span className="text-xs text-slate-500 ml-1">of Rp 4.267.500</span>
            </div>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-500">
            <span>Amount Secured</span>
            <span className="text-primary">65% Completed</span>
          </div>
        </div>
        {/* Live Cart List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Live Cart Items
              <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            </h3>
            <button className="text-xs font-bold text-primary uppercase">View Map</button>
          </div>
          <div className="space-y-3">
            {/* Item 1 */}
            <div className="glass p-3 rounded-xl flex gap-4 items-center">
              <div className="size-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
                <img alt="Red Nike Running Shoe" className="w-full h-full object-cover" data-alt="Red high quality running shoe on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK4Y1e0nfUPuuPF-0TqC7a-OfdtIcE9bRHUsW65_rrjaptaLnysTwqGuQK47HO0W7yUmrp4WRcBr9JSsAOpspmS-jBdm6XrQGCu5cP9qShiReOqKFJwdsvuKu3sprPC8IfRlb7ZUIQehg_LdReU7bAedEF-Fh2moiDyUy1ILJLdOOYxFClGgrtt0mcw7_zfdRTREqA59a3PZ5a7Cs-doPon610ieDCsnzZr50ioKGL4zkwx0ZJzgf-A8EOxqe2fKbgi501w9DWIl4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">Nike Air Zoom Pegasus</h4>
                  <span className="text-sm font-bold text-primary">Rp 1.800.000</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Verified by AI
                  </span>
                </div>
              </div>
            </div>
            {/* Item 2 */}
            <div className="glass p-3 rounded-xl flex gap-4 items-center border-primary/40">
              <div className="size-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
                <img alt="Modern Smart Watch" className="w-full h-full object-cover" data-alt="Luxury minimal smartwatch with silver finish" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLN_naYbwJ2Zfa64oTvjo3t2IPvVVNnPNzQBKJxXWNQ72IXObhLfA9F7b_i6XVH0Big_EtPJBuGknWjq028YoDnFQViROlqlmMyLNJy6LzJqFzsz3ahBx4pnVG0-68HLld4_K68SZLedhfu2oWMzqIX2drSNI34hMX-HcMavJwKPUYRNXNnG6gLSBFOB2ZIUhAuMcmbju3ludHp3c_ZM8Dk62pqjyqpC4XUCvmXTvqM7492jqvq22LwayLbvU0bYw13HdtIjAQml8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">Series 7 Smartwatch</h4>
                  <span className="text-sm font-bold text-primary">Rp 5.235.000</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Verified by AI
                  </span>
                </div>
              </div>
            </div>
            {/* Item 3 */}
            <div className="glass p-3 rounded-xl flex gap-4 items-center">
              <div className="size-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
                <img alt="Black Wireless Headphones" className="w-full h-full object-cover" data-alt="Professional over-ear studio headphones black" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFyHjOhIiOd-JMZInUOS3R7pCRDVeYKrs6-QbzPXl2B8j3Jnxk-REuhrDQGZKWkkqvAfks9L5Q1baVh8YfiCXv1ZmMN7YN8cien46veyvHMeehVW1AF25AeEZwpzJG3Ix_2cbad38AdgPZZ_umYTGXvQjjhqLgBq2WTh5Dvb8z1bYCnNhodBCp6JeJJW9FnlqhrDHs4qDw1oA44NSVQip29fOsEdan3xs2lw2jaqpePJP4OL9fMVOL2KpPaHPZlhhDi9WzYmy1Mhk" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">Studio Wireless Pro</h4>
                  <span className="text-sm font-bold text-primary">Rp 2.985.000</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Verified by AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Transaction History */}
        <section className="space-y-4 pb-24">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <div className="space-y-3">
            {/* Transaction 1 */}
            <div className="glass p-3 rounded-xl flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-lg">local_cafe</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">Artisan Coffee</h4>
                <p className="text-xs text-slate-400">Today, 09:41 AM</p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-white text-sm">-Rp 82.500</span>
                <span className="text-[10px] text-green-500 font-medium tracking-wide uppercase">Success</span>
              </div>
            </div>
            {/* Transaction 2 */}
            <div className="glass p-3 rounded-xl flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">Healthy Salad Bar</h4>
                <p className="text-xs text-slate-400">Yesterday, 12:30 PM</p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-white text-sm">-Rp 213.000</span>
                <span className="text-[10px] text-green-500 font-medium tracking-wide uppercase">Success</span>
              </div>
            </div>
            {/* Transaction 3 */}
            <div className="glass p-3 rounded-xl flex items-center gap-4 opacity-75">
              <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                <span className="material-symbols-outlined text-slate-400 text-lg">storefront</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-300 text-sm">City Supermarket</h4>
                <p className="text-xs text-slate-500">Oct 24, 16:15 PM</p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-300 text-sm">-Rp 1.348.500</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Settled</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Bottom Action Zone (Thumb Zone) */}
      <div className="absolute bottom-[76px] left-0 right-0 p-4 bg-linear-to-t from-background-dark via-background-dark/95 to-transparent z-40 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <button className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">add_shopping_cart</span>
            Add Item
          </button>
          <button 
            onClick={() => navigate('/exit-settlement')}
            className="flex-[1.5] bg-primary text-slate-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer hover:bg-cyan-400 transition-colors border border-transparent hover:border-cyan-300"
          >
            <span className="material-symbols-outlined">payments</span>
            SECURE CHECKOUT
          </button>
        </div>
      </div>
      {/* Navigation Bar */}
      <BottomNavigation />
        {/* Floating Decorative Element */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
      </div>
    </div>
  );
};

export default Shopping;
