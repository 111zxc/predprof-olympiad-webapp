import React, { Component } from 'react';
import { Button } from "react-bootstrap"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import app from "../firebase";
import { startDate, curDate, emailRoute } from "./Navbar"


function DateTransfer(date) {
  date = date - 365;
  let mes = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31]

  var i;
  for (i = 0; i < mes.length; i++) {
    if (date - mes[i] > 0) {
      date = date - mes[i];
    }
    else break;
  }
  i++;

  var d;
  if (date < 10) d = '0' + String(date);
  else d = String(date);

  var m;
  if (i < 10) m = '0' + String(i);
  else m = String(i);

  var s = d + '.' + m + '.' + '2021';
  return (s);
}




export default class Example extends React.Component {


  newData = [];

  constructor(props) {
    super(props);
    this.state = { data: [{ kg: 0, name: "0" }, { kg: 0, name: "0" }] };
    this.DateChange = this.DateChange.bind(this);
  }



  DateChange() {
    const that = this;
    this.newData = [];
    let graphD, graphW;
    app.database().ref(emailRoute).get().then(function (snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          var pos = child.val().search('/');
          var date = parseInt(child.val().slice(pos + 1, pos + 5));
          if (date >= startDate && date <= curDate) {
            graphW = parseInt(child.val().slice(0, pos));
            //graphD = DateTransfer(date);
            that.newData.push({ kg: graphW, name: date }); //name: graphD
            //console.log(that.newData.length);
          }
        }
        );
      }
      that.newData.sort(function(a, b){
          return a.name-b.name;
      })
      for(var i = 0; i < that.newData.length; i++)
      {
        that.newData[i].name = DateTransfer(that.newData[i].name);
      }

      that.setState({ data: that.newData });
      console.log(that.data);
    });

  }


  render() {
    console.log(this.state);
    return (
      <>
        <Button onClick={this.DateChange}>Обновить График</Button>
        <LineChart
          width={500}
          height={300}
          data={this.state.data}
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
      </>
    );
  }
}
