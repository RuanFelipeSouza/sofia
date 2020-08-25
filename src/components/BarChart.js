import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { array } from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
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

export default function Chart(props) {
  let data = props.data;
  const theme = useTheme();
  data && data.forEach(function (element) {
    element.createdAt = moment(element.createdAt, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('DD/MM/YYYY');
  });
  data = groupBy(data, e => e.createdAt);

  let dataPerDay = [];
  data.forEach(function (element, key) {
    dataPerDay.push({ Data: key, [props.xIndex]: element.length });
  });
  return (
    <BarChart
      width={700}
      height={350}
      data={dataPerDay}
      margin={{
        top: 15, right: 20, left: 20, bottom: 5,
      }}

    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Data" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={props.xIndex} fill={theme.palette.secondary.main} />
      {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
    </BarChart>
  );
}

Chart.propTypes = {
  data: array,
  xIndex: String,
};