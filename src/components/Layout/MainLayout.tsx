import { Layout } from 'antd';
import { useState } from 'react';
import { LeftNav } from './LeftNav';
import { RightPanel } from './RightPanel';
import { DataViewer } from '../DataViewer/DataViewer';
import { CleaningPanel } from '../CleaningPanel/CleaningPanel';
import { FormulaEditor } from '../FormulaEditor/FormulaEditor';
import { ChartViewer } from '../ChartViewer/ChartViewer';
import { ReportBuilder } from '../ReportBuilder/ReportBuilder';

const { Content } = Layout;

export function MainLayout() {
  const [selectedKey, setSelectedKey] = useState('file');

  const renderContent = () => {
    switch (selectedKey) {
      case 'file':
        return (
          <div style={{ padding: '20px' }}>
            <h2>📂 数据文件</h2>
            <p>点击"打开文件"按钮加载数据文件</p>
            <DataViewer />
          </div>
        );
      case 'clean':
        return (
          <div style={{ padding: '20px' }}>
            <h2>🧹 数据清洗</h2>
            <CleaningPanel />
          </div>
        );
      case 'formula':
        return (
          <div style={{ padding: '20px' }}>
            <h2>fx 公式编辑器</h2>
            <FormulaEditor />
          </div>
        );
      case 'analysis':
        return (
          <div style={{ padding: '20px' }}>
            <h2>📈 数据分析</h2>
            <ChartViewer data={[1, 2, 3, 4, 5]} type="time" />
          </div>
        );
      case 'report':
        return (
          <div style={{ padding: '20px' }}>
            <h2>📝 报告生成</h2>
            <ReportBuilder />
          </div>
        );
      default:
        return <div style={{ padding: '20px' }}>主工作区</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LeftNav selectedKey={selectedKey} onSelect={setSelectedKey} />
      <Layout>
        <Content style={{ padding: '0' }}>{renderContent()}</Content>
      </Layout>
      <RightPanel />
    </Layout>
  );
}