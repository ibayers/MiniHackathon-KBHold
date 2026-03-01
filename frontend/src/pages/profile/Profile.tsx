import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';
import supabase from '../../supabase';
import profilePic from "../../assets/black cat.jpeg";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden pb-0">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-6 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined block">arrow_back</span>
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <button className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 transition-colors">
          <span className="material-symbols-outlined block">settings</span>
        </button>
      </header>

      <main className="flex-1 px-6 space-y-8 overflow-y-auto pb-6 z-10 w-full">
        {/* User Identity Section */}
        <section className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-32 rounded-full p-1 ring-2 ring-cyan-500">
              <div 
                className="size-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden bg-cover bg-center" 
                data-alt="Professional portrait of a young man smiling" 
                style={{
                  backgroundImage: `url("${profilePic}")`,
                }}
              >
              </div>
            </div>
            <div className="absolute bottom-1 right-1 size-6 bg-cyan-500 rounded-full border-4 border-background-dark flex items-center justify-center">
              <span className="size-2 bg-white rounded-full"></span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Bryan Carlos</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm leading-none">verified</span>
              Pro Shopper
            </div>
          </div>
        </section>

        {/* Quick Stats Row */}
        <section className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl glass-card text-center">
            <span className="material-symbols-outlined text-cyan-500 mb-2 font-light">calendar_today</span>
            <span className="text-xl font-bold">128</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Visits</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-xl glass-card text-center">
            <span className="material-symbols-outlined text-cyan-500 mb-2 font-light">stars</span>
            <span className="text-xl font-bold">4.2k</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Points</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-xl glass-card text-center">
            <span className="material-symbols-outlined text-cyan-500 mb-2 font-light">credit_card</span>
            <span className="text-xl font-bold">3</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Cards</span>
          </div>
        </section>

        {/* Menu List */}
        <section className="space-y-3">
          <div className="p-1 rounded-xl glass-card space-y-1">
            <button 
              onClick={() => navigate('/wallet')} 
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-200/30 dark:hover:bg-slate-700/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="font-medium">Payment Methods</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button 
              onClick={() => navigate('/wallet#transaction-history')} 
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-200/30 dark:hover:bg-slate-700/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="font-medium">Transaction History</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Sign Out Button */}
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }}
          className="w-full py-4 rounded-xl border border-rose-500/30 text-rose-500 font-semibold flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Decorative Element */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
    </div>
  </div>
  );
};

export default Profile;
