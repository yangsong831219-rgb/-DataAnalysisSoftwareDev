import { Layout } from 'antd';

const { Sider } = Layout;

export function RightPanel() {
  return (
    <Sider width={280} style={{ background: '#f5f5f5', padding: '16px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>⚙️ 配置面板</div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        选择功能模块后，这里将显示相应的配置选项
      </div>
    </Sider>
  );
}