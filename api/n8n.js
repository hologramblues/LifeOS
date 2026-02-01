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
  
  // n8n webhook base URL
  const N8N_BASE = 'https://hologramblues.app.n8n.cloud/webhook';
  
  // Map endpoints to full URLs
  const endpoints = {
    'lifeos-tasks': `${N8N_BASE}/lifeos-tasks`,
    'lifeos-projects': `${N8N_BASE}/lifeos-projects`,
    'lifeos-toggle-task': `${N8N_BASE}/lifeos-toggle-task`,
    'lifeos-create-task': `${N8N_BASE}/lifeos-create-task`,
    'lifeos-update-task': `${N8N_BASE}/lifeos-update-task`,
    'lifeos-delete-task': `${N8N_BASE}/lifeos-delete-task`,
    'lifeos-create-project': `${N8N_BASE}/lifeos-create-project`,
    'lifeos-note': `${N8N_BASE}/lifeos-note`,
    'lifeos-event': `${N8N_BASE}/lifeos-event`,
    'lifeos-protocols': `${N8N_BASE}/lifeos-protocols`,
    'lifeos-habits': `${N8N_BASE}/lifeos-habits`,
    'lifeos-habit-logs': `${N8N_BASE}/lifeos-habit-logs`,
    'lifeos-toggle-habit': `${N8N_BASE}/lifeos-toggle-habit`,
    'lifeos-create-protocol': `${N8N_BASE}/lifeos-create-protocol`,
    'lifeos-create-habit': `${N8N_BASE}/lifeos-create-habit`,
    'lifeos-events': `${N8N_BASE}/lifeos-events`,
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
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
}
