import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const QuickExit: React.FC = () => {
    const navigate = useNavigate();
    const [showQR, setShowQR] = useState(false);
    const userData = { id: "USR-8823-ALX" }; // Mock payload for QR value

    return (
        <div className="bg-[#0B1221] text-slate-100 min-h-screen transition-colors duration-300 font-sans">
            <div className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col overflow-x-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-b from-blue-900/20 to-transparent p-6 pt-12 text-center rounded-b-[2rem]">
                    <div className="flex justify-center mb-4">
                        <div className="bg-cyan-500/20 p-3 rounded-full cursor-pointer" onClick={() => navigate(-1)}>
                            <span className="material-symbols-outlined text-red-500 text-3xl">cancel</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-white mb-2">Session Canceled</h1>
                    <p className="text-slate-400 font-medium">No Items Detected</p>
                    <div className="mt-4 px-4 py-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-sm font-semibold text-slate-200">
                            Your hold of <span className="text-cyan-400">Rp 0</span> has been fully released to your card.
                        </p>
                    </div>
                </div>

                    <div className="py-4 w-full">
                        <div 
                            className={`relative w-full rounded-2xl bg-linear-to-br from-primary via-primary/80 to-accent flex flex-col items-center justify-center gap-4 shadow-[0_20px_50px_rgba(30,61,138,0.3)] group transition-all ${
                                showQR ? 'aspect-square p-6 scale-100' : 'aspect-4/3 cursor-pointer active:scale-95'
                            }`}
                            onClick={() => !showQR && setShowQR(true)}
                        >
                            <div className={`bg-white/10 rounded-2xl flex items-center justify-center glass backdrop-blur-md transition-all ${
                                showQR ? 'w-full aspect-square bg-white border-4 border-white relative mt-2' : 'w-24 h-24'
                            }`}>
                                {showQR ? (
                                    <QRCodeSVG 
                                        value={`exit-auth:${userData.id}`} 
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
                                    <span className="text-white/60 text-sm">
                                        Valid for the next 15 minutes
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center pb-2">
                                    <span className="block text-white text-xl font-bold">
                                        Scan at the gate to exit
                                    </span>
                                    <span className="text-white/60 text-sm">
                                        Valid for the next 15 minutes
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

                {/* Breakdown Section */}
                <div className="p-6 mt-4">
                    <div className="bg-blue-900/20 rounded-2xl p-6 border border-white/10">
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                            <p className="text-slate-400 text-sm font-medium">Original Hold</p>
                            <p className="text-slate-200 text-sm font-semibold">Rp 0</p>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <p className="text-slate-100 text-base font-bold">Final Charge</p>
                            <div className="text-right">
                                <p className="text-emerald-400 text-3xl font-bold">Rp 0</p>
                                <p className="text-xs text-emerald-400/80 font-bold uppercase tracking-wide">Fully Refunded</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Bottom Actions */}
                <div className="p-6 flex flex-col gap-4">
                    <button 
                        onClick={() => navigate('/protected')}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Back to Home
                    </button>
                    <button className="text-center text-slate-400 text-sm font-medium hover:text-cyan-400 transition-colors py-2 flex items-center justify-center gap-1 text-cyan-400/70">
                        <span className="material-symbols-outlined text-base">support_agent</span>
                        Need help? Contact Support
                    </button>
                </div>

                {/* Subtle Footer Branding */}
                <div className="pb-8 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-medium">KBhold Secure Checkout</p>
                </div>
            </div>
        </div>
    );
};

export default QuickExit;
