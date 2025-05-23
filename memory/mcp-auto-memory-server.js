// MCP Server Auto-Memory Injection for New Bots
// This ensures every new bot automatically receives complete God Max Pro context

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const MEMORY_PATH = '/app/memory/memory.json';
const PORT = 8899;

// Automatic briefing endpoint that new bots should call first
app.get('/auto-brief-new-bot', async (req, res) => {
  try {
    // Load complete memory from Docker volume
    const memoryData = await fs.readFile(MEMORY_PATH, 'utf8');
    const memory = JSON.parse(memoryData);
    
    // Extract critical system information
    const systemStatus = {
      services: {
        n8n: { port: 5678, status: 'operational', credentials: 'asem18@gmail.com' },
        openWebUI: { port: 3000, status: 'operational' },
        postgres: { port: 5432, status: 'healthy' },
        screenShare: { port: 8765, status: 'streaming' },
        memoryRelay: { port: 8899, status: 'active' }
      },
      documentation: {
        electronMastery: 'Advanced Electron patterns with security-first architecture',
        n8nMemory: 'Workflow memory integration and pattern recognition',
        handoff: 'Complete system transfer and operational status'
      },
      quickStart: {
        command: 'LAUNCH-GOD-MAX-PRO.bat',
        location: 'Desktop or project root',
        description: 'Starts all services with health checks'
      },
      currentWork: {
        electronApp: 'Voice-controlled desktop interface completed',
        n8nWorkflows: 'Master Voice Router with pattern matching active',
        screenSharing: 'HD capture with automatic task detection operational',
        memorySystem: 'Persistent context with pattern recognition functional'
      }
    };

    // Build comprehensive briefing
    const briefing = {
      message: 'Welcome! You are continuing work on God Max Pro - an omnipresent AI automation system.',
      philosophy: {
        omnipresence: 'Accessible from anywhere - desktop, phone, remote',
        maximumCapability: 'No feature compromises, everything production-ready',
        professionalGrade: 'Security-first, optimized, fully documented'
      },
      immediateContext: {
        lastActivity: 'Complete system documentation and GitHub repository creation',
        activeProjects: extractActiveProjects(memory),
        recentPatterns: extractRecentPatterns(memory)
      },
      systemStatus,
      instructions: [
        'Review all .md documentation files in the current directory',
        'Check Docker containers status with: docker ps',
        'Access n8n at http://localhost:5678',
        'Voice commands available via Ctrl+Shift+V in Electron app',
        'All code and workflows are preserved in the created files'
      ],
      memory: memory
    };

    res.json(briefing);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to load memory', 
      fallback: 'Check Docker volume mcp-memory for memory.json'
    });
  }
});

// Progress tracking endpoint
app.post('/update-progress', async (req, res) => {
  const { action, details, timestamp } = req.body;
  
  // Append to progress log
  const logEntry = {
    action,
    details,
    timestamp: timestamp || new Date().toISOString()
  };
  
  await appendToLog(logEntry);
  res.json({ success: true });
});

// Helper functions
function extractActiveProjects(memory) {
  const projects = [];
  memory.forEach(item => {
    if (item.entityType === 'Project' && item.type === 'entity') {
      projects.push({
        name: item.name,
        status: item.observations[item.observations.length - 1]
      });
    }
  });
  return projects;
}

function extractRecentPatterns(memory) {
  const patterns = [];
  memory.forEach(item => {
    if (item.observations) {
      item.observations.forEach(obs => {
        if (obs.includes('pattern') || obs.includes('workflow')) {
          patterns.push(obs);
        }
      });
    }
  });
  return patterns.slice(-5); // Last 5 patterns
}

async function appendToLog(entry) {
  const logPath = '/app/memory/progress.log';
  await fs.appendFile(logPath, JSON.stringify(entry) + '\n');
}

app.listen(PORT, () => {
  console.log(`MCP Auto-Memory Server running on port ${PORT}`);
  console.log(`New bots should GET http://localhost:${PORT}/auto-brief-new-bot`);
});