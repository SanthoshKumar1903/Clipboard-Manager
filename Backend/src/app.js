"use strict";
const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

let win;
let clipboardHistory = [];
let lastText = '';

function createWindow() {
  const win = new BrowserWindow({
  width: 800,
  height: 650,
  webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  nodeIntegration: false,
  contextIsolation: true,
  },
  });
  win.loadURL('http://localhost:5173');
  pollClipboard();
}

app.whenReady().then(createWindow);
function pollClipboard() {
  setInterval(() => {
  const currentText = clipboard.readText();
  if (currentText && currentText !== lastText) {
    
    clipboardHistory.unshift(currentText);
    lastText = currentText;
  
    if (clipboardHistory.length > 20) {
      clipboardHistory.pop();
    }
  }
}, 500); 
}

ipcMain.handle('get-clipboard-content', () => {
  return clipboard.readText();
});

ipcMain.handle('get-clipboard-history', () => {
  return clipboardHistory;
});
ipcMain.handle('clear-clipboard-history', () => {
  clipboardHistory = [];
  return true;
});