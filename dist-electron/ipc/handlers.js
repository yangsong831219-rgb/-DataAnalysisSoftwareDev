"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/ipc/handlers.ts
var handlers_exports = {};
__export(handlers_exports, {
  registerHandlers: () => registerHandlers
});
module.exports = __toCommonJS(handlers_exports);
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

// electron/ipc/handlers.ts
var import_child_process = require("child_process");
function pythonCall(script, args) {
  return new Promise((resolve, reject) => {
    const py = (0, import_child_process.spawn)("python", ["-c", script, ...args]);
    let output = "";
    py.stdout.on("data", (data) => {
      output += data.toString();
    });
    py.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });
    py.on("close", (code) => {
      if (code === 0) {
        try {
          resolve(output ? JSON.parse(output) : null);
        } catch {
          resolve(output);
        }
      } else {
        reject(new Error(output || `Python exited with code ${code}`));
      }
    });
  });
}
function registerHandlers() {
  import_electron.ipcMain.handle(CHANNELS.LOAD_FILE, async (_, filePath, templateId) => {
    try {
      const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.processor import handle_load_file
import json
print(json.dumps(handle_load_file('${filePath}', '${templateId}')))
      `, []);
      return result;
    } catch (error) {
      console.error("Load file error:", error);
      throw error;
    }
  });
  import_electron.ipcMain.handle(CHANNELS.GET_TEMPLATES, async () => {
    try {
      const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.template import load_templates
import json
print(json.dumps([{
  'id': t.id,
  'name': t.name,
  'file_format': t.file_format,
  'columns': [{'name': c.name, 'comment': c.comment} for c in t.columns]
} for t in load_templates()]))
      `, []);
      return result || [];
    } catch (error) {
      console.error("Get templates error:", error);
      return [];
    }
  });
  import_electron.ipcMain.handle(CHANNELS.SAVE_TEMPLATE, async (_, template) => {
    try {
      await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.template import save_template, FileTemplate, ColumnDef
template = FileTemplate(
  id='${template.id}',
  name='${template.name}',
  file_format='${template.file_format}',
  columns=[ColumnDef(name=c['name'], comment=c.get('comment', '')) for c in ${JSON.stringify(template.columns || [])}]
)
save_template(template)
print('OK')
      `, []);
      return { success: true };
    } catch (error) {
      console.error("Save template error:", error);
      throw error;
    }
  });
  import_electron.ipcMain.handle(CHANNELS.CLEAN_DATA, async (_, data, rules) => {
    try {
      const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.cleaner import clean_data
import pandas as pd
import json

df = pd.DataFrame(${JSON.stringify(data)})
rules = ${JSON.stringify(rules)}
result = clean_data(df, rules)
print(json.dumps(result.to_dict()))
      `, []);
      return result;
    } catch (error) {
      console.error("Clean data error:", error);
      throw error;
    }
  });
  import_electron.ipcMain.handle(CHANNELS.CALC_FORMULA, async (_, formula, columns, params) => {
    try {
      const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.formula import calculate
import json
print(json.dumps(calculate('${formula}', ${JSON.stringify(columns)}, ${JSON.stringify(params)})))
      `, []);
      return result;
    } catch (error) {
      console.error("Calculate formula error:", error);
      throw error;
    }
  });
  import_electron.ipcMain.handle(CHANNELS.ANALYZE, async (_, data, analysisType) => {
    try {
      if (analysisType === "time_domain") {
        const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.analyzer import time_domain_analysis
import json
print(json.dumps(time_domain_analysis(${JSON.stringify(data)})))
        `, []);
        return result;
      } else if (analysisType === "frequency_domain") {
        const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.analyzer import frequency_domain_analysis
import json
print(json.dumps(frequency_domain_analysis(${JSON.stringify(data)}, 1000.0)))
        `, []);
        return result;
      }
      return null;
    } catch (error) {
      console.error("Analyze error:", error);
      throw error;
    }
  });
  import_electron.ipcMain.handle(CHANNELS.GENERATE_REPORT, async (_, data, config) => {
    try {
      const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.report import generate_report
import json
import base64

config_dict = ${JSON.stringify(config)}
result = generate_report(
  ${JSON.stringify(config.dataSummary || {})},
  [],
  ${JSON.stringify(config.tables || [])},
  config_dict
)
print(base64.b64encode(result).decode())
      `, []);
      return { success: true, data: result };
    } catch (error) {
      console.error("Generate report error:", error);
      throw error;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerHandlers
});
