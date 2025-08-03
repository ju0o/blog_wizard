// src/main/main.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'), // TS 빌드 후 .js 사용
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../renderer/index.html')}`
  );
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// IPC 예시: 티스토리 포스팅 요청
ipcMain.handle('tistory-post', async (event, postData) => {
  // 실제 티스토리 API 연동은 renderer에서 axios 등으로 호출
  // (원하면 main에서 직접 처리하게도 가능)
  return { status: 'ok' };
});
