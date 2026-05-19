import { Table, Button, Space, message } from 'antd';
import { useDataStore } from '../../stores/dataStore';
import { TemplateDialog } from '../TemplateDialog/TemplateDialog';
import { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface TemplateColumn {
  name: string;
  comment: string;
  data_type?: string;
}

interface Template {
  id: string;
  name: string;
  file_format: string;
  delimiter: string;
  skip_rows: number;
  columns: TemplateColumn[];
}

interface ParsedRow {
  [key: string]: any;
}

export function DataViewer() {
  const { data, columns, setData } = useDataStore();
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFile = () => {
    setShowTemplateDialog(true);
  };

  const handleFileSelect = (templateId: string) => {
    console.log('handleFileSelect called with:', templateId);
    setSelectedTemplateId(templateId);
    console.log('Triggering file input click in 100ms');
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.log('fileInputRef.current is null');
      }
    }, 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTemplateId) return;

    const templates = getTemplates();
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) {
      message.error('未找到对应模板');
      return;
    }

    try {
      const text = await file.text();
      let parsedData: ParsedRow[] = [];

      if (template.file_format === 'csv') {
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header, index) => {
            const col = template.columns[index];
            return col?.name || header;
          }
        });
        parsedData = result.data as ParsedRow[];
      } else if (template.file_format === 'txt') {
        const delimiter = template.delimiter === '\\t' ? '\t' : template.delimiter;
        const result = Papa.parse(text, {
          delimiter,
          header: false,
          skipEmptyLines: true,
        });
        // Apply column names from template
        parsedData = result.data.map((row: unknown) => {
          const r = row as Record<string, any>;
          const obj: ParsedRow = {};
          template.columns.forEach((c: TemplateColumn, i: number) => {
            obj[c.name] = r[Object.keys(r)[i]] ?? null;
          });
          return obj;
        });
      } else if (template.file_format === 'xlsx' || template.file_format === 'xls') {
        const workbook = XLSX.read(text, { type: 'string' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
        parsedData = jsonData.slice(template.skip_rows || 0).map((row: unknown) => {
          const r = row as Record<string, any>;
          const obj: ParsedRow = {};
          template.columns.forEach((c: TemplateColumn, i: number) => {
            obj[c.name] = r[Object.keys(r)[i]] ?? null;
          });
          return obj;
        });
      }

      if (parsedData.length > 0) {
        // Convert template columns to store columns
        const storeColumns = template.columns.map((c: TemplateColumn) => ({
          name: c.name,
          type: c.data_type || 'numeric',
          unit: '',
          comment: c.comment,
        }));
        setData(parsedData, storeColumns);
        message.success(`成功加载 ${parsedData.length} 条数据`);
      } else {
        message.warning('文件为空或解析失败');
      }
    } catch (err) {
      console.error('Parse error:', err);
      message.error('文件解析失败');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleOpenFile}>
          📂 打开文件
        </Button>
      </Space>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".txt,.csv,.xlsx,.xls"
        onChange={handleFileChange}
      />

      {data.length > 0 ? (
        <Table
          dataSource={data.map((row, i) => ({ key: i, ...row }))}
          columns={columns.map((c) => ({
            title: c.name,
            dataIndex: c.name,
            render: (v: any, record: any) => {
              if (record.isAnomaly) return <span style={{ color: 'red' }}>{v}</span>;
              if (record.isMissing) return <span style={{ color: 'orange' }}>{v}</span>;
              return v;
            },
          }))}
          scroll={{ y: 400 }}
          virtual
          pagination={false}
        />
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ color: '#666' }}>暂无数据</p>
          <p style={{ color: '#999', fontSize: '12px' }}>点击"打开文件"加载数据</p>
        </div>
      )}

      <TemplateDialog
        open={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelect={handleFileSelect}
      />
    </div>
  );
}

function getTemplates(): Template[] {
  const LOCAL_STORAGE_KEY = 'dataprocessor_templates';
  const defaultTemplates = [
    {
      id: 'donghua_type',
      name: '东华型',
      file_format: 'txt',
      delimiter: '\t',
      skip_rows: 1,
      columns: [
        { name: '时间', comment: '时间' },
        { name: '应变1', comment: '应变1(με)' },
        { name: '应变2', comment: '应变2(με)' },
        { name: '位移', comment: '位移(mm)' },
        { name: '压力', comment: '压力(Pa)' },
      ]
    },
    {
      id: 'guangming_type',
      name: '光明型光纤光栅',
      file_format: 'csv',
      delimiter: ',',
      skip_rows: 1,
      columns: [
        { name: '时间', comment: '时间(s)' },
        { name: '通道1波长', comment: '通道1波长(nm)' },
        { name: '通道2波长', comment: '通道2波长(nm)' },
        { name: '温度1', comment: '温度1(°C)' },
        { name: '温度2', comment: '温度2(°C)' },
      ]
    }
  ];

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultTemplates;
    }
  }
  return defaultTemplates;
}