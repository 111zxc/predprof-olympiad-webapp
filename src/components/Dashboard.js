import React, { useState, useRef } from "react"
import { Card, Button, Navbar, Jumbotron, Modal, Form } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { FaWeight } from 'react-icons/fa';
import Chart from "./Chart"
import DatePicker from "react-datepicker";
import app from "../firebase";
import  ChartNav from "./Navbar"

import "react-datepicker/dist/react-datepicker.css";

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  
  const history = useHistory();
  
  const weightRef = useRef();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [startDate, setStartDate] = useState(new Date());

  function weightSubmit(e){
    let curDate = new Date();
    let dd = String(curDate.getDate()).padStart(2, '0');
    let mm = String(curDate.getMonth() + 1).padStart(2, '0');
    let emailRoute = (currentUser.email).replace(".", "");
    app.database().ref(emailRoute).push(weightRef.current.value + "/" + String(parseInt(dd) + parseInt(mm) * 30));
    app.database().ref().child(emailRoute).get().then(function(snapshot) {
      if (snapshot.exists()) {
      console.log(snapshot.val());
      }
      else {
      console.log("No data available");
      }
      }).catch(function(error) {
      console.error(error);
      });
  }

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/predprof-olympiad-webapp/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <>  
      <div>
        <Navbar bg="primary" variant="dark" fixed = "top">
            <Navbar.Brand href="/predprof-olympiad-webapp/">
              <h4><FaWeight/>{'       '}
              <strong>Контроль веса</strong></h4>
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
            <Button variant="danger" onClick={handleLogout}>
              Выйти из аккаунта
            </Button>
            </Navbar.Collapse>
        </Navbar>
        <Jumbotron className="justify-content-center"> 
          <h3>Не забывайте вводить вес!</h3>
          <p>
            Ежедневный ввод веса позволит строить более точные и полезные графики!
          </p>
          <p>
          <Button variant="primary" onClick={handleShow}>
              Ввести вес
          </Button>
          </p>
          <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ввод веса</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group>
          <Form.Control ref={weightRef} type="text" required />
        </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={weightSubmit}>Применить</Button>
        </Modal.Footer>
      </Modal>
        </Jumbotron>
          <Card className = "justify-content-center" style = {{width: '37.5rem'}}>
          <Card.Header>
          <ChartNav />
          </Card.Header>
            <Card.Body>
              <Chart />
              Начальная дата:
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            </Card.Body>
          </Card>
      </div>
    </>
  )
}

