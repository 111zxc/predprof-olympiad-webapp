import React from 'react';
import { Button, Modal, ButtonGroup, ToggleButton } from "react-bootstrap"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import app from "../firebase";
import { emailRoute } from "./Navbar"
import DatePicker from "react-datepicker"; //IMP!
import "react-datepicker/dist/react-datepicker.css";

const radios = [
  { name: 'Неделя', value: '1' },
  { name: 'Две недели', value: '2' },
  { name: 'Месяц', value: '3' },
  { name: 'Полгода', value: '4' },
  { name: 'Год', value: '5' },
  { name: 'Вручную', value: '6' },
];

const Today = new Date();


function DateTransfer(date) {
  var tempD;
  if (date > 365) tempD = date - 365;
  else tempD = date;
  let mes = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31]
  var i;
  for (i = 0; i < mes.length; i++) {
    if (tempD - mes[i] > 0) {
      tempD = tempD - mes[i];
    }
    else break;
  }
  i++;

  var d;
  if (tempD < 10) d = '0' + String(tempD);
  else d = String(tempD);

  var m;
  if (i < 10) m = '0' + String(i);
  else m = String(i);

  var s = d + '.' + m + '.';
  if (date > 365) s += '2021';
  else s += '2020';

  return (s);
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
    that.state.cSDate = e; // delay
    that.setState({ cSDate: e });
    let dd = String(e.getDate()).padStart(2, '0');
    let mm = String(e.getMonth() + 1).padStart(2, '0');
    let mes = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31]
    let customDate = parseInt(dd);
    for (var i = 0; i < mes.length; i++) {
      if (i + 1 < parseInt(mm)) {
        customDate = customDate + mes[i];
      }
      else break;
    }
    if (e.getYear() == 121) { customDate = customDate + 365; }
    this.setState({ cStartDate: customDate });
    that.state.cStartDate = customDate;
  }



  HandleClose() {
    this.setState({ show: false });
    this.DateChange();
  }

  HandleOpen() {
    this.setState({ show: true });
    //this.DateChange();
  }

  SetChecked(e) {
    this.setState({ active: e });
  }

  DateChange() {
    let curDate = new Date();
    let dd = String(curDate.getDate()).padStart(2, '0');
    let mm = String(curDate.getMonth() + 1).padStart(2, '0');
    let mes = [31, 28, 31, 30, 31, 31, 30, 31, 30, 31]
    curDate = parseInt(dd);
    for (var i = 0; i < mes.length; i++) {
      if (i + 1 < parseInt(mm)) {
        curDate = curDate + mes[i];
      }
      else break;
    }
    curDate = curDate + 365;
    let startDate = curDate;

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
      <>
        <>
          <Modal
            show={this.state.show}
            onHide={this.HandleClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Ввод веса</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ButtonGroup toggle>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={this.state.active === radio.value}
                    onChange={(e) => this.SetChecked(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
              <DatePicker selected={e} onChange={this.HandleChange} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.HandleClose}>Применить</Button>
            </Modal.Footer>
          </Modal>
        </>
        <>
          <Button onClick={this.HandleOpen} className="justify-content-center">Обновить График</Button>
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
      </>
    );
  }
}
