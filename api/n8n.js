export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint } = req.query;
  const N8N_BASE = 'https://jeremiegalan.app.n8n.cloud/webhook';
  
  const allowedEndpoints = [
    'lifeos-tasks',
    'lifeos-projects', 
    'lifeos-toggle',
    'lifeos-create-task'
  ];

  if (!endpoint || !allowedEndpoints.includes(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const url = `${N8N_BASE}/${endpoint}`;
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
