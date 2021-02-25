import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '13.02.2021',
    kg: 63,
  },
  {
    name: '14.02.2021',
    kg: 62,
  },
  {
    name: '15.02.2021',
    kg: 65,
  },
  {
    name: '16.02.2021',
    kg: 67,
  },
  {
    name: '17.02.2021',
    kg: 61,
  },
  {
    name: '18.02.2021',
    kg: 64,
  },
  {
    name: '19.02.2021',
    kg: 63,
  },
];

export default class Example extends PureComponent {

  render() {
    return (
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="kg" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );
  }
}