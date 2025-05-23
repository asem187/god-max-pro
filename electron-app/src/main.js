// God Max Pro - Electron Main Process
// Security-first architecture with voice control integration

const { app, BrowserWindow, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Security configurations
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('disable-http2');

let mainWindow;
let n8nProcess;

// Window management pattern
class WindowManager {
  constructor() {
    this.windows = new Map();
  }

  createMainWindow() {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: true
      },
      icon: path.join(__dirname, 'assets/icon.png'),
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#1e1e1e'
    });

    mainWindow.loadFile('index.html');
    this.windows.set('main', mainWindow);

    mainWindow.on('closed', () => {
      this.windows.delete('main');
      mainWindow = null;
    });
  }

  getWindow(name) {
    return this.windows.get(name);
  }
}

const windowManager = new WindowManager();

// Secure IPC handlers
ipcMain.handle('voice-command', async (event, command) => {
  console.log('Voice command received:', command);
  
  try {
    const response = await processVoiceCommand(command);
    return { success: true, data: response };
  } catch (error) {
    console.error('Voice command error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('test-webhook', async (event, webhookData) => {
  const { url, payload } = webhookData;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return { 
      success: true, 
      status: response.status,
      data: await response.json()
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Voice command processing
async function processVoiceCommand(command) {
  const webhookUrl = 'http://localhost:5678/webhook/voice-command';
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      command,
      timestamp: new Date().toISOString(),
      source: 'electron-app'
    })
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }

  return await response.json();
}

// Application lifecycle
app.whenReady().then(() => {
  windowManager.createMainWindow();
  
  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    mainWindow.webContents.send('toggle-voice');
  });
  
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    mainWindow.webContents.send('show-command-palette');
  });

  // Start n8n if not already running
  checkAndStartN8n();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (n8nProcess) {
    n8nProcess.kill();
  }
});

// n8n integration
function checkAndStartN8n() {
  // Check if n8n is already running
  fetch('http://localhost:5678/healthz')
    .then(response => {
      if (response.ok) {
        console.log('n8n is already running');
      }
    })
    .catch(() => {
      console.log('Starting n8n...');
      startN8n();
    });
}

function startN8n() {
  n8nProcess = spawn('docker', ['start', 'mcp-n8n'], {
    shell: true
  });

  n8nProcess.on('error', (error) => {
    console.error('Failed to start n8n:', error);
  });
}

// Memory integration
ipcMain.handle('save-to-memory', async (event, data) => {
  const memoryUrl = 'http://localhost:8899/update-progress';
  
  try {
    const response = await fetch(memoryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return { success: response.ok };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Production-ready error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log to file and notify user
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to file and notify user
});
