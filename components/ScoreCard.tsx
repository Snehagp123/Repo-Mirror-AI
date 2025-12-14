import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface ScoreCardProps {
  score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 90) return '#4ade80'; // Green-400
    if (s >= 70) return '#60a5fa'; // Blue-400
    if (s >= 50) return '#fbbf24'; // Amber-400
    return '#f87171'; // Red-400
  };

  const color = getColor(score);
  const data = [{ name: 'Score', value: score, fill: color }];

  let label = "Needs Work";
  if (score >= 90) label = "Exceptional";
  else if (score >= 75) label = "Professional";
  else if (score >= 50) label = "Developing";

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={20} 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
            <span className="text-6xl font-bold text-white block">{score}</span>
            <span className="text-lg font-medium" style={{ color }}>{label}</span>
        </div>
    </div>
  );
};