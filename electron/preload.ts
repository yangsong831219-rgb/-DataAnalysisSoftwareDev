import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from './ipc/channels';

contextBridge.exposeInMainWorld('electronAPI', {
  loadFile: (filePath: string, templateId: string) =>
    ipcRenderer.invoke(CHANNELS.LOAD_FILE, filePath, templateId),
  cleanData: (dataId: string, rules: any[]) =>
    ipcRenderer.invoke(CHANNELS.CLEAN_DATA, dataId, rules),
  calculateFormula: (formula: string, params: Record<string, number>) =>
    ipcRenderer.invoke(CHANNELS.CALC_FORMULA, formula, params),
  analyzeData: (dataId: string, template: string) =>
    ipcRenderer.invoke(CHANNELS.ANALYZE, dataId, template),
  generateReport: (dataId: string, config: any) =>
    ipcRenderer.invoke(CHANNELS.GENERATE_REPORT, dataId, config),
  getTemplates: () => ipcRenderer.invoke(CHANNELS.GET_TEMPLATES),
  saveTemplate: (template: any) => ipcRenderer.invoke(CHANNELS.SAVE_TEMPLATE, template),
});