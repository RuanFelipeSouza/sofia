import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as moment from 'moment';

const groupBy = (list, keyGetter)=> {
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
}

export default function CustomLineChart(props) {
  const [data, setData] = useState([]);
  const { atendimentos } = props;

  useEffect(() => {
    atendimentos && atendimentos.forEach(function (element) {
      element.createdAt = moment(element.createdAt).format("DD/MM/YYYY");
    });
    const groupedData = groupBy(atendimentos, e => e.createdAt);

    let atendimentosPorDia = []
    groupedData.forEach(function (element, key) {
      atendimentosPorDia.push({ Data: key, Atendimentos: element.length })
    });

    setData(atendimentosPorDia);
  }, [atendimentos]);
  
  return (
    <LineChart
      width={700}
      height={350}
      data={data}
      margin={{
        top: 15, right: 20, left: 20, bottom: 5,
      }}
      
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Data" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line dataKey="Atendimentos" type="monotoneX" stroke="#8884d8" />
      {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
    </LineChart>
  );
}
