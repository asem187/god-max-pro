const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendToN8n: (command) => ipcRenderer.invoke('send-to-n8n', command),
  onActivateVoice: (callback) => ipcRenderer.on('activate-voice', callback),
  onOpenCommandPalette: (callback) => ipcRenderer.on('open-command-palette', callback)
});