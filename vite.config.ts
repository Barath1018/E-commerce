import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-routes',
        configureServer(server) {
          server.middlewares.use('/api/create-order', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const { amount, currency = 'INR', receipt } = JSON.parse(body);

                if (!amount || amount < 100) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Amount must be at least 100 paise' }));
                  return;
                }

                const keyId = env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID;
                const keySecret = env.RAZORPAY_KEY_SECRET;

                if (!keyId || !keySecret) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Razorpay credentials not configured' }));
                  return;
                }

                const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

                const response = await fetch('https://api.razorpay.com/v1/orders', {
                  method: 'POST',
                  headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount: Math.round(amount),
                    currency,
                    receipt: receipt || `receipt_${Date.now()}`,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: data.error?.description || data.message || 'Razorpay API error' }));
                  return;
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  order_id: data.id,
                  amount: data.amount,
                  currency: data.currency,
                }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });

          server.middlewares.use('/api/verify-payment', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body);

                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Missing required payment fields' }));
                  return;
                }

                const keySecret = env.RAZORPAY_KEY_SECRET;
                if (!keySecret) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Razorpay secret not configured' }));
                  return;
                }

                const { createHmac } = await import('crypto');
                const expectedSignature = createHmac('sha256', keySecret)
                  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                  .digest('hex');

                if (expectedSignature !== razorpay_signature) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ verified: false, error: 'Payment signature verification failed' }));
                  return;
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  verified: true,
                  order_id: razorpay_order_id,
                  payment_id: razorpay_payment_id,
                }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });
        },
      },
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
