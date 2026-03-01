import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

type Item = {
  qty: number;
  harga: number;
  subtotal: number;
};

type CartData = {
  keranjang: Record<string, Item>;
  total_harga: number;
};

type RiskLevel = 'green' | 'yellow' | 'red';

// ─────────────────────────────────────────────
// Dummy risk score generator
// In production this would come from the AI / sensor backend.
// Score cycles to demo all states: green → yellow → red → repeat
// ─────────────────────────────────────────────
const getDummyScore = (tick: number): number => {
  const cycle = tick % 60; // 60-second loop
  if (cycle < 25) return 85 + Math.floor(Math.random() * 10);  // 85-94 → GREEN
  if (cycle < 45) return 50 + Math.floor(Math.random() * 20);  // 50-69 → YELLOW
  return 20 + Math.floor(Math.random() * 15);                   // 20-34 → RED
};

const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 80) return 'green';
  if (score >= 40) return 'yellow';
  return 'red';
};

// Per-item dummy flags for YELLOW warning (mismatch)
const YELLOW_ITEMS = ['Aqua', 'Kopi', 'Minuman', 'Botol']; // Common pattern names

// Baca backend URL secara dinamis setiap kali polling
// Harus function (bukan const) agar bisa baca localStorage SETELAH PairingHub set nilainya
const getLiveBackendUrl = () =>
  localStorage.getItem('kbhold_backend_url')
  || import.meta.env.VITE_API_URL
  || 'http://localhost:5000';


const LiveShopping: React.FC = () => {
  const navigate = useNavigate();
  const tickRef = useRef(0);

  const [cart, setCart] = useState<CartData>({ keranjang: {}, total_harga: 0 });
  const [riskScore, setRiskScore] = useState<number>(92);
  const [manualOverride, setManualOverride] = useState<number | null>(null); // null = auto-cycle
  const riskLevel = getRiskLevel(riskScore);

  // Cancel Session state
  const [isCancelMode, setIsCancelMode] = useState(false);
  const [showExitQR, setShowExitQR] = useState(false);

  const cartIsEmpty = Object.keys(cart.keranjang).length === 0;
  const exitQRValue = `smarthold-exit:CANCEL:USR-8823-ALX`;

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;

      // Update dummy risk score — skip if manual override is active
      setRiskScore(manualOverride !== null ? manualOverride : getDummyScore(tickRef.current));

      // Fetch cart data
      fetch(`${getLiveBackendUrl()}/data`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => res.json())
        .then(data => {
          const filtered: Record<string, Item> = {};
          Object.keys(data.keranjang).forEach(k => {
            if (data.keranjang[k]) filtered[k] = data.keranjang[k];
          });
          setCart({
            keranjang: filtered,
            total_harga: data.total_harga || Object.values(filtered).reduce((sum: number, i: Item) => sum + i.subtotal, 0)
          });
        })
        .catch(err => console.log("Waiting for smart cart connection...", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [manualOverride]);

  const dynamicHold = cart.total_harga + (cart.total_harga * 0.15);
  const percentUsed = dynamicHold > 0 ? (cart.total_harga / dynamicHold) * 100 : 0;
  const remainingHold = dynamicHold - cart.total_harga;

  // Risk level helpers
  const riskColor = {
    green:  { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500', ping: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400' },
    yellow: { border: 'border-amber-500/40',   bg: 'bg-amber-500/10',   text: 'text-amber-500',   dot: 'bg-amber-500',   ping: 'bg-amber-400',   badge: 'bg-amber-500/20 text-amber-400' },
    red:    { border: 'border-rose-500/40',     bg: 'bg-rose-500/10',    text: 'text-rose-500',    dot: 'bg-rose-500',    ping: 'bg-rose-400',    badge: 'bg-rose-500/20 text-rose-400' },
  }[riskLevel];

  const riskLabel = { green: 'Secure', yellow: 'Caution', red: 'High Risk' }[riskLevel];
  const riskIcon  = { green: 'shield',  yellow: 'warning',  red: 'gpp_bad' }[riskLevel];

  // Suspect item for YELLOW banner (pick first item whose name loosely matches)
  const suspectItem = Object.keys(cart.keranjang).find(name =>
    YELLOW_ITEMS.some(y => name.toLowerCase().includes(y.toLowerCase()))
  ) ?? Object.keys(cart.keranjang)[0] ?? 'item';

  const handleCancelSession = () => { setIsCancelMode(true); };
  const handleGenerateExitQR = () => { setShowExitQR(true); };
  const handleAbortCancel = () => { setIsCancelMode(false); setShowExitQR(false); };

  // Demo control helpers
  const setDemoState = (score: number) => {
    setManualOverride(score);
    setRiskScore(score);
  };
  const clearDemoOverride = () => {
    setManualOverride(null);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      {/* RED: Full-screen emergency overlay */}
      {riskLevel === 'red' && !isCancelMode && (
        <div className="fixed inset-0 z-200 bg-black/90 flex flex-col items-center justify-center p-6 gap-6 animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-24 h-24 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-6xl text-rose-500">gpp_bad</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400 mb-2">Emergency Override</p>
              <h2 className="text-2xl font-bold text-white">Anomaly Detected</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xs">
                Sensor mendeteksi ketidaksesuaian pada keranjang Anda. Dana hold telah diamankan sebagai deposit sementara.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 rounded-xl px-4 py-2">
              <span className="material-symbols-outlined text-rose-400 text-sm">account_balance_wallet</span>
              <span className="text-sm font-bold text-rose-400">Auto-Capture Active</span>
            </div>
            <div className="w-full bg-slate-800 rounded-xl p-4 flex flex-col gap-2 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${riskScore}%` }}></div>
                </div>
                <span className="text-sm font-bold text-rose-400">{riskScore}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/protected')}
            className="w-full max-w-xs bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">support_agent</span>
            Call Staff / Verification Required
          </button>
          <p className="text-[10px] text-slate-500 text-center max-w-xs">
            Hubungi petugas toko atau tunggu verifikasi manual selesai
          </p>
        </div>
      )}

      <div className={`relative w-full max-w-md min-h-screen flex flex-col shadow-2xl overflow-hidden transition-all duration-500 ${
        riskLevel === 'green' ? 'ring-[3px] ring-inset ring-emerald-500/30 bg-background-dark' :
        riskLevel === 'yellow' ? 'ring-[3px] ring-inset ring-amber-500/30 bg-background-dark' :
        'bg-background-dark'
      }`}>

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="material-symbols-outlined text-slate-600 dark:text-slate-400 bg-transparent border-none p-0 cursor-pointer"
              >
                arrow_back
              </button>
              <div>
                <h1 className="text-lg font-bold leading-tight tracking-tight">
                  {isCancelMode ? 'Cancel Session' : 'Shopping in Progress'}
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCancelMode ? 'bg-rose-400' : riskColor.ping}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isCancelMode ? 'bg-rose-500' : riskColor.dot}`}></span>
                  </span>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isCancelMode ? 'Awaiting Empty Cart' : 'Cart #042 Connected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk indicator badge — top right */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${riskColor.border} ${riskColor.bg}`}>
              <span className={`material-symbols-outlined text-sm ${riskColor.text}`}>{riskIcon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${riskColor.text}`}>{riskLabel}</span>
              <span className={`text-[10px] font-bold ${riskColor.text} opacity-70`}>{riskScore}</span>
            </div>
          </div>
        </header>

        {/* ── DEMO CONTROL PANEL ─────────────────────────────────────────────
            Tombol ini HANYA untuk keperluan demo/presentasi.
            Klik salah satu untuk paksa state. Klik "Auto" untuk kembali ke cycling.
        ────────────────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950 border-b border-slate-800">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mr-1">Demo:</span>
          <button
            onClick={() => setDemoState(90)}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${manualOverride !== null && manualOverride >= 80 ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
          >
            🟢 Safe
          </button>
          <button
            onClick={() => setDemoState(55)}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${manualOverride !== null && manualOverride >= 40 && manualOverride < 80 ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}
          >
            🟡 Caution
          </button>
          <button
            onClick={() => setDemoState(20)}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${manualOverride !== null && manualOverride < 40 ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'}`}
          >
            🔴 Alert
          </button>
          <button
            onClick={clearDemoOverride}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${manualOverride === null ? 'bg-slate-400 text-slate-900' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            ↺ Auto
          </button>
        </div>

        <main className="max-w-md mx-auto pb-80 w-full">

          {/* YELLOW: Floating banner above product list */}
          {riskLevel === 'yellow' && !isCancelMode && (
            <div className="mx-4 mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="material-symbols-outlined text-amber-500 mt-0.5 shrink-0">warning</span>
              <div>
                <p className="text-sm font-bold text-amber-500">Ada Ketidaksesuaian Berat</p>
                <p className="text-xs text-amber-400 mt-0.5">
                  Sensor mendeteksi ketidaksesuaian pada <strong className="text-amber-300 capitalize">{suspectItem}</strong>. Mohon atur ulang posisi barang di keranjang.
                </p>
              </div>
            </div>
          )}

          {/* Cancel mode banners */}
          {isCancelMode && !cartIsEmpty && (
            <div className="mx-4 mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="material-symbols-outlined text-rose-500 mt-0.5 shrink-0">warning</span>
              <div>
                <p className="text-sm font-bold text-rose-500">Tidak bisa keluar</p>
                <p className="text-xs text-rose-400 mt-0.5">
                  Silakan keluarkan semua barang dari keranjang untuk membatalkan belanja. Exit QR akan aktif otomatis saat keranjang kosong.
                </p>
              </div>
            </div>
          )}
          {isCancelMode && cartIsEmpty && !showExitQR && (
            <div className="mx-4 mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="material-symbols-outlined text-emerald-500 mt-0.5 shrink-0">check_circle</span>
              <div>
                <p className="text-sm font-bold text-emerald-500">Keranjang sudah kosong</p>
                <p className="text-xs text-emerald-400 mt-0.5">Hold akan dilepas. Tap tombol di bawah untuk generate Exit QR.</p>
              </div>
            </div>
          )}

          {/* Status Indicator (GREEN / normal mode) */}
          {!isCancelMode && (
            <div className="px-4 py-3">
              <div className={`rounded-lg p-3 flex items-center justify-center gap-2 border ${riskColor.border} ${riskColor.bg}`}>
                <span className={`material-symbols-outlined text-sm ${riskColor.text}`}>verified_user</span>
                <span className={`text-xs font-semibold ${riskColor.text}`}>
                  {riskLevel === 'green' && 'KBhold Active: Silent Protection • All Clear'}
                  {riskLevel === 'yellow' && 'KBhold Active: Weight mismatch detected — please reposition items'}
                  {riskLevel === 'red' && 'KBhold Active: Anomaly detected — Auto-Capture engaged'}
                </span>
              </div>
            </div>
          )}

          {/* Exit QR Panel */}
          {showExitQR && (
            <div className="mx-4 mt-4 rounded-xl border border-accent/30 bg-slate-900 p-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent">qr_code_2</span>
                <p className="text-sm font-bold text-slate-200">Exit QR — Scan di Pintu Keluar</p>
              </div>
              <div className="bg-white p-4 rounded-xl border-4 border-white shadow-lg">
                <QRCodeSVG value={exitQRValue} size={180} level="M" includeMargin={false} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock_open</span>
                  KBhold Dilepas · Tidak Ada Tagihan
                </p>
                <p className="text-[10px] text-slate-500">QR ini berlaku satu kali pakai</p>
              </div>
              <button
                onClick={() => navigate('/protected')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">exit_to_app</span>
                Konfirmasi Keluar
              </button>
            </div>
          )}

          {/* Product List */}
          <div className="flex flex-col gap-4 p-4">
            {Object.entries(cart.keranjang).length > 0 ? (
              Object.entries(cart.keranjang).map(([itemName, details], index) => {
                const isYellowItem = riskLevel === 'yellow' &&
                  YELLOW_ITEMS.some(y => itemName.toLowerCase().includes(y.toLowerCase()));
                return (
                  <div key={index} className={`flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300 ${
                    isCancelMode ? 'border-rose-500/30 opacity-75' :
                    isYellowItem ? 'border-amber-500/50' :
                    'border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="flex flex-[2_2_0px] flex-col justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-1 ${isYellowItem ? 'text-amber-500' : 'text-green-600 dark:text-green-400'}`}>
                          <span className="material-symbols-outlined text-sm font-bold">
                            {isYellowItem ? 'warning' : 'check_circle'}
                          </span>
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            {isYellowItem ? 'Mismatch Detected' : 'AI Verified'}
                          </p>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight capitalize">{itemName}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">{details.qty} units @ Rp {details.harga.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-primary dark:text-blue-400 font-bold text-lg">Rp {details.subtotal.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg shrink-0 border border-slate-200 dark:border-slate-700">
                      <span className="material-symbols-outlined text-4xl text-slate-400">inventory_2</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">shopping_bag</span>
                <p className="text-sm font-medium">Cart is empty</p>
                <p className="text-xs">Scan items to add them to your cart</p>
              </div>
            )}

            {/* Loading dots */}
            {!isCancelMode && (
              <div className="flex items-center justify-center py-4 opacity-50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Sticky Footer Card */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-md mx-auto flex flex-col gap-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl">

            {/* Normal mode */}
            {!isCancelMode && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Items Price</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rp {cart.total_harga.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Secure Hold (Realtime +15%)</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rp {dynamicHold.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full relative transition-all duration-300" style={{ width: `${percentUsed}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>{percentUsed.toFixed(1)}% Used</span>
                    <span>Rp {remainingHold.toLocaleString('id-ID')} Remaining</span>
                  </div>
                </div>

                {/* Proceed button — changes for RED state */}
                {riskLevel === 'red' ? (
                  <button
                    onClick={() => navigate('/protected')}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] border-none"
                  >
                    <span className="material-symbols-outlined">support_agent</span>
                    Call Staff / Verification Required
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/exit-settlement', { state: { cartData: cart } })}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] border-none"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Proceed to Exit
                  </button>
                )}

                <button
                  onClick={handleCancelSession}
                  className="w-full border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] bg-transparent text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  Cancel Session
                </button>
              </>
            )}

            {/* Cancel mode */}
            {isCancelMode && (
              <>
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs text-slate-500 font-medium">Barang di Keranjang</p>
                  <p className={`text-sm font-bold ${cartIsEmpty ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {Object.keys(cart.keranjang).length} item
                  </p>
                </div>
                <button
                  onClick={handleGenerateExitQR}
                  disabled={!cartIsEmpty}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border-none ${
                    cartIsEmpty
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined">qr_code_2</span>
                  {cartIsEmpty ? 'Generate Exit QR' : 'Keluarkan semua barang terlebih dahulu'}
                </button>
                <button
                  onClick={handleAbortCancel}
                  className="w-full border border-slate-400/40 text-slate-400 hover:bg-slate-500/10 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] bg-transparent text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Kembali Belanja
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveShopping;
