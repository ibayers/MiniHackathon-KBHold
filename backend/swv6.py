import csv
import threading
import socket
from datetime import datetime
from ultralytics import YOLO
import cv2
from flask import Flask, jsonify, render_template_string, request
import qrcode
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

keranjang_global = {}
total_harga_global = 0

connected_event = threading.Event()
checkout_event = threading.Event()
keranjang_terakhir_checkout = {}  # Simpan keranjang terakhir untuk tampil di web
total_harga_terakhir_checkout = 0

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Smart Cart</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
        .total { font-size: 24px; font-weight: bold; margin-top: 20px; color: green; }
        button {
            font-size: 18px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            margin-top: 20px;
        }
        button:disabled {
            background-color: #aaa;
            cursor: not-allowed;
        }
    </style>
    <script>
        window.onload = () => {
            fetch('/connect').then(resp => resp.text()).then(console.log);

            function fetchData() {
                fetch('/data')
                .then(resp => resp.json())
                .then(data => {
                    let html = '<h2>Keranjang Belanja</h2>';
                    if (Object.keys(data.keranjang).length === 0) {
                        html += "<p>Keranjang kosong</p>";
                        document.getElementById('btnCheckout').disabled = true;
                    } else {
                        for (const [item, details] of Object.entries(data.keranjang)) {
                            html += `<div class="item">${item}: ${details.qty} x Rp${details.harga} = <b>Rp${details.subtotal}</b></div>`;
                        }
                        html += `<div class="total">Total Bayar: Rp${data.total_harga}</div>`;
                        document.getElementById('btnCheckout').disabled = false;
                    }
                    document.getElementById('content').innerHTML = html;
                });
            }

            setInterval(fetchData, 1000);
            fetchData();

            document.getElementById('btnCheckout').onclick = () => {
                fetch('/checkout', {method: 'POST'})
                .then(resp => resp.json())
                .then(data => {
                    if (data.success) {
                        let html = "<h2>Detail Checkout</h2>";
                        for (const [item, detail] of Object.entries(data.keranjang)) {
                            html += `<div class="item">${item}: ${detail.qty} x Rp${detail.harga} = <b>Rp${detail.subtotal}</b></div>`;
                        }
                        html += `<div class="total">Total Bayar: Rp${data.total_harga}</div>`;
                        html += "<p>Terima kasih telah berbelanja!</p>";
                        document.getElementById('content').innerHTML = html;
                        document.getElementById('btnCheckout').disabled = true;
                    } else {
                        alert(data.message);
                    }
                }).catch(() => alert("Gagal melakukan checkout."));
            }
        }
    </script>
</head>
<body>
    <div id="content">Memuat keranjang...</div>
    <button id="btnCheckout" disabled>Bayar / Checkout</button>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/connect')
def connect():
    if not connected_event.is_set():
        connected_event.set()
        print("HP connected, kamera akan dinyalakan...")
    return "Smart Cart Connected! Kamera dinyalakan."

@app.route('/data')
def data():
    return jsonify({"keranjang": keranjang_global, "total_harga": total_harga_global})

@app.route('/checkout', methods=['POST'])
def checkout():
    global keranjang_global, total_harga_global, keranjang_terakhir_checkout, total_harga_terakhir_checkout

    if not keranjang_global or total_harga_global == 0:
        return jsonify({"success": False, "message": "Keranjang kosong, silahkan tambah produk dulu."})

    waktu_transaksi = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    nama_file = f"transaksi_{waktu_transaksi}.csv"

    try:
        with open(nama_file, mode="w", newline="", encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["Nama Produk", "Kuantitas", "Harga Satuan", "Subtotal"])
            for item, detail in keranjang_global.items():
                writer.writerow([item, detail["qty"], detail["harga"], detail["subtotal"]])
            writer.writerow(["", "", "TOTAL BAYAR", total_harga_global])
    except Exception as e:
        print("Gagal simpan CSV:", e)
        return jsonify({"success": False, "message": "Gagal simpan data transaksi."})

    # Simpan keranjang terakhir untuk ditampilkan di web
    keranjang_terakhir_checkout = keranjang_global.copy()
    total_harga_terakhir_checkout = total_harga_global

    # Set checkout event untuk hentikan loop kamera
    checkout_event.set()

    # Reset keranjang global
    keranjang_global.clear()
    total_harga_global = 0

    return jsonify({
        "success": True,
        "message": f"Pembayaran berhasil! Data tersimpan di {nama_file}",
        "keranjang": keranjang_terakhir_checkout,
        "total_harga": total_harga_terakhir_checkout
    })

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def run_flask():
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)

def main():
    global keranjang_global, total_harga_global, connected_event, checkout_event

    ip_address = get_ip()
    # url_web = f"http://{ip_address}:5000"
    url_web = f"http://{ip_address}:5174/live-shopping"

    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(url_web)
    qr.make(fit=True)
    img_qr = qr.make_image(fill_color="black", back_color="white")
    img_qr_cv = np.array(img_qr.convert('RGB'))
    img_qr_cv = cv2.cvtColor(img_qr_cv, cv2.COLOR_RGB2BGR)

    cv2.imshow("Scan QR Code Ini di HP", img_qr_cv)
    print(f"Scan QR ini atau buka manual: {url_web}")

    while not connected_event.is_set():
        if cv2.waitKey(100) & 0xFF == ord("q"):
            cv2.destroyAllWindows()
            print("User menekan q, keluar.")
            return

    cv2.destroyWindow("Scan QR Code Ini di HP")
    print("HP terhubung ✅ Kamera dinyalakan...")

    model = YOLO("best.pt")
    cap = cv2.VideoCapture(0)

    harga_produk = {
        "kopi": 5000,
        "aqua": 3000
    }

    if not cap.isOpened():
        print("Kamera tidak bisa dibuka")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame, conf=0.25)
        annotated_frame = results[0].plot()

        keranjang = {}
        total_harga = 0
        keranjang_detail = {}

        for box in results[0].boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id].lower()
            keranjang[class_name] = keranjang.get(class_name, 0) + 1
            if class_name in harga_produk:
                total_harga += harga_produk[class_name]

        for item, qty in keranjang.items():
            harga_satuan = harga_produk.get(item, 0)
            keranjang_detail[item] = {
                "qty": qty,
                "harga": harga_satuan,
                "subtotal": harga_satuan * qty
            }

        keranjang_global = keranjang_detail
        total_harga_global = total_harga

        y_pos = 30
        for item, qty in keranjang.items():
            harga_satuan = harga_produk.get(item, 0)
            subtotal = harga_satuan * qty
            teks_item = f"{item}: {qty} x Rp{harga_satuan} = Rp{subtotal}"
            cv2.putText(annotated_frame, teks_item, (10, y_pos),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            y_pos += 30

        teks_total = f"TOTAL BAYAR: Rp{total_harga}"
        cv2.putText(annotated_frame, teks_total, (10, y_pos + 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        cv2.putText(annotated_frame, "Tunggu Checkout di HP...", (10, 450),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow("SmartCart Realtime Detection", annotated_frame)

        if checkout_event.is_set():
            print("Checkout dilakukan ✅ Kamera berhenti")
            break

        if cv2.waitKey(1) & 0xFF == ord("q"):
            print("User menekan q, keluar.")
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)