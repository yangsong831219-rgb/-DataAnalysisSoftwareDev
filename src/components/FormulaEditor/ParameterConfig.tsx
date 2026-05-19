import { InputNumber, Button } from 'antd';

interface Parameter {
  name: string;
  value: number;
  description: string;
  suggestedRange?: [number, number];
}

interface Props {
  parameters: Parameter[];
  onAdd: () => void;
  onUpdate: (index: number, param: Parameter) => void;
  onRemove: (index: number) => void;
}

export function ParameterConfig({ parameters, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div style={{ width: 240, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>参数配置</div>
      {parameters.map((param, i) => (
        <div key={i} style={{ background: '#e8f5e9', border: '1px solid #4caf50', padding: 8, borderRadius: 4, marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>{param.name}</span>
            <span style={{ cursor: 'pointer', color: '#d32f2f' }} onClick={() => onRemove(i)}>✕</span>
          </div>
          <InputNumber value={param.value} onChange={(v) => onUpdate(i, { ...param, value: v ?? param.value })} style={{ width: '100%', marginTop: 4 }} />
          {param.suggestedRange && (
            <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>
              建议范围: {param.suggestedRange[0]} ~ {param.suggestedRange[1]}
            </div>
          )}
        </div>
      ))}
      <Button onClick={onAdd} style={{ width: '100%' }}>+ 添加参数</Button>
    </div>
  );
}