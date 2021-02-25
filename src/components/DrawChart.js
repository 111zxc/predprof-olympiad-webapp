import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useAuth } from "../contexts/AuthContext"
import app from "../firebase";
import { startDate } from "../components/Navbar";




const Dankmemes = () => {
  const [chartData, setChartData] = useState({});
  const [employeeSalary, setEmployeeSalary] = useState([]);
  const [employeeAge, setEmployeeAge] = useState([]);
  const { currentUser, logout } = useAuth()

  const chart = () => {
    var inf, graphW, graphD;

    var curDate = new Date();
    var dd = String(curDate.getDate()).padStart(2, '0');
    var mm = String(curDate.getMonth() + 1).padStart(2, '0');
    curDate = parseInt(dd) + parseInt(mm) * 30;
    var dateRange = [];
    var emailRoute = (currentUser.email).replace(".", "");
    let weights = [];
    let names = [];
    app.database().ref(emailRoute).get().then(function(snapshot) {
        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                var pos = child.val().search('/');
                var date = parseInt(child.val().slice(pos + 1, pos + 5)); 
                if (date >= startDate && date <= curDate)
                {
                        graphW = parseInt(child.val().slice(0, pos));
                        graphD = String(date);
                        names.push(graphD);
                        weights.push(graphW);
                }
          });
        }
      });
        setChartData({
          labels: names,
          datasets: [
            {
              label: "Вес",
              data: weights,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]
        });
      }

  useEffect(() => {
    chart();
  }, []);
  return (
    <div className="App">
      <div>
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: "Контроль веса", display: true },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dankmemes;