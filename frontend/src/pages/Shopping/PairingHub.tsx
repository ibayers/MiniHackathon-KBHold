import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

// Mengambil URL dari .env, jika tidak ada pakai localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PairingHub: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // If we've got a result, no need to initialize scanner again
    if (scanResult) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    const onScanSuccess = async (decodedText: string) => {
      setScanResult(decodedText);
      scanner.clear();

      try {
        // panggil backend menggunakan BASE_URL dari environment variable
        await fetch(`${BASE_URL}/connect`);
        console.log("Python diberi sinyal untuk mulai kamera");
      } catch (err) {
        console.error("Gagal connect ke backend:", err);
      }

      // baru pindah halaman
      navigate("/live-shopping");
    };

    const onScanFailure = (_error: string) => {
      // Handle failure silently to avoid console spam
    };

    scanner.render(onScanSuccess, onScanFailure);

    // Cleanup scanner when component unmounts
    return () => {
      scanner
        .clear()
        .catch((error) =>
          console.error("Failed to clear html5QrcodeScanner. ", error),
        );
    };
  }, [scanResult, navigate]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        <header className="relative flex items-center justify-between p-6 pt-12">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="status-pulse absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">KBhold</h1>
          </div>
          <div className="bg-[#1e3d8a]/20 border border-[#1e3d8a]/30 px-3 py-1.5 rounded-full">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">
              Hold Active
            </p>
          </div>
        </header>

        <main className="flex-1 flex flex-col px-6 gap-8">
          <div className="mt-4">
            <h2 className="text-3xl font-bold leading-tight">
              Ready to
              <br />
              <span className="text-primary">unlock</span> your cart?
            </h2>
            <p className="text-slate-400 mt-2 max-w-[280px]">
              Pair your device with a Smart Cart to begin your premium shopping
              experience.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-[#1e3d8a] to-primary rounded-xl blur opacity-20"></div>
            <div className="glass-card relative rounded-xl p-8 flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="mb-8 relative w-full flex justify-center">
                <div className="absolute -inset-10 bg-primary/10 blur-3xl rounded-full"></div>
                <div className="relative w-full max-w-[250px] min-h-[250px] flex items-center justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-inner">
                  {scanResult ? (
                    <div className="flex flex-col items-center gap-2 p-4">
                      <span className="material-symbols-outlined text-green-500 text-5xl">
                        check_circle
                      </span>
                      <p className="text-sm font-bold text-white">
                        Scanned Successfully!
                      </p>
                      <p className="text-xs text-slate-400 break-all">
                        {scanResult}
                      </p>
                    </div>
                  ) : (
                    <div
                      id="reader"
                      className="w-full h-full [&_video]:object-cover [&_#reader__dashboard_section_csr_span]:text-slate-300 [&_#reader__dashboard_section_swaplink]:text-primary [&_button]:bg-primary [&_button]:text-white [&_button]:border-none [&_button]:rounded-md [&_button]:px-4 [&_button]:py-2 [&_button]:font-bold [&_button]:cursor-pointer [&_button]:transition-colors hover:[&_button]:bg-primary/80"
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <div className="bg-[#1e3d8a]/30 p-2.5 rounded-lg text-primary">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <p className="text-sm font-medium">How it works</p>
              <p className="text-xs text-slate-400">
                Scan the QR code located on the cart handle to link your
                KBhold wallet.
              </p>
            </div>
          </div>
        </main>

        <footer className="p-6 pb-10 flex flex-col gap-4 mt-auto">
          <button
            onClick={() => navigate("/quick-exit")}
            className="w-full text-slate-400 hover:text-slate-200 font-medium py-3 text-sm transition-colors flex items-center justify-center gap-2 border-none bg-transparent"
            style={{ marginTop: 0, height: "auto" }}
          >
            Exit Store Without Shopping
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>

          {/* Navigation Bar */}
        </footer>
      </div>
    </div>
  );
};

export default PairingHub;
