import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ExitSettlement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showQR, setShowQR] = useState(false);

  const cartData = location.state?.cartData || { total_harga: 0 };
  const capturedAmount = cartData.total_harga;
  const holdAmount = capturedAmount * 1.15;
  const releasedAmount = holdAmount - capturedAmount;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-between p-6 w-full relative z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shield_lock</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">KBhold Secure</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </nav>

        <main className="px-6 flex-1 flex flex-col relative z-10 pb-12">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
              <span className="material-symbols-outlined text-4xl!">check_circle</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Transaction Success</h1>
            <div className="flex items-center justify-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]!">lock</span> ENCRYPTED SESSION
              </span>
              <span className="text-slate-500 text-sm">Ref: SH-99281-XT</span>
            </div>
          </div>

          {/* Glass Receipt Component */}
          <div className="bg-primary/5 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden mb-8 border-t-4 border-t-primary">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
            <div className="relative z-10">
              <div className="text-center pb-6 mb-6 border-b border-slate-300 dark:border-slate-700/30">
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Final Settlement Amount</p>
                <h2 className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">Rp {capturedAmount.toLocaleString('id-ID')}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm!">verified_user</span> Authorized Amount
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">Rp {holdAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm!">payments</span> Captured Amount
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">Rp {capturedAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm!">release_alert</span> Released to Balance
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+Rp {releasedAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-dashed border-slate-300 dark:border-slate-700/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">credit_card</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visa •••• 4242</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Date &amp; Time</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Oct 24, 2023 • 14:42</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero QR Button */}
          <div className="py-2 mb-6">
            <div 
              className={`relative w-full rounded-2xl bg-linear-to-br from-primary via-primary/80 to-accent flex flex-col items-center justify-center gap-4 shadow-[0_20px_50px_rgba(30,61,138,0.3)] group transition-all ${
                showQR ? 'aspect-square p-6 scale-100' : 'aspect-4/3 cursor-pointer active:scale-95'
              }`}
              onClick={() => !showQR && setShowQR(true)}
            >
              <div className={`bg-white/10 rounded-2xl flex items-center justify-center glass backdrop-blur-md border border-white/20 transition-all ${
                showQR ? 'w-full aspect-square bg-white border-4 border-white relative mt-2' : 'w-24 h-24'
              }`}>
                {showQR ? (
                  <QRCodeSVG 
                    value={`auth-exit:SH-99281-XT`} 
                    size={200}
                    className="w-full h-full"
                    level="L"
                    includeMargin={false}
                    marginSize={2}
                  />
                ) : (
                  <span className="material-symbols-outlined text-white text-5xl">
                    qr_code_2
                  </span>
                )}
              </div>
              
              {!showQR ? (
                <div className="text-center">
                  <span className="block text-white text-xl font-bold">
                    Generate Exit QR
                  </span>
                  <span className="text-white/70 text-sm px-6">
                    Press to generate exit QR
                  </span>
                </div>
              ) : (
                <div className="text-center pb-2">
                  <span className="block text-white text-xl font-bold">
                    Exit QR Active
                  </span>
                  <span className="text-white/60 text-sm">
                    This code expires in 5:00 minutes
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQR(false);
                    }}
                    className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">

            <button 
              onClick={() => navigate('/smart-receipt', { state: { cartData } })}
              className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-4 rounded-xl font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-lg!">download</span>
              Receipt
            </button>
            <button 
              onClick={() => navigate('/protected')}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg!">home</span> Dashboard
            </button>
          </div>

          {/* Micro-badges & Security */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex gap-4 opacity-50">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs! text-slate-600 dark:text-slate-400">lock_outline</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:text-slate-400">256-bit AES</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs! text-slate-600 dark:text-slate-400">data_thresholding</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:text-slate-400">Real-time Node</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs! text-slate-600 dark:text-slate-400">token</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:text-slate-400">PCI-DSS V4</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 text-center max-w-[280px]">
              KBhold settlement is guaranteed by Decentralized Liquidity protocols. All funds are held in secure escrow until exit validation.
            </p>
          </div>
        </main>

        {/* Map Context Footer (Optional Decorative) */}
        <div 
          className="w-full h-48 mt-8 opacity-40 grayscale pointer-events-none absolute overflow-hidden shrink-0 z-0 bottom-0"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 40%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)" }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-background-light dark:from-background-dark via-transparent to-transparent z-10"></div>
          <img 
            className="w-full h-full object-cover" 
            alt="Abstract dark topographical map pattern" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxiLwfo8HOzELshqDM3T3iUA5eJlIZ8l4KJsynoyRBzvuWlXvbA2tTfslyaaoiEz1p3I2_d4SY-sU2UrkjWPC0vCvEm5-s9j4wcesHsRaZx3gqN9afD5ydgLBBhRSQg63C-gvFa5GXzYYiuAko8LDr78uvUNquFFAgTnukoeZcsRCuBF4uzyHaaBfp7Ab7uoT3lcRYJvuEFatOy0QBjCLzju1WH0ofNHFdrSUPc3wboctWCXd8Y2Z9vYjcJgGQUl9RWMWbnDjlggo"
          />
        </div>

        {/* Floating Decorative Elements from Dashboard */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
      </div>
    </div>
  );
}
