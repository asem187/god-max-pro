const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.json());

const PORT = 8899;
const MEMORY_PATH = '/data/memory.json';

app.get('/auto-brief-new-bot', async (req, res) => {
  try {
    const memoryData = await fs.readFile(MEMORY_PATH, 'utf8');
    const memory = JSON.parse(memoryData);
    
    const briefing = {
      project: "God Max Pro - Omnipresent AI Automation System",
      repository: "https://github.com/asem187/god-max-pro",
      systemStatus: {
        n8n: {
          url: "http://localhost:5678",
          credentials: "asem18@gmail.com / Janabi1221!",
          status: "operational"
        },
        openWebUI: {
          url: "http://localhost:3000",
          credentials: "asem18@gmail.com",
          status: "operational"
        },
        postgres: { port: 5432, status: "healthy" },
        screenShare: { port: 8765, status: "streaming" },
        memoryRelay: { port: 8899, status: "active" }
      },
      quickStart: "Run LAUNCH-GOD-MAX-PRO.bat to start all services",
      documentation: [
        "ELECTRON-PRO-MASTERY.md",
        "N8N-PRO-MEMORY-NODE.md",
        "GOD-MAX-PRO-HANDOFF.md"
      ],
      memory: memory
    };
    
    res.json(briefing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load memory' });
  }
});

app.post('/update-progress', async (req, res) => {
  const { action, details, timestamp } = req.body;
  const logEntry = {
    action,
    details,
    timestamp: timestamp || new Date().toISOString(),
    project: 'God Max Pro'
  };
  
  console.log('Progress:', logEntry);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`God Max Pro Auto-Briefing Server running on port ${PORT}`);
});