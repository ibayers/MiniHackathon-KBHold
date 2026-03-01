import React, { useEffect, useRef } from 'react';
import BottomNavigation from '../../components/BottomNavigation';
import { useLocation } from 'react-router-dom';
import supabase from '../../supabase';

const SmartReceipt: React.FC = () => {
  const location = useLocation();
  const cartData = location.state?.cartData || { total_harga: 0 };
  const capturedAmount = cartData.total_harga;
  const holdAmount = capturedAmount * 1.15;
  const releasedAmount = holdAmount - capturedAmount;
  
  // Use a ref to prevent double inserts in React Strict Mode
  const insertedRef = useRef(false);

  useEffect(() => {
    // Only insert if we have a real cart total and haven't inserted yet
    if (capturedAmount > 0 && !insertedRef.current) {
      insertedRef.current = true;

      const pushTransactions = async () => {
        // Prepare the two transactions
        const txCapture = {
          title: 'Final Capture',
          amount: capturedAmount,
          type: 'capture',
          merchant: 'SmartStore - Sudirman',
          reference_id: 'SH-99283741'
        };

        const txRelease = {
          title: 'Hold Released',
          amount: releasedAmount,
          type: 'release',
          merchant: 'SmartStore - Sudirman',
          reference_id: 'SH-99283741'
        };

        try {
          const { error: txError } = await supabase
            .from('transactions')
            .insert([txCapture, txRelease]);

          if (txError) throw txError;
          console.log("Successfully logged transactions to Supabase");

          // Optional: Fetch current main_balance and deduct capturedAmount
          const { data: cardData, error: cardError } = await supabase
            .from('user_cards')
            .select('id, main_balance')
            .limit(1)
            .single();

          if (cardError) throw cardError;

          if (cardData) {
            const newBalance = cardData.main_balance - capturedAmount;
            const { error: updateError } = await supabase
              .from('user_cards')
              .update({ main_balance: newBalance })
              .eq('id', cardData.id);

            if (updateError) throw updateError;
            console.log("Successfully deducted balance from user card");
          }

        } catch (err) {
          console.error("Error processing receipt data:", err);
        }
      };

      pushTransactions();
    }
  }, [capturedAmount, releasedAmount]);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#121620] font-['Inter'] text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-[#f6f6f8] dark:bg-[#121620] overflow-x-hidden border-x border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <header className="flex items-center p-4 justify-between sticky top-0 bg-[#f6f6f8]/80 dark:bg-[#121620]/80 backdrop-blur-md z-10">
          <button className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Smart Receipt</h2>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 px-6 pt-4 pb-24">
          
          {/* Success Message */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-[#10b981]/20 p-4 rounded-full mb-4">
              <span className="material-symbols-outlined text-[#10b981] !text-5xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Payment Successful</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-2">
              Success! Your shopping session at <span className="font-semibold text-slate-900 dark:text-slate-100">SmartStore - Sudirman</span> is complete. <span className="text-[#10b981] font-semibold">Rp {releasedAmount.toLocaleString('id-ID')}</span> has been instantly released back to your card limit.
            </p>
          </div>

          {/* Receipt Card Section */}
          <div className="relative mb-8">
            {/* Receipt Body */}
            <div className="glass rounded-t-xl p-6 border border-white/5 relative overflow-hidden h-full">
              
              {/* Subtle AI Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/20">
                <span className="material-symbols-outlined !text-[12px]">verified_user</span>
                VERIFIED BY AI
              </div>
              
              <div className="mb-6 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Transaction Details</p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Transaction ID</span>
                  <span className="text-xs font-mono font-medium text-white">SH-99283741</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Date</span>
                  <span className="text-xs font-medium text-white">Oct 24, 2023 • 14:32</span>
                </div>
              </div>

              {/* Visual Reconciliation Table */}
              <div className="space-y-4 py-6 border-y border-dashed border-white/10">
                {/* Initial Hold */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 !text-sm">lock</span>
                    </div>
                    <span className="text-sm text-slate-400">Initial Hold</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-400">Rp {holdAmount.toLocaleString('id-ID')}</span>
                </div>

                {/* Connector */}
                <div className="ml-4 h-4 border-l-2 border-dashed border-slate-200"></div>

                {/* Final Purchase */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary !text-sm">shopping_cart</span>
                    </div>
                    <span className="text-sm font-bold text-white">Final Purchase</span>
                  </div>
                  <span className="text-lg font-bold text-primary">Rp {capturedAmount.toLocaleString('id-ID')}</span>
                </div>

                {/* Connector */}
                <div className="ml-4 h-4 border-l-2 border-dashed border-slate-200"></div>

                {/* Released */}
                <div className="flex items-center justify-between bg-[#10b981]/5 p-3 rounded-lg border border-[#10b981]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white !text-sm">keyboard_double_arrow_up</span>
                    </div>
                    <span className="text-sm font-bold text-[#10b981]">Instantly Released</span>
                  </div>
                  <span className="text-md font-bold text-[#10b981]">+ Rp {releasedAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="mt-6 text-center">
                <p className="text-[10px] text-slate-400 italic">KBhold uses real-time AI to reconcile temporary holds instantly.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
              Done
            </button>
            <button className="w-full bg-transparent border-2 border-primary/30 text-slate-900 dark:text-white font-bold py-4 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">download</span>
              Download E-Receipt
            </button>
            <button className="w-full bg-transparent border-2 border-primary/30 text-slate-900 dark:text-white font-bold py-4 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">share</span>
              Share Receipt
            </button>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default SmartReceipt;
