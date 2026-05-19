import { useState } from 'react';
import { FormulaCanvas } from './FormulaCanvas';
import { FunctionLibrary } from './FunctionLibrary';
import { ParameterConfig } from './ParameterConfig';
import { Button } from 'antd';

interface Parameter {
  name: string;
  value: number;
  description: string;
}

interface Node {
  id: string;
  type: 'column' | 'param' | 'operator' | 'function';
  label: string;
  x: number;
  y: number;
}

export function FormulaEditor() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);

  return (
    <div style={{ display: 'flex', gap: 12, height: 420 }}>
      <FunctionLibrary onDragStart={() => {}} />
      <FormulaCanvas nodes={nodes} onNodesChange={setNodes} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ParameterConfig
          parameters={parameters}
          onAdd={() => setParameters([...parameters, { name: `参数${String.fromCharCode(65+parameters.length)}`, value: 0, description: '' }])}
          onUpdate={(i, p) => setParameters(parameters.map((_, idx) => idx === i ? p : _))}
          onRemove={(i) => setParameters(parameters.filter((_, idx) => idx !== i))}
        />
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <Button>预览</Button>
          <Button type="primary">应用</Button>
        </div>
      </div>
    </div>
  );
}