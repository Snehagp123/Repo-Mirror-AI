import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResult } from '../types';

interface ChartsProps {
  ratings: AnalysisResult['ratings'];
}

export const DimensionsChart: React.FC<ChartsProps> = ({ ratings }) => {
  const data = [
    { subject: 'Code Quality', A: ratings.codeQuality, fullMark: 100 },
    { subject: 'Documentation', A: ratings.documentation, fullMark: 100 },
    { subject: 'Maintainability', A: ratings.maintainability, fullMark: 100 },
    { subject: 'Testing', A: ratings.testing, fullMark: 100 },
    { subject: 'Structure', A: ratings.structure, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-300 text-xs font-semibold mb-1">{payload[0].payload.subject}</p>
          <p className="text-blue-400 text-sm font-bold">
            {payload[0].value} <span className="text-slate-500 text-xs font-normal">/ 100</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Radar
            name="Rating"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};