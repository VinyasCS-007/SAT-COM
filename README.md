# 🛰️ Fault-Tolerant Satellite Communication System with AI-Integrated Error Correction

> **Intelligent, adaptive error correction for space-grade reliability—simulated on Earth.**

---

## 📘 Project Overview

This project simulates a **satellite-to-ground communication pipeline** that fuses **classical error-correcting codes (ECCs)**—including CRC, Hamming, and Reed–Solomon—with a **machine learning model** that dynamically predicts and corrects bit errors under varying channel noise. By combining deterministic coding theory with data-driven intelligence, the system achieves higher resilience than fixed-algorithm approaches, especially in low-SNR or burst-noise environments typical of LEO/GEO links.

The simulation models end-to-end transmission: from payload encoding → channel corruption → ECC decoding → AI-assisted recovery—enabling researchers and engineers to benchmark hybrid strategies for next-generation space communication.

---

## 🎯 Objective

To design and simulate a **fault-tolerant, AI-augmented communication system** that:
- Maintains data integrity under realistic noise (AWGN, burst errors, fading)
- Dynamically selects or combines ECC schemes based on real-time channel telemetry
- Uses a trained neural model to recover payloads when traditional ECC fails  
This mirrors ongoing research at **ISRO’s URSC** into intelligent, autonomous communication for deep-space missions and inter-satellite networks.

---

## 🧠 Concept Overview

The system models a full communication stack:

1. **Payload Generation**: Random or structured binary data.
2. **ECC Encoding**: Encoded using CRC (detection), Hamming (1-bit correction), or Reed–Solomon (burst correction).
3. **Channel Simulation**: Noise (AWGN, impulse bursts) and SNR degradation applied.
4. **ECC Decoding**: Standard decoding attempted.
5. **AI Correction Layer**: If decoding fails or BER exceeds threshold, a neural model predicts/corrects corrupted bits.
6. **Adaptive Controller**: Monitors SNR, BER trends, and packet loss to **switch ECC strategies** in real time.

The AI component learns from historical error patterns, enabling **proactive adaptation**—not just reactive correction.

---

## ⚙️ Tech Stack

| Layer          | Technologies |
|----------------|--------------|
| **Core Logic** | Python 3.10+, NumPy, SciPy |
| **ECC**        | `crcmod`, custom Hamming, `reedsolo` |
| **AI/ML**      | TensorFlow/Keras, scikit-learn |
| **Backend API**| FastAPI (async support, auto-generated OpenAPI docs) |
| **Frontend**   | **React.js** (TypeScript), Vite, Tailwind CSS, Recharts |
| **State Mgmt** | React Context / Zustand |
| **Data**       | SQLite (local telemetry logs), CSV for batch results |
| **DevOps**     | Docker, GitHub Actions, Poetry |

---

## 📂 Folder Structure

```bash
satcom-ai/
├── backend/
│   ├── core/
│   │   ├── ecc/                # CRC, Hamming, Reed–Solomon
│   │   ├── channel/            # Noise simulators
│   │   └── ai/                 # TensorFlow models
│   ├── controller/             # Adaptive logic
│   ├── api/
│   │   └── main.py             # FastAPI app
│   ├── data/
│   │   └── telemetry.db        # SQLite logs
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Dashboard panels
│   │   ├── services/           # API clients
│   │   ├── hooks/              # Custom React hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── package.json
│
├── models/                     # Saved .h5 model weights
├── experiments/                # Notebooks, training scripts
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## 🧩 Core Components

### **Data Simulation Module**
- Generates binary payloads (random or file-based)
- Simulates LEO/GEO link conditions: variable SNR, Doppler shift, burst errors

### **ECC Module**
- **CRC-32**: For error detection
- **Hamming (7,4)**: Corrects single-bit flips
- **Reed–Solomon (255,223)**: Handles burst errors (used in Voyager, QR codes)

### **AI Model**
- **Architecture**: 1D-CNN trained as a denoising autoencoder
- **Input**: Noisy codeword + SNR context (shape: `[n_bits + 1]`)
- **Output**: Corrected bits (probabilistic sigmoid output)
- **Framework**: TensorFlow/Keras (exportable to ONNX/TFLite)

### **Adaptive Controller**
- Sliding-window analysis of SNR, BER, and ECC success rate
- Rule-based engine with configurable thresholds
- Optional: ML classifier to predict optimal ECC

### **Visualization Dashboard (React)**
- Real-time BER vs. SNR line charts (Recharts)
- ECC switching timeline (interactive timeline component)
- Payload integrity heatmap (bit-level visualization)
- AI correction confidence meter
- Simulation controls (SNR slider, noise type, payload size)

---

## 🧮 Example Workflow

```
[Original Bits] 
       ↓
[ECC Encoder] → e.g., Reed–Solomon
       ↓
[Noisy Channel] → Add AWGN + burst errors (SNR = 8 dB)
       ↓
[ECC Decoder] → Fails (uncorrectable burst)
       ↓
[AI Correction Model] → Recovers 92% of bits
       ↓
[Verified Output] → BER reduced from 0.15 → 0.003
```

Performance metrics (BER, latency, success rate) are logged per frame and streamed to the React dashboard via WebSocket or polling.

---

## 📊 Evaluation Metrics

| Metric                     | Description |
|---------------------------|-------------|
| **Bit Error Rate (BER)**  | Pre- vs. post-correction error ratio |
| **Correction Success Rate** | % of frames fully recovered |
| **Latency Overhead**      | AI + ECC vs. ECC-only (ms/frame) |
| **Adaptive Accuracy**     | % of optimal ECC selections under dynamic SNR |
| **Throughput Efficiency** | Effective data rate after retransmissions |

All metrics are visualized in the React dashboard with export-to-CSV functionality.

---

## 🚀 Features

- ✅ **Adjustable noise profiles** (AWGN, Rayleigh fading, impulse bursts)
- ✅ **Live BER/SNR dashboard** with interactive Recharts visualizations
- ✅ **Toggle ECC schemes** manually or enable auto-adaptation
- ✅ **Retrain AI model** on custom noise datasets (via backend CLI)
- ✅ **Export simulation reports** (CSV/PDF)
- ✅ **Real-time communication graph** showing frame success/failure
- ✅ **Responsive UI** built with Tailwind CSS (works on desktop & tablet)

---

## 🧪 Installation and Usage

### Prerequisites
- Python 3.10+
- Node.js 18+
- SQLite (usually preinstalled)

### Clone & Setup
```bash
git clone https://github.com/your-username/satcom-ai.git
cd satcom-ai
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Frontend (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
# Visit: http://localhost:5173
```

### Docker (One-Click Run)
```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

### Sample API Call (from React)
```ts
// services/api.ts
const simulate = async (config: SimulationConfig) => {
  const res = await fetch('http://localhost:8000/transmit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
};
```

### Expected Output (Dashboard)
- Real-time chart updating BER as SNR changes
- Color-coded frame status (green = success, red = AI-corrected, gray = failed)
- Toggle buttons for ECC modes with live performance comparison

---

## 🔮 Future Enhancements

- 🤖 **Reinforcement Learning** for optimal ECC switching policy
- 🌐 **Multi-satellite constellation simulation** (inter-satellite links)
- 📡 **SDR Integration** (GNU Radio/USRP) for over-the-air testing
- 🔐 **End-to-end encryption** with integrity verification
- 🌍 **Geospatial visualization** of ground station coverage using MapLibre
- 📱 **PWA support** for offline simulation on field devices

---

## 🛰️ Relevance to ISRO/URSC

This project aligns closely with **ISRO URSC’s research** into autonomous, fault-tolerant communication for future missions like **Chandrayaan-4**, **Mangalyaan-2**, and inter-satellite optical networks. URSC emphasizes **AI-assisted telemetry**, adaptive coding, and redundancy management in deep-space environments where retransmission is impossible. By simulating intelligent error correction under resource constraints, this system provides a testbed for concepts that could enhance the reliability of India’s next-generation space infrastructure.

---

## 🧠 Notes for Developers / Students

This project is ideal for:
- **University capstone projects** in communications or AI
- **ISRO/DRDO internship applications**
- **Hackathons** (e.g., Smart India Hackathon, NASA Space Apps)
- **Open-source contributions** to space-tech communities

> 💡 **Tip**: Keep modules decoupled—swap AI models, ECC schemes, or channel simulators independently. Experiment with lightweight models (e.g., MobileNet-style CNNs) for potential CubeSat deployment. The React frontend is built for extensibility—add new visualization panels without touching core logic.

---

## 📚 References

1. Lin, S., & Costello, D. J. (2004). *Error Control Coding*. Pearson.  
2. Richardson, T., & Urbanke, R. (2008). *Modern Coding Theory*. Cambridge.  
3. Nachmani, E., et al. (2016). *Learning to Decode Linear Codes*. arXiv:1612.05872.  
4. ISRO URSC Technical Reports on Telemetry, Tracking & Command (TTC) Systems.  
5. `reedsolo` Python Library: https://pypi.org/project/reedsolo/  
6. CCSDS Recommended Standards for Telemetry Channel Coding  
7. FastAPI Documentation: https://fastapi.tiangolo.com  
8. Recharts: https://recharts.org

---

> 🌌 **Code • Create • Innovate • Repeat**  
> Built with ❤️ for the future of resilient space communication.