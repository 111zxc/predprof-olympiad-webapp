import React from 'react';
import { Button, Modal, ButtonGroup, ToggleButton } from "react-bootstrap"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import app from "../firebase";
import { emailRoute } from "./Navbar"
import DatePicker from "react-datepicker"; //IMP!
import "react-datepicker/dist/react-datepicker.css";

const radios = [
  { name: 'Неделя', value: '1' },
  { name: '2 недели', value: '2' },
  { name: 'Месяц', value: '3' },
  { name: 'Полгода', value: '4' },
  { name: 'Год', value: '5' },
  { name: 'Вручную', value: '6' },
];

const Today = new Date();


function DateTransfer(JDN) {
  var y =	4716,	v =	3,
  j =	1401,	u =	5,
  m =	2,s =	153,
  n =	12,	w =	2,
  r =	4, B = 274277,
  p = 1461,	C = -38;
  var f = JDN + j;
  var e = r * f + v;
  var g = Math.trunc( (e % p) / r);
  var h = u * g + w;

  var DD = Math.trunc( (h % s) / u) + 1;
  var MM = ( (Math.trunc(h / s) + m) % n) + 1;
  var YY = Math.trunc(e / p) - y + Math.trunc( (n + m - MM) / n);

  DD = String(DD);
  MM = String(MM);
  YY = String(YY);
  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  var s = DD + '.' + MM + '.' + YY;
  return s;
}




export default class Example extends React.Component {

  newData = [];

  constructor(props) {
    super(props);
    this.state = {
      data: [{ kg: 0, name: "0" }, { kg: 0, name: "0" }],
      show: false,
      active: 1,
      cStartDate: 427,
      cSDate: Today,
    };
    this.DateChange = this.DateChange.bind(this);
    this.HandleClose = this.HandleClose.bind(this);
    this.HandleOpen = this.HandleOpen.bind(this);
    this.SetChecked = this.SetChecked.bind(this);
    this.HandleChange = this.HandleChange.bind(this);
  }



  HandleChange(e) {
    const that = this;
    that.state.cSDate = e;
    that.setState({ cSDate: e });

    let dd = String(e.getDate()).padStart(2, '0');
    let mm = String(e.getMonth() + 1).padStart(2, '0');
    var D = parseInt(dd);
    var M = parseInt(mm);
    var Y = e.getFullYear();;
    var customDate = 367 * Y - Math.trunc( (7 * (Y + 5001 + Math.trunc( (M - 9) / 7 ) )) / 4 ) + Math.trunc( (275 * M) / 9 ) + D + 1729777;

    this.setState({ cStartDate: customDate });
    that.state.cStartDate = customDate;
  }



  HandleClose() {
    this.setState({ show: false });
    this.DateChange();
  }

  HandleOpen() {
    this.setState({ show: true });
  }

  SetChecked(e) {
    this.setState({ active: e });
  }

  DateChange() {
    let curDate = new Date();
    let dd = String(curDate.getDate()).padStart(2, '0');
    let mm = String(curDate.getMonth() + 1).padStart(2, '0');

    var D = parseInt(dd);
    var M = parseInt(mm);
    var Y = curDate.getFullYear();;
    curDate = 367 * Y - Math.trunc( (7 * (Y + 5001 + Math.trunc( (M - 9) / 7 ) )) / 4 ) + Math.trunc( (275 * M) / 9 ) + D + 1729777;
    var startDate = curDate;

    if (this.state.active == 1) { startDate = startDate - 7; } // Week
    else if (this.state.active == 2) { startDate = startDate - 14; } // 2 Weekes
    else if (this.state.active == 3) { startDate = startDate - 30; } // Month
    else if (this.state.active == 4) { startDate = startDate - 123; } // Half a year
    else if (this.state.active == 5) { startDate = startDate - 365; } // Year
    else if (this.state.active == 6) { startDate = this.state.cStartDate; } // Custom

    const that = this;
    this.newData = [];
    let graphD, graphW;
    app.database().ref(emailRoute).get().then(function (snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          var pos = child.val().search('/');
          var date = parseInt(child.val().slice(pos + 1));
          if (date >= startDate && date <= curDate) {
            graphW = parseInt(child.val().slice(0, pos));
            that.newData.push({ kg: graphW, name: date });
          }
        }
        );
      }
      that.newData.sort(function (a, b) {
        return a.name - b.name;
      })
      for (var i = 0; i < that.newData.length; i++) {
        that.newData[i].name = DateTransfer(that.newData[i].name);
      }

      that.setState({ data: that.newData });
    });

  }


  render() {
    const e = this.state.cSDate;
    return (
      <div  >
        <>
          <Modal
            className = "w-100 text-center justify-content-center align-items-center"
            show={this.state.show}
            onHide={this.HandleClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Настройки графика</Modal.Title>
            </Modal.Header>
            <Modal.Body className = "justify-content-center w-100">
              <ButtonGroup vertical toggle className = "mb-4 w-2 justify-content-center" >
                {radios.map((radio, idx) => (
                  <ToggleButton
                    className = "w-1 justify-content-center"
                    key={idx}
                    type="radio"
                    variant="primary"
                    name="radio"
                    value={radio.value}
                    checked={this.state.active === radio.value}
                    onChange={(e) => this.SetChecked(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
              { "  " }
              Начальная дата:
              <DatePicker selected={e} onChange={this.HandleChange} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.HandleClose}>Применить</Button>
            </Modal.Footer>
          </Modal>
        </>
        <ResponsiveContainer width = "100%" height = {400}>
          
          <LineChart
            className = "w-100 text-center mt-2"
            width={500}
            height={350}
            data={this.state.data}
            margin={{
              top: 30,
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
        </ResponsiveContainer>
        <Button onClick={this.HandleOpen}>Обновить График</Button>
      </div>
    );
  }
}
