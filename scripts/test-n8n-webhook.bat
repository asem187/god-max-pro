@echo off
echo Testing n8n Voice Command Webhook...
echo.
curl -X POST http://localhost:5678/webhook/voice-command -H "Content-Type: application/json" -d "{\"command\":\"test webhook connection\",\"timestamp\":\"%date% %time%\"}"
echo.
echo Test complete!
pause