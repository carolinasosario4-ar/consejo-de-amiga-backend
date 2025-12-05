import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function App() {
  const FREE_LIMIT = 2;
  const PREMIUM_LIMIT = 5;
  const [plan, setPlan] = useState("free");
  const [sentCount, setSentCount] = useState(0);
  const [screen, setScreen] = useState("home");
  const [showPay, setShowPay] = useState(false);() {
  const FREE_LIMIT = 2;
  const PREMIUM_LIMIT = 5;
  const [plan, setPlan] = useState("free");
  const [sentCount, setSentCount] = useState(0);() {
  const [screen, setScreen] = useState("home");
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);

  const sendMessage = () => {
    const limit = plan === "free" ? FREE_LIMIT : PREMIUM_LIMIT;
    if (sentCount >= limit) {
      alert(`Alcanzaste tu límite semanal de consultas (${limit}).`);
      return;
    } = () => {
    if (!message.trim()) return;
    const entry = {
      id: Date.now(),
      text: message,
      response: null,
      status: "En revisión",
    };
    setSubmissions([...submissions, entry]);
    setMessage("");
    setScreen("list");
    setTimeout(() => {
      generateResponse(entry.id);
    }, 1500);
  };

  const generateResponse = (id) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              response:
                "Mirá... yo que vos me tomo un segundo, respiro y dejo de buscar respuestas afuera. Ya sabés lo que te molesta. Ahora hacete cargo.",
              status: "Respondida",
            }
          : item
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex justify-center">
      {showPay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <Card className="p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Consejo de Amiga — Suscribite a Premium</h2>
            <p className="mb-4 text-gray-700">Acceso a 5 consultas semanales + modo audio exclusivo de Consejo de Amiga.</p>
            <p className="font-semibold mb-4">Consejo de Amiga — Precio: $3500 ARS / mes</p>
            <Button className="w-full mb-2">Pagar con Mercado Pago" onClick={() => {
              // Integración real con Mercado Pago
              fetch("https://api.mercadopago.com/checkout/preferences", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer TU_ACCESS_TOKEN_REAL_AQUI`,
                },
                body: JSON.stringify({
                  items: [
                    {
                      title: "Suscripción Premium — Consejo de Amiga",
                      quantity: 1,
                      unit_price: 3500,
                      currency_id: "ARS",
                    },
                  ],
                  back_urls: {
                    success: "https://tuapp.com/success",
                    failure: "https://tuapp.com/failure",
                    pending: "https://tuapp.com/pending",
                  },
                  auto_return: "approved",
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.init_point) {
                    window.location.href = data.init_point;
                  }
                });
            } — Consejo de Amiga</Button>
            <Button variant="outline" className="w-full" onClick={() => setShowPay(false)}>Cancelar</Button>
          </Card>
        </div>
      )
      <div className="w-full max-w-xl"> bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-xl">
        {screen === "home" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold mb-4">Consejo de Amiga</h1>
            <p className="mb-6 text-gray-700">
              Contame qué te pasa. Te escucho.
            </p>
            <Card className="p-4">
              <Textarea
                placeholder="Escribí tu situación..."
                className="mb-4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendMessage} className="w-full">
                Enviar
              </Button>
            </Card>
          </motion.div>
        )}

        {screen === "list" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold mb-4">Tus consultas</h2>
            <div className="space-y-3">
              {submissions.map((s) => (
                <Card
                  key={s.id}
                  className="p-4 cursor-pointer"
                  onClick={() => {
                    setSelected(s);
                    setScreen("detail");
                  }}
                >
                  <CardContent>
                    <p className="font-medium truncate">{s.text}</p>
                    <p className="text-sm text-gray-500">{s.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={() => setScreen("home")}
              variant="outline"
              className="mt-6 w-full"
            >
              Nueva consulta
            </Button>
          </motion.div>
        )}

        {screen === "detail" && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setScreen("list")}
            >
              ← Volver
            </Button>
            <h2 className="text-2xl font-bold mb-4">Tu consulta</h2>
            <Card className="p-4 mb-4">
              <p>{selected.text}</p>
            </Card>
            <h3 className="text-xl font-semibold mb-2">Consejo</h3>
            <Card className="p-4">
              {selected.response ? (
                <p>{selected.response}</p>
              ) : (
                <p className="italic text-gray-500">Analizando...</p>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

---

# Backend files

## `/backend/index.js`
```js
/* Backend mínimo para Consejo de Amiga
   - Express + Mercadopago
   - Endpoints: create-preference, webhook
   - DB: Postgres (pg)
   - Cron: reset semanal
   Reemplazá las variables de entorno en .env antes de deployar.
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mercadopago = require('mercadopago');
const { Pool } = require('pg');
const cron = require('node-cron');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Mercado Pago
mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });

// Configure Postgres pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helpers
const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no auth' });
  const token = auth.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};

// --- Auth simple (email/password) ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, plan, sent_count',
      [email, hashed]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing fields' });
  try {
    const result = await pool.query('SELECT id, email, password_hash, plan, sent_count FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'user not found' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, plan: user.plan, sent_count: user.sent_count } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// --- Create preference (checkout) ---
app.post('/api/payments/create-preference', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const preference = {
      items: [
        {
          title: 'Suscripción Premium — Consejo de Amiga',
          quantity: 1,
          unit_price: Number(process.env.PREMIUM_PRICE) || 3500,
          currency_id: 'ARS'
        }
      ],
      payer: {
        // Optional: you can set payer fields or leave Mercado Pago to ask payer data
      },
      external_reference: userId,
      back_urls: {
        success: `${process.env.BASE_URL}/pago-exitoso`,
        failure: `${process.env.BASE_URL}/pago-fallido`,
        pending: `${process.env.BASE_URL}/pago-pendiente`
      },
      auto_return: 'approved'
    };

    const mpResponse = await mercadopago.preferences.create(preference);
    return res.json(mpResponse.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error creating preference' });
  }
});

// --- Webhook for Mercado Pago notifications ---
app.post('/api/payments/webhook', async (req, res) => {
  try {
    // Mercado Pago may send different payloads. We'll try to extract payment id.
    const body = req.body;
    // If MP sends 'type' and 'data.id' (recommended)
    let paymentId = null;
    if (body.type === 'payment' && body.data && body.data.id) paymentId = body.data.id;
    // older format
    if (!paymentId && body['collection'] && body['collection']['id']) paymentId = body['collection']['id'];

    if (!paymentId) {
      console.log('Webhook received without payment id', body);
      return res.status(200).send('no payment id');
    }

    // Fetch payment detail
    const paymentDetail = await mercadopago.payment.findById(paymentId);
    const payment = paymentDetail.body;
    console.log('MP payment status:', payment.status);

    // Only act on approved payments
    if (payment.status === 'approved') {
      const external = payment.external_reference; // expect userId
      const mpId = payment.id;
      const amount = payment.transaction_amount || payment.total_paid_amount || null;
      // Update payments table
      await pool.query(
        'INSERT INTO payments (user_id, mp_payment_id, status, amount) VALUES ($1, $2, $3, $4)',
        [external, mpId, payment.status, amount]
      );
      // Activate premium: set plan and premium_until
      const now = new Date();
      const until = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
      await pool.query('UPDATE users SET plan=$1, premium_until=$2 WHERE id=$3', ['premium', until.toISOString(), external]);
      console.log(`Activated premium for user ${external} until ${until.toISOString()}`);
    }

    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).send('error');
  }
});

// --- Submissions endpoints ---
app.post('/api/submissions', authenticate, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'missing text' });
  try {
    const result = await pool.query(
      'INSERT INTO submissions (user_id, text, status) VALUES ($1, $2, $3) RETURNING id, text, status, created_at',
      [req.user.id, text, 'En revisión']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/submissions', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, text, response, status, created_at FROM submissions WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Admin: simple protected route using ADMIN_USER/ADMIN_PASS
app.post('/api/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET);
    return res.json({ token });
  }
  return res.status(401).json({ error: 'invalid' });
});

app.get('/api/admin/users', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no auth' });
  const token = auth.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data.admin) return res.status(403).json({ error: 'forbidden' });
    const result = await pool.query('SELECT id, email, plan, sent_count, premium_until FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
});

// --- Cron: reset weekly counters (Sunday 00:00 America/Argentina/Cordoba)
cron.schedule('0 3 * * 0', async () => {
  // Using 3:00 UTC offset handling; adjust if needed for DST
  try {
    await pool.query('UPDATE users SET sent_count = 0');
    console.log('Weekly sent_count reset executed');
  } catch (err) {
    console.error('Cron reset error', err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
```

## `/backend/package.json`
```json
{
  "name": "consejo-de-amiga-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.1.4",
    "express": "^4.18.2",
    "jsonweb" : "^1.0.0",
    "jsonwebtoken": "^9.0.0",
    "mercadopago": "^2.4.0",
    "node-cron": "^3.0.2",
    "pg": "^8.11.0",
    "nodemon": "^3.0.1"
  }
}
```

> Nota: en `package.json` puede que aparezca `nodemon` como devDependency; está incluido para desarrollo.

---

## `/backend/README.md`
```md
# Backend - Consejo de Amiga

## Setup local
1. Clonar repo y ubicarse en /backend
2. Copiar `.env.example` a `.env` y completar las variables
3. Instalar dependencias: `npm install`
4. Levantar la app en dev: `npm run dev`

## Variables de entorno mínimas
- PORT (opcional)
- MERCADOPAGO_ACCESS_TOKEN
- MERCADOPAGO_PUBLIC_KEY (opcional)
- DATABASE_URL (postgres)
- BASE_URL (https://tu-dominio.com)
- JWT_SECRET (random long string)
- ADMIN_USER / ADMIN_PASS
- PREMIUM_PRICE (ej. 3500)

## Deploy
- Subir a Render o Vercel (servicio serverless). En Vercel, usá una Function o serverless.
- Configurar variables de entorno en el dashboard.
- Configurar Webhook en Mercado Pago apuntando a `${BASE_URL}/api/payments/webhook`.

## Notas
- Usá el modo Sandbox de Mercado Pago para pruebas reemplazando el token por uno de sandbox.
- No subas tus tokens a repos públicos.
```
```
}]}
