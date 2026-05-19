import { Table, Button, Space } from 'antd';
import { useDataStore } from '../../stores/dataStore';
import { TemplateDialog } from '../TemplateDialog/TemplateDialog';
import { useState } from 'react';

export function DataViewer() {
  const { data, columns } = useDataStore();
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const handleOpenFile = () => {
    setShowTemplateDialog(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleOpenFile}>
          📂 打开文件
        </Button>
      </Space>

      {data.length > 0 ? (
        <Table
          dataSource={data.map((row, i) => ({ key: i, ...row }))}
          columns={columns.map((c) => ({
            title: c.name,
            dataIndex: c.name,
            render: (v, record: any) => {
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
        onSelect={(templateId) => {
          console.log('Selected template:', templateId);
          setShowTemplateDialog(false);
        }}
      />
    </div>
  );
}