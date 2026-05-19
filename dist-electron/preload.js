"use strict";

// electron/preload.ts
var import_electron = require("electron");

// electron/ipc/channels.ts
var CHANNELS = {
  LOAD_FILE: "file:load",
  CLEAN_DATA: "data:clean",
  CALC_FORMULA: "formula:calculate",
  ANALYZE: "data:analyze",
  GENERATE_REPORT: "report:generate",
  GET_TEMPLATES: "template:get-all",
  SAVE_TEMPLATE: "template:save"
};

// electron/preload.ts
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  loadFile: (filePath, templateId) => import_electron.ipcRenderer.invoke(CHANNELS.LOAD_FILE, filePath, templateId),
  cleanData: (dataId, rules) => import_electron.ipcRenderer.invoke(CHANNELS.CLEAN_DATA, dataId, rules),
  calculateFormula: (formula, params) => import_electron.ipcRenderer.invoke(CHANNELS.CALC_FORMULA, formula, params),
  analyzeData: (dataId, template) => import_electron.ipcRenderer.invoke(CHANNELS.ANALYZE, dataId, template),
  generateReport: (dataId, config) => import_electron.ipcRenderer.invoke(CHANNELS.GENERATE_REPORT, dataId, config),
  getTemplates: () => import_electron.ipcRenderer.invoke(CHANNELS.GET_TEMPLATES),
  saveTemplate: (template) => import_electron.ipcRenderer.invoke(CHANNELS.SAVE_TEMPLATE, template)
});
