// src/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveFile: (data: { filePath: string; content: any }) =>
    ipcRenderer.invoke('save-file', data),
  loadFile: (filePath: string) => ipcRenderer.invoke('load-file', filePath),
  selectFile: (options?: any) => ipcRenderer.invoke('select-file', options),
  saveFileDialog: (options?: any) => ipcRenderer.invoke('save-file-dialog', options),

  // Menu events
  onNewPost: (callback: () => void) =>
    ipcRenderer.on('new-post', callback),
  onSavePost: (callback: () => void) =>
    ipcRenderer.on('save-post', callback),
  onPublishPost: (callback: () => void) =>
    ipcRenderer.on('publish-post', callback),

  // Remove listeners
  removeAllListeners: (channel: string) =>
    ipcRenderer.removeAllListeners(channel),
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      saveFile: (data: { filePath: string; content: any }) => Promise<{ success: boolean; error?: string }>;
      loadFile: (filePath: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      selectFile: (options?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
      saveFileDialog: (options?: any) => Promise<{ canceled: boolean; filePath?: string }>;
      onNewPost: (callback: () => void) => void;
      onSavePost: (callback: () => void) => void;
      onPublishPost: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
