import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface Props {
  data: number[];
  type: 'time' | 'frequency';
  selection?: [number, number];
}

export function ChartViewer({ data, type, selection }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const option = type === 'time' ? {
      xAxis: { type: 'category', data: data.map((_, i) => i) },
      yAxis: { type: 'value' },
      series: [{ data, type: 'line', smooth: true }],
      graphic: selection ? [{
        type: 'rect',
        x: selection[0],
        y: 0,
        width: selection[1] - selection[0],
        height: '100%',
        style: { fill: 'rgba(25, 118, 210, 0.1)', stroke: '#f57c00', lineWidth: 2 }
      }] : []
    } : {
      xAxis: { type: 'category', data: data },
      yAxis: { type: 'value' },
      series: [{ data, type: 'bar' }]
    };

    chart.setOption(option);
    return () => chart.dispose();
  }, [data, type, selection]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
}