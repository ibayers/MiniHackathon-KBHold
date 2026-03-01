import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import BottomNavigation from "../../components/BottomNavigation";
import profilePic from "../../assets/black cat.jpeg";
import supabase from "../../supabase";

export default function Dashboard() {
  const [showQR, setShowQR] = useState(false);
  const userData = { id: "USR-8823-ALX" }; // Mock payload for QR value

  const [holdLimit, setHoldLimit] = useState<number | null>(null);
  const [smartholdActive, setSmartholdActive] = useState<number | null>(null);
  const [mainBalance, setMainBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCardLimits = async () => {
      try {
        const { data, error } = await supabase
          .from('user_cards')
          .select('hold_limit, smarthold_active, main_balance')
          .limit(1)
          .single();
          
        if (data) {
          setHoldLimit(data.hold_limit);
          setSmartholdActive(data.smarthold_active);
          setMainBalance(data.main_balance);
        }
      } catch (err) {
        console.error("Dashboard Supabase error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCardLimits();
  }, []);

  // Compute percentage used
  const percentUsed = (smartholdActive !== null && holdLimit !== null && holdLimit > 0)
    ? Math.min((smartholdActive / holdLimit) * 100, 100)
    : 0;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden pb-0">
        {/* Header Section */}
        <header className="p-6 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full border-2 border-primary overflow-hidden bg-slate-800 bg-center bg-cover"
                role="img"
                aria-label="User profile photo of Alex"
                style={{
                  backgroundImage: `url("${profilePic}")`,
                }}
              ></div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-background-dark"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Hi, Bryan</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Ready to Enter Store
                </span>
              </div>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl glass hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-slate-400">
              notifications
            </span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 space-y-6 overflow-y-auto pb-32 z-10 w-full">
          {/* Hero QR Button */}
          <div className="py-4">
            <div
              className={`relative w-full rounded-2xl bg-linear-to-br from-primary via-primary/80 to-accent flex flex-col items-center justify-center gap-4 shadow-[0_20px_50px_rgba(30,61,138,0.3)] group transition-all ${
                showQR
                  ? "aspect-square p-6 scale-100"
                  : "aspect-4/3 cursor-pointer active:scale-95"
              }`}
              onClick={() => !showQR && setShowQR(true)}
            >
              <div
                className={`bg-white/10 rounded-2xl flex items-center justify-center glass backdrop-blur-md transition-all ${
                  showQR
                    ? "w-full aspect-square bg-white border-4 border-white relative mt-2"
                    : "w-24 h-24"
                }`}
              >
                {showQR ? (
                  <QRCodeSVG
                    value={`auth-entry:${userData.id}`}
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
                    Generate Entry QR
                  </span>
                  <span className="text-white/60 text-sm">
                    Secure access to automated stores
                  </span>
                </div>
              ) : (
                <div className="text-center pb-2">
                  <span className="block text-white text-xl font-bold">
                    Scan at Entrance
                  </span>
                  <span className="text-white/60 text-sm">
                    Valid for 5 minutes
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQR(false);
                    }}
                    className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                    Cancel
                  </button>
                  <Link
                    to="/pairing-hub"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 px-6 py-2 bg-accent/20 hover:bg-accent/30 border border-accent/30 rounded-xl text-accent font-medium text-sm transition-colors flex items-center gap-2 mx-auto w-fit"
                  >
                    <span className="material-symbols-outlined text-lg">
                      devices
                    </span>
                    Go to Pairing Hub (Temp)
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Smart Hold Info Card */}
          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">
                account_balance_wallet
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
                    Pre-Authorization
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Active
                  </span>
                </div>
                <h3 className="text-lg font-bold">Main Balance</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Available:{" "}
                  <span className="text-slate-100 font-semibold">
                    {isLoading ? 'Rp ...' : `Rp ${(mainBalance || 0).toLocaleString('id-ID')}`}
                  </span>
                </p>
              </div>
              <div className="w-full bg-slate-800/50 rounded-lg h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${percentUsed}%` }}
                ></div>
              </div>
              <Link
                to="/wallet"
                className="flex items-center justify-between w-full text-sm font-medium text-slate-300 py-2 group"
              >
                <span>View balance details</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward_ios
                </span>
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-between px-2 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-xl">
                verified_user
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest">
                PCI-DSS Compliant
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-xl">
                enhanced_encryption
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest">
                256-bit Secure
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-xl">
                shield_person
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Fraud Protected
              </span>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Floating Decorative Element */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
}
