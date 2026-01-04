// Vercel Serverless Function - n8n Proxy
// Routes: Tasks, Habits, Protocols, Calendar Events

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
    // Tasks
    'lifeos-tasks': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-tasks',
    'lifeos-projects': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-projects',
    'lifeos-toggle': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-toggle',
    'lifeos-create-task': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-create-task',
    'lifeos-update-task': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-update-task',
    'lifeos-delete-task': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-delete-task',
    // Habits
    'lifeos-protocols': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-protocols',
    'lifeos-habits': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-habits',
    'lifeos-habit-logs': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-habit-logs',
    'lifeos-toggle-habit': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-toggle-habit',
    'lifeos-create-protocol': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-create-protocol',
    'lifeos-create-habit': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-create-habit',
    // Calendar
    'lifeos-events': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-events',
    'lifeos-event': 'https://hologramblues.app.n8n.cloud/webhook/lifeos-event'
  };

  let targetUrl = endpoints[endpoint];
  
  if (!targetUrl) {
    return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
  }

  try {
    const fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Handle GET requests with query params (for lifeos-events)
    if (req.method === 'GET') {
      fetchOptions.method = 'GET';
      // Pass date query param if provided
      if (req.query.date) {
        targetUrl += `?date=${req.query.date}`;
      }
    } else {
      fetchOptions.method = req.method;
      if (req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}
