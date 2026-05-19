import { Modal, Table, Select, Input } from 'antd';
import { useState } from 'react';

interface DataColumn {
  name: string;
  type: string;
  unit: string;
  comment: string;
}

const UNIT_OPTIONS: Record<string, string[]> = {
  time: ['s', 'ms', 'min', 'h'],
  wavelength: ['nm', 'μm', 'mm'],
  strain: ['με', '10⁻⁶'],
  temperature: ['°C', 'K', '°F'],
  displacement: ['mm', 'μm', 'm'],
};

interface Props {
  open: boolean;
  columns: DataColumn[];
  onClose: () => void;
  onConfirm: (columns: DataColumn[]) => void;
}

export function DataTypeDialog({ open, columns, onClose, onConfirm }: Props) {
  const [localColumns] = useState(columns);

  return (
    <Modal title="配置数据类型" open={open} onCancel={onClose} onOk={() => onConfirm(localColumns)} okText="确认" cancelText="取消">
      <Table
        dataSource={localColumns.map((c, i) => ({ key: i, ...c }))}
        columns={[
          { title: '列名', dataIndex: 'name' },
          { title: '类型', dataIndex: 'type', render: (v: string) => <Select value={v} options={Object.keys(UNIT_OPTIONS).map(t => ({ value: t, label: t }))} /> },
          { title: '单位', dataIndex: 'unit', render: (v: string, record: any) => <Select value={v} options={(UNIT_OPTIONS[record.type] || []).map(u => ({ value: u, label: u }))} /> },
          { title: '说明', dataIndex: 'comment', render: (v: string) => <Input value={v} /> },
        ]}
        pagination={false}
      />
    </Modal>
  );
}