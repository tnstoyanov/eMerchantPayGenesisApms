export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Parse the incoming request body
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // Convert Buffer to string
  });

  req.on("end", () => {
    try {
      // Parse the body as JSON
      const parsedBody = JSON.parse(body);
      const unique_id = parsedBody.unique_id;

      if (!unique_id) {
        res.status(400).send("unique_id not found in request body");
        return;
      }

      // Return the unique_id in the required XML format
      const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<notification_echo>
  <unique_id>${unique_id}</unique_id>
</notification_echo>`;

      res.setHeader("Content-Type", "application/xml");
      res.status(200).send(xmlResponse);
    } catch (error) {
      res.status(400).send("Invalid JSON body");
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing by Vercel
  },
};