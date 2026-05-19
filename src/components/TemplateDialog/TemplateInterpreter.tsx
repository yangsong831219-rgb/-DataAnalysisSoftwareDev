import { Table, Input, Select } from 'antd';
import { useState } from 'react';

interface ColumnPreview {
  index: number;
  sample: string[];
  name: string;
  comment: string;
  dataType: string;
}

interface Props {
  filePath: string;
  onSave: (columns: ColumnPreview[]) => void;
}

const DATA_TYPES = ['time', 'wavelength', 'strain', 'temperature', 'displacement', 'pressure', 'frequency', 'power', 'custom'];

export function TemplateInterpreter({ filePath: _filePath, onSave: _onSave }: Props) {
  const [columns] = useState<ColumnPreview[]>([]);

  return (
    <div>
      <Table
        dataSource={columns.map((c, i) => ({ key: i, ...c }))}
        columns={[
          { title: '列索引', dataIndex: 'index' },
          { title: '列名', render: (_, record: ColumnPreview) => <Input value={record.name} /> },
          { title: '数据类型', render: () => <Select options={DATA_TYPES.map(t => ({ value: t, label: t }))} /> },
          { title: '说明', render: (_, record: ColumnPreview) => <Input value={record.comment} /> },
        ]}
      />
    </div>
  );
}