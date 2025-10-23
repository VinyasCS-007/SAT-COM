import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BERChartProps {
  data: { run: number; ber_before: number; ber_after: number }[];
}

export const BERChart: React.FC<BERChartProps> = ({ data }) => {
  if (data.length === 0) return <div className="text-gray-500">No data yet</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2 text-cyan-300">BER vs. Simulation Run</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="run" label={{ value: 'Run #', position: 'insideBottomRight' }} />
            <YAxis
              type="number"
              domain={[0, 0.2]}
              label={{ value: 'BER', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(6)}`, 'BER']} />
            <Line
              type="monotone"
              dataKey="ber_before"
              name="Before AI"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="ber_after"
              name="After AI"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};