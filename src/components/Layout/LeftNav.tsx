import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const menuItems = [
  { key: 'file', label: '📂 文件' },
  { key: 'clean', label: '🧹 清洗' },
  { key: 'formula', label: 'fx 公式' },
  { key: 'analysis', label: '📈 分析' },
  { key: 'report', label: '📝 报告' },
];

interface Props {
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function LeftNav({ selectedKey, onSelect }: Props) {
  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '16px' }}>
        📊 DataProcessor Pro
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => onSelect(key)}
        items={menuItems}
      />
    </Sider>
  );
}