**Team Name:** Mie Ayam Mul

| Member | Role |
|--------|------|
| **Kian Aurelio Wibowo** | Development |
| **Bryan Carlos Matruti** | Development |



# KBhold
**Smart Payments for Smart Retail**
A next-generation smart retail solution that combines AI-powered computer vision with reversible payment technology to eliminate checkout queues and reduce retail shrinkage.

## Problem Statement

Critical Challenges in Modern Retail
Checkout Process Inefficiency
Current retail payment systems are typically centralized at a single exit point, often worsened by understaffed checkout counters. This creates significant bottlenecks and long queues, leading to a frustrating customer experience. This time inefficiency negatively impacts consumer interest in visiting physical stores, driving them toward more convenient digital alternatives.

Fraud Risks and Inventory Shrinkage
The risk of item manipulation and consumer dishonesty remains the primary obstacle to adopting conventional self-checkout technology. Without a robust verification system, automated payment processes create new vulnerabilities for theft. This lack of security hampers the digital transformation of the retail sector, as businesses fear the financial impact of increased inventory shrinkage.

KBhold addresses both problems simultaneously through intelligent cart tracking and a revolutionary pre-authorization payment system.

---

## Core Features

### Smart Cart Pairing
Seamlessly connect your mobile device to any smart cart via QR code scanning. Once paired, the cart becomes your personal shopping assistant.

### AI-Powered Live Shopping
Real-time item detection using YOLOv8 computer vision. Items placed in the cart are automatically identified, priced, and added to your virtual cart - no manual scanning required.

### Risk Scoring System
An intelligent security monitoring system that assigns risk levels to shopping sessions:

Low Risk (Green Status)
Condition: Normal shopping behavior with weight deviation below 5%.
Action: Auto-Approve feature enabled for instant checkout without additional verification.

Medium Risk (Yellow Status)
Condition: Anomalous patterns detected (e.g., items repeatedly entering and leaving the cart).
Action: Monitoring frequency increased; verification prompts triggered on the user's mobile app.

High Risk (Red Status)
Condition: Significant discrepancy between digital data and physical weight (Risk Score < 40).
Action: Auto-Lock protocol activated; emergency alerts triggered, and store staff notified automatically.

### KBhold Pre-Auth
Revolutionary reversible payment logic powered by Paylabs:
Hold (Cart Total + 15% Buffer) -> Shop -> Capture Final Amount OR Release Funds

- **Pre-Authorization Hold**: Funds are reserved, not charged
- **15% Safety Buffer**: Covers potential additional items
- **Auto-Capture**: Final amount charged upon exit
- **Instant Release**: Unused funds immediately available


## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SMARTHOLD SYSTEM                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   SMART CART │     │  EDGE DEVICE │     │    CLOUD     │     │   MOBILE    │
│   (Hardware) │────▶│   (YOLOv8)   │────▶│  (Supabase)  │────▶│    (React)  │
└──────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
       │                    │                    │                     │
       │                    │                    │                     │
       ▼                    ▼                    ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│ - Camera     │     │ - Object     │     │ - PostgreSQL │     │ - Cart View │
│ - Sensors    │     │   Detection  │     │ - Real-time  │     │ - Payment   │
│ - Weight     │     │ - Tracking   │     │   WebSockets │     │ - History   │
│   Scale      │     │ - Validation │     │ - Auth       │     │ - Profile   │
└──────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
                                                   │
                                                   ▼
                                          ┌──────────────┐
                                          │   PAYLABS    │
                                          │  Payment API │
                                          │ - Pre-Auth   │
                                          │ - Capture    │
                                          │ - Release    │
                                          └──────────────┘
```
**Penjelasan** 
KBhold menggunakan arsitektur Edge-to-Cloud. Proses identifikasi barang dilakukan secara lokal oleh Python Backend (YOLOv8) untuk memastikan latensi rendah, kemudian data disinkronkan ke Supabase Cloud agar dapat diakses oleh aplikasi React pengguna secara real-time dari mana saja.


### Data Flow

1. **Detection**: Camera captures cart contents; YOLOv8 identifies items
2. **Validation**: Detected items cross-referenced with weight sensor data
3. **Sync**: Cart state pushed to Supabase via WebSocket
4. **UI Update**: React frontend reflects real-time cart changes
5. **Payment**: Pre-auth hold initiated; final capture on checkout


## Tech Stack

| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend & Cloud** | Supabase (Auth, PostgreSQL, Real-time WebSockets) |
| **AI Engine** | YOLOv8 (Object Detection) |
| **IoT Integration** | Python backend for hardware sensor & camera control |
| **Payment Gateway** | Paylabs (Pre-Authorization Hold + 15% buffer logic) |


## Installation & Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase Account

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r req.txt

# Run the backend server
python swv6.py
```
