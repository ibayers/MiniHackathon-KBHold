Panduan Demo KBhold
Persiapan Sistem

1. Menjalankan ngrok
Gunakan perintah berikut untuk membuat tunnel server lokal:
ngrok http 5000
Catat URL yang dihasilkan (contoh: https://xxxx-xx.ngrok-free.app).

2. Konfigurasi Backend (.env)
Perbarui file backend/.env dengan URL ngrok terbaru:
FRONTEND_URL=https://mini-hackathon-kb-hold.vercel.app
BACKEND_URL=https://xxxx-xx.ngrok-free.app

3. Konfigurasi Vercel
Buka Dashboard Vercel > Project > Settings > Environment Variables.
Perbarui VITE_API_URL dengan URL ngrok yang aktif.
Lakukan Redeploy pada proyek frontend.

4. Menjalankan Server Python
Masuk ke direktori backend dan jalankan skrip utama:
cd backend
python3 swv6.py

Alur Demo
| # | Aksi | Hasil |
| 1 | Jalankan `python3 swv6.py` | QR Code muncul di layar komputer |
| 2 | Buka `https://mini-hackathon-kb-hold.vercel.app/pairing-hub` di HP | Halaman scanner muncul |
| 3 | Scan QR Python dari HP (kamera depan) | HP pindah ke halaman **Live Shopping** |
| 4 | Kamera Python menyala otomatis | Jendela deteksi muncul di komputer |
| 5 | Taruh produk di depan kamera laptop | Barang muncul **realtime** di HP |
| 6 | Klik **"Proceed to Exit"** di HP | Kamera Python **mati otomatis** |
| 7 | HP masuk halaman **Transaction Success** | Checkout selesai |
| 8 | Buka halaman **Wallet** di HP | Transaction log & balance terupdate |
