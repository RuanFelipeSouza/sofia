import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const defaultColors = ['#8884d8', '#82ca9d'];

export default function GenericBarChart({ data, isStacked, interval, colors, width }) {
  return (
    <BarChart
      width={width || 700}
      height={350}
      data={data}
      margin={{ top: 15, right: 20, left: 20, bottom: 5, }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='data' interval={interval} angle={-45} textAnchor='end' height={100} />
      <YAxis />
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="top" align="center" />
      {
        data.length > 0 && Object.keys(data[0]).map((key, index) => {
          return key !== 'data' ? <Bar key={key} dataKey={key} stackId={isStacked ? 'a' : index} fill={colors ? colors[index - 1] : defaultColors[index - 1]} /> : null;
        })
      }
    </BarChart>
  );
}


