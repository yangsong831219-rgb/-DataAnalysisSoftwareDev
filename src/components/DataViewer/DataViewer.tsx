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
    console.log('=== handleFileSelect ===');
    console.log('templateId:', templateId);
    setSelectedTemplateId(templateId);
    console.log('selectedTemplateId after set:', templateId);
    console.log('Closing dialog...');
    setShowTemplateDialog(false);
    console.log('Dialog should be closed now');
    console.log('Clicking file input in 200ms...');
    setTimeout(() => {
      console.log('=== setTimeout callback ===');
      console.log('fileInputRef.current:', fileInputRef.current);
      if (fileInputRef.current) {
        console.log('Clicking file input');
        fileInputRef.current.click();
      } else {
        console.log('ERROR: fileInputRef.current is null');
      }
    }, 200);
  };

  const loadTestData = (type: 'donghua' | 'guangming') => {
    let data: ParsedRow[] = [];
    let storeColumns: { name: string; type: string; unit: string; comment: string }[] = [];

    if (type === 'donghua') {
      data = [
        { '时间': 0, '应变1': 0.0, '应变2': 0.0, '位移': 0.000, '压力': 101325 },
        { '时间': 0.1, '应变1': 5.2, '应变2': 3.8, '位移': 0.052, '压力': 101328 },
        { '时间': 0.2, '应变1': 10.5, '应变2': 7.9, '位移': 0.105, '压力': 101330 },
        { '时间': 0.3, '应变1': 15.9, '应变2': 12.1, '位移': 0.159, '压力': 101333 },
        { '时间': 0.4, '应变1': 21.4, '应变2': 16.4, '位移': 0.214, '压力': 101335 },
      ];
      storeColumns = [
        { name: '时间', type: 'time', unit: 's', comment: '时间' },
        { name: '应变1', type: 'strain', unit: 'με', comment: '应变1(με)' },
        { name: '应变2', type: 'strain', unit: 'με', comment: '应变2(με)' },
        { name: '位移', type: 'displacement', unit: 'mm', comment: '位移(mm)' },
        { name: '压力', type: 'numeric', unit: 'Pa', comment: '压力(Pa)' },
      ];
    } else {
      data = [
        { '时间': 0.0, '通道1波长': 1550.123, '通道2波长': 1550.456, '温度1': 25.1, '温度2': 25.3 },
        { '时间': 0.5, '通道1波长': 1550.128, '通道2波长': 1550.461, '温度1': 25.2, '温度2': 25.4 },
        { '时间': 1.0, '通道1波长': 1550.134, '通道2波长': 1550.467, '温度1': 25.3, '温度2': 25.5 },
        { '时间': 1.5, '通道1波长': 1550.139, '通道2波长': 1550.472, '温度1': 25.4, '温度2': 25.6 },
        { '时间': 2.0, '通道1波长': 1550.145, '通道2波长': 1550.478, '温度1': 25.5, '温度2': 25.7 },
      ];
      storeColumns = [
        { name: '时间', type: 'time', unit: 's', comment: '时间(s)' },
        { name: '通道1波长', type: 'wavelength', unit: 'nm', comment: '通道1波长(nm)' },
        { name: '通道2波长', type: 'wavelength', unit: 'nm', comment: '通道2波长(nm)' },
        { name: '温度1', type: 'temperature', unit: '°C', comment: '温度1(°C)' },
        { name: '温度2', type: 'temperature', unit: '°C', comment: '温度2(°C)' },
      ];
    }

    setData(data, storeColumns);
    message.success(`成功加载 ${data.length} 条测试数据 (${type === 'donghua' ? '东华型' : '光明型'})`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If no template selected, try to detect based on file extension
    let templateId = selectedTemplateId;
    if (!templateId) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        templateId = 'guangming_type';
      } else if (fileName.endsWith('.txt')) {
        templateId = 'donghua_type';
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        templateId = 'donghua_type';
      }
    }

    if (!templateId) {
      message.error('请先选择模板');
      return;
    }

    const templates = getTemplates();
    const template = templates.find(t => t.id === templateId);
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
        <Button onClick={() => fileInputRef.current?.click()}>
          选择文件
        </Button>
        <Button onClick={() => loadTestData('donghua')}>
          加载测试数据(东华型)
        </Button>
        <Button onClick={() => loadTestData('guangming')}>
          加载测试数据(光明型)
        </Button>
      </Space>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'block', marginBottom: 16 }}
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