# God Max Pro Handoff Guide

## System Overview

God Max Pro is an omnipresent AI automation system combining:
- Voice-controlled Electron desktop app
- n8n workflow automation
- Real-time screen sharing
- Persistent memory across sessions

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/asem187/god-max-pro.git
cd god-max-pro

# 2. Start services
./scripts/LAUNCH-GOD-MAX-PRO.bat

# 3. Access interfaces
# n8n: http://localhost:5678
# Open WebUI: http://localhost:3000
```

## Service Endpoints

| Service | Port | Purpose |
|---------|------|----------|
| PostgreSQL | 5432 | Database |
| n8n | 5678 | Workflows |
| Open WebUI | 3000 | Voice UI |
| Screen Share | 8765 | WebSocket |
| Memory Server | 8899 | Auto-briefing |

## Credentials

- **Email**: asem18@gmail.com
- **n8n Password**: Janabi1221!

## Key Features

### Voice Commands
- Activate: `Ctrl+Shift+V`
- Command Palette: `Ctrl+Shift+C`
- Supported commands:
  - "Generate code for..."
  - "Check system status"
  - "Deploy to..."
  - "Research about..."

### Workflow Architecture
```
Voice Input ? Webhook ? Intent Classification ? Route to:
  ??? AI Code Generator (Claude API)
  ??? System Monitor (Docker/Health checks)
  ??? Docker Control (Container management)
  ??? Web Research (Browser automation)
```

### Memory System
- Auto-briefs new sessions
- Pattern matching for solutions
- Visual context from screen sharing
- Progress tracking

## Development Workflow

1. **Local Development**
   ```bash
   cd electron-app
   npm install
   npm run dev
   ```

2. **Test Webhooks**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5678/webhook/voice-command" `
     -Method POST `
     -Body (@{command="test"} | ConvertTo-Json) `
     -ContentType "application/json"
   ```

3. **Monitor Logs**
   ```bash
   docker logs mcp-n8n -f
   docker logs god-max-pro-memory-briefing -f
   ```

## Troubleshooting

### Port Conflicts
```bash
netstat -an | findstr "3000 5678 8765 8899"
# Kill process: taskkill /F /PID <PID>
```

### Container Issues
```bash
docker-compose down
docker-compose up -d
docker logs <container-name>
```

### Memory Reset
```bash
docker volume rm mcp-memory
docker volume create mcp-memory
```

## Extension Points

1. **Add Voice Commands**: Edit Intent Classifier in Master Voice Router
2. **New Workflows**: Import JSON to n8n, connect to router
3. **UI Customization**: Modify electron-app/renderer.js
4. **Memory Patterns**: Extend memory-server/server.js

## Best Practices

1. Always test webhooks before voice commands
2. Monitor memory usage with system monitor
3. Use pattern matching for similar problems
4. Document successful workflows
5. Regular backups of workflow JSONs

## Next Steps

1. Expand voice command vocabulary
2. Add more AI model integrations
3. Implement workflow templates
4. Create mobile companion app
5. Add analytics dashboard

---

**Remember**: God Max Pro philosophy - No compromises, maximum capability, professional grade!