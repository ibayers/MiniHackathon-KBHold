# 🎬 KBhold — Demo Guide

## ⚙️ Persiapan (Lakukan sekali sebelum presentasi)

### 1. Jalankan ngrok
```bash
ngrok http 5000
```
Catat URL yang muncul, contoh: `https://xxxx-xx.ngrok-free.app`

### 2. Update `backend/.env`
```env
FRONTEND_URL=https://mini-hackathon-kb-hold.vercel.app
BACKEND_URL=https://xxxx-xx.ngrok-free.app   # ← ganti dengan URL ngrok tadi
```

### 3. Update Vercel Environment Variable
Masuk ke [Vercel Dashboard](https://vercel.com) → Project → Settings → Environment Variables → update:
```
VITE_API_URL = https://xxxx-xx.ngrok-free.app
```
Lalu klik **Redeploy**.

### 4. Jalankan Python backend
```bash
cd backend
python3 swv6.py
```
Jendela QR Code muncul di layar komputer → siap demo.

---

## 🎯 Alur Demo

| # | Aksi | Hasil |
|---|------|-------|
| 1 | Jalankan `python3 swv6.py` | QR Code muncul di layar komputer |
| 2 | Buka `https://mini-hackathon-kb-hold.vercel.app/pairing-hub` di HP | Halaman scanner muncul |
| 3 | Scan QR Python dari HP (kamera depan) | HP pindah ke halaman **Live Shopping** |
| 4 | Kamera Python menyala otomatis | Jendela deteksi muncul di komputer |
| 5 | Taruh produk di depan kamera laptop | Barang muncul **realtime** di HP |
| 6 | Klik **"Proceed to Exit"** di HP | Kamera Python **mati otomatis** |
| 7 | HP masuk halaman **Transaction Success** | Checkout selesai |
| 8 | Buka halaman **Wallet** di HP | Transaction log & balance terupdate ✅ |

---

## 🔄 Reset untuk Demo Ulang

```bash
# Jalankan ulang Python — QR baru muncul
python3 swv6.py
```
Ulangi dari step 2.
