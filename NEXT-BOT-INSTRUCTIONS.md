# CRITICAL INSTRUCTIONS FOR NEXT BOT

## Immediate Context Loading

When starting a new conversation about the God Max Pro project, provide this exact message:

```
I need to continue work on the God Max Pro system. Please access the project memory from GitHub at https://github.com/asem187/god-max-pro and the Docker MCP memory volume. The system includes Electron app with voice control, n8n workflows (port 5678), real-time screen sharing, and persistent memory. Review all documentation in the repository.
```

## System Access

### GitHub Repository
All project code and documentation is stored at: https://github.com/asem187/god-max-pro

### Docker Memory Access
```bash
docker run --rm -v mcp-memory:/data alpine cat /data/memory.json
```

### Service Endpoints
- n8n: http://localhost:5678 (asem18@gmail.com / Janabi1221!)
- Open WebUI: http://localhost:3000 (asem18@gmail.com)
- Memory Server: http://localhost:8899/auto-brief-new-bot

## Quick Start Commands

1. Clone the repository:
   ```bash
   git clone https://github.com/asem187/god-max-pro.git
   cd god-max-pro
   ```

2. Launch all services:
   ```batch
   scripts/LAUNCH-GOD-MAX-PRO.bat
   ```

3. Access memory briefing:
   ```bash
   curl http://localhost:8899/auto-brief-new-bot
   ```

## Key Documentation Files

- `documentation/ELECTRON-PRO-MASTERY.md` - Advanced Electron patterns
- `documentation/N8N-PRO-MEMORY-NODE.md` - Workflow memory integration
- `documentation/GOD-MAX-PRO-HANDOFF.md` - Complete system status
- `README.md` - System overview and architecture

## Development Philosophy

The God Max Pro system operates on three principles:
1. **Omnipresence** - Accessible from anywhere
2. **Maximum Capability** - No feature compromises
3. **Professional Grade** - Production-ready code only

## Current System Status

- All services are operational
- Voice control working via Electron app
- n8n workflows active with pattern matching
- Real-time screen sharing streaming on WebSocket 8765
- Memory system preserving all interactions
- GitHub repository contains complete codebase

## Continuation Steps

1. Review all documentation in the GitHub repository
2. Check Docker container status
3. Access n8n interface to verify workflows
4. Test voice commands in Electron app
5. Continue development based on handoff documentation

The system is fully documented and ready for enhancement. All knowledge has been preserved.