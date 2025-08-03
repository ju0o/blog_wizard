// src/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  tistoryPost: (postData: any) => ipcRenderer.invoke('tistory-post', postData),
});
