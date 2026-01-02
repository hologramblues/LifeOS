// Vercel Serverless Function - n8n Proxy
// Routes: lifeos-tasks, lifeos-projects, lifeos-toggle, lifeos-create-task, lifeos-update-task

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint } = req.query;
  
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  // Map endpoints to n8n webhook URLs
  const endpoints = {
    'lifeos-tasks': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-tasks',
    'lifeos-projects': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-projects',
    'lifeos-toggle': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-toggle',
    'lifeos-create-task': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-create-task',
    'lifeos-update-task': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-update-task',
    'lifeos-delete-task': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-delete-task'
  };

  const targetUrl = endpoints[endpoint];
  
  if (!targetUrl) {
    return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}
