export const config = {
    api: {
      bodyParser: false, // Disable Vercel’s built-in body parser
      externalResolver: true, // Bypass any internal Vercel protections
    },
  };
  
  import { URLSearchParams } from 'url';
  
  export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).send("Method Not Allowed");
    }
  
    const contentType = req.headers['content-type'] || '';
    let unique_id;
  
    if (contentType.includes('application/x-www-form-urlencoded')) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
  
      req.on('end', () => {
        const params = new URLSearchParams(body);
        unique_id = params.get('unique_id');
  
        if (!unique_id) {
          return res.status(400).send('unique_id not found in request body');
        }
  
        const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
  <notification_echo>
    <unique_id>${unique_id}</unique_id>
  </notification_echo>`;
        
        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(xmlResponse);
      });
    } else {
      return res.status(400).send("Unsupported Content-Type");
    }
  }  