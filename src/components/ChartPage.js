import React, { useState, useRef } from "react"
import { Card, Button, Navbar, Jumbotron, Modal, Form } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { FaWeight } from 'react-icons/fa';
import app from "../firebase";
import ChartNav from "./Navbar"
export let emailRoute = "";

//import DatePicker from "react-datepicker"; //IMP!
//import "react-datepicker/dist/react-datepicker.css";

function DateTransferNew() {
  /*let curDate = new Date();
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
  return (curDate);*/
  let curDate = new Date();
  let dd = String(curDate.getDate()).padStart(2, '0');
  let mm = String(curDate.getMonth() + 1).padStart(2, '0');

  var D = parseInt(dd);
  var M = parseInt(mm);
  var Y = curDate.getFullYear();
  var JDN = 367 * Y - Math.trunc( (7 * (Y + 5001 + Math.trunc( (M - 9) / 7 ) )) / 4 ) + Math.trunc( (275 * M) / 9 ) + D + 1729777;

  return JDN;
}


export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()

  const history = useHistory();

  const weightRef = useRef();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  emailRoute = (currentUser.email).replace(".", "");

  function weightSubmit(e) {
    console.log(DateTransferNew());
    let flag = 0;

    //let curDate = new Date();
    //let dd = String(curDate.getDate()).padStart(2, '0');
    //let mm = String(curDate.getMonth() + 1).padStart(2, '0');

    let emailRoute = (currentUser.email).replace(".", "");

    app.database().ref(emailRoute).get().then(function (snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          var pos = child.val().search('/');
          var date = parseInt(child.val().slice(pos + 1));
          if (date == DateTransferNew()) {
            //removing old weight
            app.database().ref(emailRoute + "/" + child.key).remove();
          }
        });
      }

      app.database().ref(emailRoute).push(weightRef.current.value + "/" + DateTransferNew());
      app.database().ref().child(emailRoute).get().then(function (snapshot) {
      if (snapshot.exists()) {
          console.log(snapshot.val());
        }
      else {
          console.log("No data available");
        }
      }).catch(function (error) {
        console.error(error);
      });
      handleClose();
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
        <Navbar bg="primary" variant="dark" fixed="top">
          <Navbar.Brand href="/predprof-olympiad-webapp/">
            <h4><FaWeight />{'       '}
              <strong>Контроль веса</strong></h4>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Button variant="danger" onClick={handleLogout}>
              Выйти из аккаунта
            </Button>
          </Navbar.Collapse>
        </Navbar>
        <Jumbotron className="justify-content-center" style = {{alignItems: 'center', width: 650, alignSelf: 'center' }}>
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
        <Card className="justify-content-center" style={{ alignItems: 'center', width: 650, alignSelf: 'center' }}>
          <Card.Body>
            <ChartNav />
          </Card.Body>
        </Card>
      </div>
    </>
  )
}
