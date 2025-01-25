const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse XML body
app.use(bodyParser.text({ type: 'application/xml' }));

// Allow CORS (optional if frontend and backend are on the same origin)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Token');
    next();
});

// Proxy endpoint
app.post('/proxy', async (req, res) => {
    const transactionTypeMatch = req.body.match(/<transaction_type>(.*?)<\/transaction_type>/);
    const token = req.headers['x-token'];

    if (!transactionTypeMatch || !token) {
        return res.status(400).send('Invalid transaction_type or token value');
    }

    const transactionType = transactionTypeMatch[1];

    console.log(`Transaction Type: ${transactionType}`); // Debugging log
    console.log(`Token: ${token}`); // Debugging log

    const url = `https://staging.gate.emerchantpay.net/process/${token}`;
    console.log(`Request URL: ${url}`); // Debugging log

    // Base64 encode the credentials
    const username = '962236e0e64fc34ec5f8a47fba263d63648c4fa3';
    const password = 'f83478299a487a88043c9113ba5541bdb455e134';
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Authorization': `Basic ${credentials}`, // Add credentials here
            },
            body: req.body,
        });

        const data = await response.text();
        console.log(`Response: ${data}`); // Debugging log
        res.status(response.status).send(data);
    } catch (error) {
        console.error('Error:', error.message); // Debugging log
        res.status(500).send('Error: ' + error.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
