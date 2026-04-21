<div align="center">
  <img src="https://ais-pre-sd3ohmqcx6w5mq5qav54t7-181141938500.asia-southeast1.run.app/favicon.ico" width="100" height="100" alt="UP2FLY Logo">
  <h1>UP2FLY On-Ramp</h1>
  <p><b>Enterprise-Grade USDT Infrastructure for the Modern Web</b></p>
  
  [![Powered by TRST](https://img.shields.io/badge/Powered%20by-TRST-6D28D9?style=for-the-badge)](https://github.com/UP2FLY)
  [![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p><i>The fastest way to onboard users to the USDT (TRC20) ecosystem.</i></p>
</div>

---

## ⚡ The Product

**UP2FLY** is a fintech-first USDT on-ramp platform designed to bridge the gap between traditional fiat payments and the Tron blockchain. Built for scale, security, and extreme speed, UP2FLY provides a non-custodial gateway for instant USDT acquisition.

### 🌟 Why UP2FLY?

Traditional exchanges are slow, complex, and require excessive KYC for small transactions. UP2FLY streamlines this into a **3-step checkout experience**:
1. **Connect**: Wallet-agnostic integration via Web3Modal.
2. **Commit**: Real-time price locking with transparent markups.
3. **Receive**: Automated smart-routing to native TRC20 addresses.

---

## 🏗️ Technical Architecture

UP2FLY utilizes a modern full-stack architecture designed for high availability and low latency.

*   **Frontend**: Built with **React 19** and **Vite** for sub-second load times. Styled with industrial-grade **Tailwind CSS**.
*   **Engine**: A specialized **Node.js** backend managing real-time price discovery from Tier-1 exchanges (Coinbase, Binance).
*   **Data Lake**: **Supabase/PostgreSQL** handles high-concurrency order tracking and business intelligence.
*   **Security Foundation**: Integrated **otplib** for hardware-backed 2FA and **HMAC** for payload integrity.

---

## 🚀 Core Capabilities

### 🛡️ Institutional Security
- **Multi-Factor Auth**: Admin actions are gated by Google Authenticator (TOTP).
- **Non-Custodial**: User funds move directly to their TRC20 wallets; we never touch private keys.
- **Payload Hardening**: Strict regex validation for TRC20 addresses to prevent drainer attacks.

### 📈 Intelligent Pricing
- **Multi-Source Discovery**: Aggregates prices from multiple providers to ensure uptime.
- **Dynamic Markup Engine**: Configurable pricing layers via the secure admin dashboard.
- **Price Slippage Protection**: Visual indicators and network monitoring (Live/Offline status).

### 🎨 Premium Experience
- **Adaptive UI**: Optimized for ultra-responsive mobile and desktop interactions.
- **Framer Motion Engine**: Smooth, meaningful micro-interactions and transitions.
- **Error Resilience**: Integrated global `ErrorBoundary` for 99.9% client-side uptime.

---

## 🛠️ Developer Setup

```bash
# Clone the repository
git clone https://github.com/UP2FLY/onramp.git

# Install enterprise dependencies
npm install

# Initialize environment
cp .env.example .env

# Launch dev cluster
npm run dev
```

---

## 📅 Roadmap

- [x] **v1.0**: Core TRC20 On-Ramp Engine
- [x] **v1.1**: Secure Admin 2FA Dashboard
- [ ] **v1.2**: Multi-Currency Support (BTC, ETH)
- [ ] **v1.3**: Integrated KYC/AML Hook Support
- [ ] **v2.0**: White-label SDK for Developers

---

<div align="center">
  <p><b>Powered by TRST</b></p>
  <p>The standard for trustworthy crypto infrastructure.</p>
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=flat-square" alt="Status">
</div>
