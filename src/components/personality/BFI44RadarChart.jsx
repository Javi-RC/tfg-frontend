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

export default function BFI44RadarChart({ radarData }) {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={500}>
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
          name={t('bfi44.results.yourScore')}
          dataKey="value"
          /* Literal: recharts writes stroke/fill as SVG attributes, where
             CSS custom properties (var()) do not resolve. Keep in sync with
             --color-primary in tokens.css. */
          stroke="#7c5cff"
          strokeWidth={3}
          fill="#7c5cff"
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
          formatter={(value, name, props) => {
            const maxScore = props.payload.maxScore;
            return [`${value} / ${maxScore}`, t('bfi44.results.score')];
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
