import { useState } from 'react';

interface Node {
  id: string;
  type: 'column' | 'param' | 'operator' | 'function';
  label: string;
  x: number;
  y: number;
}

interface Props {
  nodes: Node[];
  onNodesChange: (nodes: Node[]) => void;
}

export function FormulaCanvas({ nodes, onNodesChange: _setNodes }: Props) {
  const [dragging] = useState<string | null>(null);

  return (
    <div
      style={{
        flex: 1,
        background: '#fafafa',
        border: '2px solid #1976d2',
        borderRadius: 4,
        minHeight: 300,
        position: 'relative',
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.dataTransfer.getData('text/plain');
        // 添加新节点
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {nodes.map((node) => (
        <div
          key={node.id}
          draggable
          onDragStart={() => dragging}
          style={{
            position: 'absolute',
            left: node.x,
            top: node.y,
            background: node.type === 'column' ? '#e3f2fd' : node.type === 'param' ? '#e8f5e9' : '#fff',
            border: '2px solid #1976d2',
            borderRadius: 50,
            padding: '8px 16px',
            cursor: 'move',
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}