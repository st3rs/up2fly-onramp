# UP2FLY — Secure USDT On-Ramp

[![Powered by TRST](https://img.shields.io/badge/Powered%20by-TRST-blueviolet?style=for-the-badge)](https://github.com/UP2FLY)

**UP2FLY** is a high-performance, secure USDT on-ramp solution designed for seamless transition from fiat to crypto. It enables users to purchase USDT using their credit or debit cards with instant delivery to their TRC20 wallets.

---

## 🚀 Key Features

- **Instant Delivery**: Direct-to-wallet USDT transfers upon successful payment verification.
- **TRC20 Native**: Built specifically for the Tron network to ensure low fees and high speed.
- **Secure Admin Panel**: Full-stack administration dashboard with 2FA (Google Authenticator) protection.
- **Real-time Pricing**: Dynamic price fetching from multiple global exchanges with high availability.
- **Trust-First Architecture**: Robust input validation and security boundaries for TRC20 addresses.
- **Modern UI/UX**: Polished, dark-themed interface built with Tailwind CSS and Framer Motion.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express (Full-stack architecture)
- **Database**: Supabase (PostgreSQL) for order tracking and analytics
- **Web3**: Wagmi & Viem for wallet interactions
- **Security**: 2FA (OTPLIB), HMAC Verification, TRC20 Regex Validation

## ⚙️ Configuration

The application requires several environment variables to function correctly. See `.env.example` for details.

| Variable | Description |
| :--- | :--- |
| `ADMIN_PASSWORD` | Access key for the administrative dashboard |
| `ADMIN_TOTP_SECRET` | Secret key for Google Authenticator (2FA) |
| `VITE_SUPABASE_URL` | Your Supabase project endpoint |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase API key |
| `VITE_WALLETCONNECT_PROJECT_ID` | Integration key for Web3Modal |

## 📦 Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/UP2FLY/onramp.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Copy `.env.example` to `.env` and fill in your credentials.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🛡️ Security & Trust

Security is the core pillar of the UP2FLY infrastructure.

- **Non-Custodial**: We never store your private keys.
- **Verified Operations**: All administrative actions require hardware-backed 2FA.
- **Validation**: Strict schema enforcement for all incoming payloads.

---

<p align="center">
  <b>Powered by TRST</b><br/>
  <i>Secure Fiat-to-Crypto Infrastructure</i>
</p>
