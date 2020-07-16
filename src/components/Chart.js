import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { array } from 'prop-types';
import * as moment from 'moment';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

export default function Chart({ atendimentos }) {
  atendimentos && atendimentos.forEach(function (element) {
    element.createdAt = moment(element.createdAt, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('DD/MM/YYYY');
  });
  atendimentos = groupBy(atendimentos, e => e.createdAt);

  let atendimentosPorDia = [];
  atendimentos.forEach(function (element, key) {
    atendimentosPorDia.push({ Data: key, Atendimentos: element.length });
  });
  return (
    <BarChart
      width={700}
      height={350}
      data={atendimentosPorDia}
      margin={{
        top: 15, right: 20, left: 20, bottom: 5,
      }}

    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Data" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Atendimentos" fill="#8884d8" />
      {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
    </BarChart>
  );
}

Chart.propTypes = {
  atendimentos: array
};