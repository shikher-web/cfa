
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RatioDataPoint } from '../types';

interface ChartComponentProps {
  data: RatioDataPoint[];
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const sortedData = [...data].sort((a,b) => parseInt(a.year) - parseInt(b.year));
  
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
        <LineChart
            data={sortedData}
            margin={{
            top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', /* slate-900 with opacity */
                    borderColor: '#334155' /* slate-700 */
                }}
                labelStyle={{ color: '#cbd5e1' }} /* slate-300 */
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Line type="monotone" dataKey="value" stroke="#22d3ee" activeDot={{ r: 8 }} strokeWidth={2}/>
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
};
