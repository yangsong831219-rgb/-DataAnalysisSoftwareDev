import { Card, Switch, InputNumber, Select, Button } from 'antd';
import { useState } from 'react';

interface CleaningRule {
  name: string;
  rule_type: 'range' | 'negative' | 'zero' | 'format';
  enabled: boolean;
  min_value?: number;
  max_value?: number;
  fill_method: 'linear' | 'mean' | 'forward' | 'custom';
}

export function CleaningPanel() {
  const [rules, setRules] = useState<CleaningRule[]>([
    { name: '数值范围', rule_type: 'range', enabled: true, min_value: 0, max_value: 100, fill_method: 'linear' },
    { name: '负数检测', rule_type: 'negative', enabled: true, fill_method: 'forward' },
  ]);

  const updateRule = (index: number, updates: Partial<CleaningRule>) => {
    setRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...updates } : rule)));
  };

  const applyCleaning = () => {
    // TODO: Call IPC bridge to apply cleaning rules
    console.log('Applying cleaning rules:', rules);
  };

  return (
    <div>
      {rules.map((rule, i) => (
        <Card key={i} size="small" style={{ marginBottom: 8 }}>
          <Switch checked={rule.enabled} onChange={(v) => updateRule(i, { enabled: v })} />
          <span style={{ marginLeft: 8 }}>{rule.name}</span>
          {rule.rule_type === 'range' && (
            <>
              <InputNumber value={rule.min_value ?? undefined} onChange={(v) => updateRule(i, { min_value: v ?? undefined })} />
              <span> ~ </span>
              <InputNumber value={rule.max_value ?? undefined} onChange={(v) => updateRule(i, { max_value: v ?? undefined })} />
            </>
          )}
          <Select value={rule.fill_method} onChange={(v) => updateRule(i, { fill_method: v })}>
            <Select.Option value="linear">线性插值</Select.Option>
            <Select.Option value="mean">均值填充</Select.Option>
            <Select.Option value="forward">前值填充</Select.Option>
            <Select.Option value="custom">自定义</Select.Option>
          </Select>
        </Card>
      ))}
      <Button onClick={applyCleaning}>应用清洗</Button>
    </div>
  );
}