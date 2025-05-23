const WebSocket = require('ws');
const express = require('express');
const app = express();

const wss = new WebSocket.Server({ port: 8765 });

console.log('God Max Pro Screen Share WebSocket running on port 8765');

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'screen-capture') {
      // Broadcast to all other connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
      
      // Process for AI context
      processScreenCapture(data);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function processScreenCapture(data) {
  // Task detection logic
  const context = {
    timestamp: data.timestamp,
    resolution: data.resolution,
    taskType: detectTask(data),
    metadata: data.metadata
  };
  
  // Send to n8n webhook if needed
  if (context.taskType !== 'idle') {
    sendToN8n(context);
  }
}

function detectTask(data) {
  // Simple task detection based on window title or content
  if (data.metadata?.windowTitle?.includes('n8n')) return 'workflow-building';
  if (data.metadata?.windowTitle?.includes('Code')) return 'coding';
  if (data.metadata?.windowTitle?.includes('Chrome')) return 'browsing';
  return 'general';
}

function sendToN8n(context) {
  // Implementation for sending to n8n webhook
  console.log('Sending context to n8n:', context.taskType);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', connections: wss.clients.size });
});

app.listen(8766, () => {
  console.log('Health check HTTP server on port 8766');
});