const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

// Middleware to parse XML body
app.use(bodyParser.text({ type: 'application/xml' }));

// Allow CORS (optional if frontend and backend are on the same origin)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Proxy endpoint
app.post('/proxy', async (req, res) => {
    const url = 'https://staging.gate.emerchantpay.net/process/d106328b40771dfc4ab0e5396ee153aec4721671';

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
        res.status(response.status).send(data);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
