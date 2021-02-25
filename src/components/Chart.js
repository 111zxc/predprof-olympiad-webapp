import React from 'react';
import { startDate } from "../components/Navbar";
import app from "../firebase";
import { useAuth } from "../contexts/AuthContext"
import { Button } from "react-bootstrap"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DrawChart from "./DrawChart"








export default function Example() {


  var data = [{name: "70", kg: 103}, {name: "71", kg: 11}];

  var inf, graphW, graphD;

  const { currentUser, logout } = useAuth()
  var curDate = new Date();
  var dd = String(curDate.getDate()).padStart(2, '0');
  var mm = String(curDate.getMonth() + 1).padStart(2, '0');
  curDate = parseInt(dd) + parseInt(mm) * 30;
  var dateRange = [];
  var emailRoute = (currentUser.email).replace(".", "");

  function handleClick(e){
    app.database().ref(emailRoute).get().then(function(snapshot) {
      if (snapshot.exists()) {
          snapshot.forEach((child) => {
              var pos = child.val().search('/');
              var date = parseInt(child.val().slice(pos + 1, pos + 5)); 
              if (date >= startDate && date <= curDate)
              {
                      graphW = parseInt(child.val().slice(0, pos));
                      graphD = String(date);
                      data.push({ name: graphD, kg: graphW });
                      console.log(data);
              }
        });

      }
    });
  }
  
  return (
        <> 
        <DrawChart/>
        </>
    );
  }