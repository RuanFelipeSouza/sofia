import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const colors = ['#8884d8', '#82ca9d'];

export default function StackedBarChart({ data }) {
  return (
    <BarChart
      width={700}
      height={350}
      data={data}
      margin={{ top: 15, right: 20, left: 20, bottom: 5, }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='data' />
      <YAxis />
      <Tooltip />
      <Legend />
      {
        data.length > 0 && Object.keys(data[0]).map((key, index) => {
          return key !== 'data' ? <Bar key={key} dataKey={key} stackId='a' fill={colors[index - 1]} /> : null;
        })
      }
    </BarChart>
  );
}


