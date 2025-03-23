const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getClipboardContent: async () => {
  return await ipcRenderer.invoke('get-clipboard-content');
  },
  getClipboardHistory: async () => {
  return await ipcRenderer.invoke('get-clipboard-history');
  },
  clearClipboardHistory: async () => {
  return await ipcRenderer.invoke('clear-clipboard-history');
  }
});