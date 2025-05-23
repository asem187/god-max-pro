# Electron Pro Mastery Guide

## Architecture

### Process Model
- **Main Process**: Node.js environment, manages windows
- **Renderer Process**: Chromium environment, UI rendering
- **Preload Script**: Bridge between main and renderer

## Security Best Practices

```javascript
// Always use in BrowserWindow
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true
}
```

## IPC Communication

### Secure Pattern
```javascript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  sendToN8n: (command) => ipcRenderer.invoke('send-to-n8n', command)
});

// main.js
ipcMain.handle('send-to-n8n', async (event, command) => {
  // Validate and process
});
```

## Performance Optimization

### V8 Snapshots
Saves ~1000ms startup time:
```json
{
  "v8-snapshot": {
    "customSnapshotEntry": "./snapshot.js"
  }
}
```

### Lazy Loading
```javascript
let heavyModule;
if (needsHeavyModule) {
  heavyModule = require('heavy-module');
}
```

## Multi-Window Management

```javascript
class WindowManager {
  constructor() {
    this.windows = new Map();
  }
  
  createWindow(id, options) {
    const window = new BrowserWindow(options);
    this.windows.set(id, window);
    
    window.on('closed', () => {
      this.windows.delete(id);
    });
    
    return window;
  }
}
```

## Auto-Updater

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
```

## Memory Management

```javascript
// Clean up webContents
window.webContents.on('destroyed', () => {
  // Cleanup resources
});

// Force garbage collection
if (global.gc) {
  global.gc();
}
```

## Debugging

```bash
# Enable DevTools
electron . --inspect=5858

# Memory profiling
electron . --js-flags="--expose-gc"
```