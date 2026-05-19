import { ipcMain } from 'electron';
import { CHANNELS } from './channels';
import { spawn } from 'child_process';
import { join } from 'path';

function pythonCall(script: string, args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const py = spawn('python', ['-c', script, ...args]);
    let output = '';
    py.stdout.on('data', (data) => { output += data.toString(); });
    py.stderr.on('data', (data) => { console.error('Python error:', data.toString()); });
    py.on('close', (code) => {
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

export function registerHandlers() {
  ipcMain.handle(CHANNELS.LOAD_FILE, async (_, filePath: string, templateId: string) => {
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
      console.error('Load file error:', error);
      throw error;
    }
  });

  ipcMain.handle(CHANNELS.GET_TEMPLATES, async () => {
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
      console.error('Get templates error:', error);
      return [];
    }
  });

  ipcMain.handle(CHANNELS.SAVE_TEMPLATE, async (_, template: any) => {
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
      console.error('Save template error:', error);
      throw error;
    }
  });

  ipcMain.handle(CHANNELS.CLEAN_DATA, async (_, data: any, rules: any[]) => {
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
      console.error('Clean data error:', error);
      throw error;
    }
  });

  ipcMain.handle(CHANNELS.CALC_FORMULA, async (_, formula: string, columns: any, params: any) => {
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
      console.error('Calculate formula error:', error);
      throw error;
    }
  });

  ipcMain.handle(CHANNELS.ANALYZE, async (_, data: any, analysisType: string) => {
    try {
      if (analysisType === 'time_domain') {
        const result = await pythonCall(`
import sys
sys.path.insert(0, '.')
from py.analyzer import time_domain_analysis
import json
print(json.dumps(time_domain_analysis(${JSON.stringify(data)})))
        `, []);
        return result;
      } else if (analysisType === 'frequency_domain') {
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
      console.error('Analyze error:', error);
      throw error;
    }
  });

  ipcMain.handle(CHANNELS.GENERATE_REPORT, async (_, data: any, config: any) => {
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
      console.error('Generate report error:', error);
      throw error;
    }
  });
}