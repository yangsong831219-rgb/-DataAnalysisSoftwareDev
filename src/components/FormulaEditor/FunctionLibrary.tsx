const OPERATORS = ['+', '-', '×', '÷', '^'];

export function FunctionLibrary({ onDragStart }: { onDragStart: (type: string, value: string) => void }) {
  return (
    <div style={{ width: 160, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>运算节点</div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>算术</div>
        {OPERATORS.map((op) => (
          <div
            key={op}
            draggable
            onDragStart={() => onDragStart('operator', op)}
            style={{
              display: 'inline-block',
              background: '#fff',
              border: '1px solid #1976d2',
              padding: '4px 8px',
              borderRadius: 3,
              fontSize: 12,
              margin: 2,
              cursor: 'move',
            }}
          >
            {op}
          </div>
        ))}
      </div>
      {/* 类似结构用于数学函数和统计函数 */}
    </div>
  );
}