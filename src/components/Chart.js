import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: '16/04', Cancelamentos: 4000, Remarcacoes: 2400, Agendamentos: 2400,
  },
  {
    name: '17/04', Cancelamentos: 3000, Remarcacoes: 1398, Agendamentos: 2210,
  },
  {
    name: '18/04', Cancelamentos: 2000, Remarcacoes: 9800, Agendamentos: 2290,
  },
  {
    name: '19/04', Cancelamentos: 2780, Remarcacoes: 3908, Agendamentos: 2000,
  },
  {
    name: '20/04', Cancelamentos: 1890, Remarcacoes: 4800, Agendamentos: 2181,
  },
  {
    name: '21/04', Cancelamentos: 2390, Remarcacoes: 3800, Agendamentos: 2500,
  },
  {
    name: '22/04', Cancelamentos: 3490, Remarcacoes: 4300, Agendamentos: 2100,
  },
];

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/9hjfkp73/';

  render() {
    return (
      <BarChart
        width={700}
        height={300}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Remarcacoes" stackId="a" fill="#8884d8" />
        <Bar dataKey="Agendamentos" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Cancelamentos" fill="#ffc658" />
      </BarChart>
    );
  }
}
