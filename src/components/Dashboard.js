import React, { useState, useRef } from "react"
import { Card, Button, Navbar, Nav, Jumbotron, Modal, Form, Row } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { FaWeight } from 'react-icons/fa';
import Chart from "./Chart"


export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory();
  const weightRef = useRef(50);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <Jumbotron>
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
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ввод веса</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group>
          <Form.Control ref={weightRef}/>
        </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary">Применить</Button>
        </Modal.Footer>
      </Modal>
        </Jumbotron>
          <Card style = {{width: '37.5rem'}}>
          <Card.Header>
          <Nav  bg = "primary" className = "justify-content-center" variant="pills" defaultActiveKey="#first">
            <Nav.Item>
              <Nav.Link eventKey = "1">Неделя</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link eventKey = "2">Две недели</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey = "3">Месяц</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey = "4">Полгода</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link eventKey = "5">Год</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey = "6">Вручную</Nav.Link>
            </Nav.Item>
          </Nav>
          </Card.Header>
            <Card.Body>
              <Chart />
            </Card.Body>
          </Card>
      </div>
    </>
  )
}

