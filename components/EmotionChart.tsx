import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface EmotionChartProps {
  data: { name: string; value: number }[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  // If data is empty or malformed, show nothing
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">Emotional Spectrum</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Intensity"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#c4b5fd' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionChart;
