import { Card, Button, Checkbox, Input } from 'antd';
import { useState } from 'react';

interface ReportConfig {
  title: string;
  includeSummary: boolean;
  includeCharts: boolean;
  includeTables: boolean;
  chartIds: string[];
}

export function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    title: '数据分析报告',
    includeSummary: true,
    includeCharts: true,
    includeTables: true,
    chartIds: [],
  });

  const handleGenerateReport = () => {
    console.log('Generating report with config:', config);
  };

  return (
    <div>
      <Card title="报告配置">
        <Input
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Checkbox checked={config.includeSummary} onChange={(e) => setConfig({ ...config, includeSummary: e.target.checked })}>
          包含数据概要
        </Checkbox>
        <Checkbox checked={config.includeCharts} onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}>
          包含分析图表
        </Checkbox>
        <Checkbox checked={config.includeTables} onChange={(e) => setConfig({ ...config, includeTables: e.target.checked })}>
          包含数据表格
        </Checkbox>
      </Card>
      <Button type="primary" onClick={handleGenerateReport} style={{ marginTop: 16 }}>
        生成报告
      </Button>
    </div>
  );
}