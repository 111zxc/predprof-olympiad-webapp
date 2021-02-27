import React, { Component } from 'react';
import { Button } from "react-bootstrap"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import app from "../firebase";
import {startDate, curDate, emailRoute } from "./Navbar"




export default class Example extends React.Component {


  newData = [];

  constructor(props){
    super(props);
    this.state = { data: [{kg:11, name: 123}, {kg: 15, name: 115 }] };
    this.DateChange = this.DateChange.bind(this);
  }
  

  DateChange(){
    const that = this;
    this.newData = [];
    let graphD, graphW;
    app.database().ref(emailRoute).get().then(function(snapshot) {
      if (snapshot.exists()) {
          snapshot.forEach((child) => {
              var pos = child.val().search('/');
              var date = parseInt(child.val().slice(pos + 1, pos + 5)); 
              if (date >= startDate && date <= curDate)
              {
                      graphW = parseInt(child.val().slice(0, pos));
                      graphD = date;
                      that.newData.push({ kg: graphW, name: graphD });
                      console.log(that.newData.length);
                      
              }
        }
        );
        
      }
      that.setState({data: that.newData });
    });
    
  }


  render() {
    console.log(this.state);
    return (
        <>
        <Button onClick={this.DateChange}>govno</Button>
        <LineChart
          width={500}
          height={300}
          data = { this.state.data } 
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