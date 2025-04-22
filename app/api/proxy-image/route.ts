import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';
import https from 'https';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;
  
  if (!url || Array.isArray(url)) {
    return res.status(400).json({ error: 'URL parameter is required and must be a string' });
  }

  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);
    
    // Choose http or https based on the URL
    const protocol = decodedUrl.startsWith('https') ? https : http;

    const imageResponse = await new Promise<Buffer>((resolve, reject) => {
      protocol.get(decodedUrl, (response) => {
        // Check if the response is successful
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to fetch image: ${response.statusCode}`));
        }

        // Set appropriate content type for response
        const contentType = response.headers['content-type'];
        if (contentType) {
          res.setHeader('Content-Type', contentType);
        }
        
        // Set cache control headers
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        
        // Collect data chunks
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });

    // Send the image data directly
    res.send(imageResponse);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
}
