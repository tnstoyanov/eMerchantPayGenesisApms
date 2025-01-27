export const config = {
    api: {
      bodyParser: false, // Disable automatic body parsing by Vercel
      externalResolver: true, // Bypass internal Vercel protections
    },
  };
  
  import { URLSearchParams } from 'url';
  
  export default async function handler(req, res) {
    // Log the incoming request method and headers for debugging
    console.log('Received request method:', req.method);
    console.log('Request headers:', req.headers);
  
    if (req.method !== 'POST') {
      // Log when the method is not POST
      console.log('Error: Unsupported method:', req.method);
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
        // Log the body content for debugging
        console.log('Request body:', body);
  
        const params = new URLSearchParams(body);
        unique_id = params.get('unique_id');
  
        if (!unique_id) {
          // Log when unique_id is missing
          console.log('Error: unique_id not found in request body');
          return res.status(400).send('unique_id not found in request body');
        }
  
        // Log the unique_id value for confirmation
        console.log('Received unique_id:', unique_id);
  
        const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
  <notification_echo>
    <unique_id>${unique_id}</unique_id>
  </notification_echo>`;
  
        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(xmlResponse);
      });
    } else {
      // Log if the Content-Type is unsupported
      console.log('Error: Unsupported Content-Type:', contentType);
      return res.status(400).send("Unsupported Content-Type");
    }
  }  