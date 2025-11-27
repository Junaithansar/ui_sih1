import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface LiveChartProps {
  data: { time: string; heartRate: number; gas: number }[];
  type: 'heartRate' | 'gas';
  color: string;
}

export const LiveChart: React.FC<LiveChartProps> = ({ data, type, color }) => {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', fontSize: '12px', color: '#fff' }}
            itemStyle={{ color: color }}
            labelStyle={{ display: 'none' }}
          />
          <Line 
            type="monotone" 
            dataKey={type} 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
