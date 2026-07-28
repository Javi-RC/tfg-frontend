import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function TeamRadarChart({ radarData }) {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#cbd5e0" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="factor"
          tick={{ fontSize: 12, fill: '#1a1a1a', fontWeight: '600' }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 50]}
          tick={{ fontSize: 11, fill: '#666' }}
          axisLine={false}
        />
        <Radar
          name={t('team.personalityFit.score')}
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={3}
          fill="#3b82f6"
          fillOpacity={0.3}
        />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          }}
          formatter={(value, _name, props) => {
            const maxScore = props.payload.maxScore;
            return [`${value} / ${maxScore}`, t('team.personalityFit.score')];
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
