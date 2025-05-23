const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#1a1a1a'
  });

  mainWindow.loadFile('index.html');

  // Register global shortcuts
  globalShortcut.register('Ctrl+Shift+V', () => {
    mainWindow.webContents.send('activate-voice');
  });

  globalShortcut.register('Ctrl+Shift+C', () => {
    mainWindow.webContents.send('open-command-palette');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC handlers
ipcMain.handle('send-to-n8n', async (event, command) => {
  const axios = require('axios');
  try {
    const response = await axios.post('http://localhost:5678/webhook/voice-command', {
      command: command,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
});