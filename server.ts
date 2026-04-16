import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { authenticator } = require("otplib");
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// API Routes
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    res.json({ success: true, requires2FA: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

app.post("/api/admin/verify-2fa", (req, res) => {
  const { pin } = req.body;
  const secret = process.env.ADMIN_TOTP_SECRET;

  if (!secret) {
    // Fallback to static PIN if secret is not configured
    const admin2FAPin = process.env.ADMIN_2FA_PIN || "123456";
    if (pin === admin2FAPin) {
      return res.json({ success: true, token: "admin-session-token" });
    }
  } else {
    const isValid = authenticator.check(pin, secret);
    if (isValid) {
      return res.json({ success: true, token: "admin-session-token" });
    }
  }

  res.status(401).json({ success: false, message: "Invalid 2FA code" });
});

app.get("/api/admin/2fa-setup", async (req, res) => {
  // This should ideally be protected by password, but for setup we'll allow it if secret is provided in env
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) {
    return res.status(400).json({ error: "ADMIN_TOTP_SECRET not configured in environment" });
  }

  const otpauth = authenticator.keyuri("Admin", "UP2FLY", secret);
  try {
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    res.json({ qrCodeUrl, secret });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

app.get("/api/price", async (req, res) => {
  try {
    // Try multiple APIs in sequence if one fails
    const apis = [
      {
        url: "https://api.coinbase.com/v2/prices/USDT-USD/spot",
        parser: (data: any) => parseFloat(data.data.amount)
      },
      {
        url: "https://api.binance.com/api/v3/ticker/price?symbol=USDTUSDC",
        parser: (data: any) => parseFloat(data.price)
      }
    ];

    for (const api of apis) {
      try {
        const response = await axios.get(api.url, { timeout: 5000 });
        const price = api.parser(response.data);
        if (price) {
          return res.json({ price });
        }
      } catch (e) {
        console.error(`Failed to fetch from ${api.url}:`, e);
      }
    }

    // Fallback
    res.json({ price: 1.00 });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export default app;
