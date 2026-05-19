import { Modal, List } from 'antd';
import { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  file_format: string;
  columns: { name: string; comment: string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

const LOCAL_STORAGE_KEY = 'dataprocessor_templates';

const defaultTemplates: Template[] = [
  {
    id: 'donghua_type',
    name: '东华型',
    file_format: 'txt',
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
    columns: [
      { name: '时间', comment: '时间(s)' },
      { name: '通道1波长', comment: '通道1波长(nm)' },
      { name: '通道2波长', comment: '通道2波长(nm)' },
      { name: '温度1', comment: '温度1(°C)' },
      { name: '温度2', comment: '温度2(°C)' },
    ]
  }
];

export function TemplateDialog({ open, onClose, onSelect }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<string>('donghua_type');

  useEffect(() => {
    if (open) {
      setSelected('donghua_type');
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setTemplates(JSON.parse(stored));
        } catch {
          setTemplates(defaultTemplates);
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultTemplates));
        setTemplates(defaultTemplates);
      }
    }
  }, [open]);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <Modal title="选择数据文件模板" open={open} onCancel={onClose} onOk={handleConfirm} okText="确认加载" cancelText="取消">
      <List
        dataSource={templates}
        renderItem={(t) => (
          <List.Item
            onClick={() => setSelected(t.id)}
            style={{ cursor: 'pointer', background: selected === t.id ? '#e6f7ff' : undefined }}
          >
            <List.Item.Meta title={t.name} description={t.file_format} />
          </List.Item>
        )}
      />
    </Modal>
  );
}