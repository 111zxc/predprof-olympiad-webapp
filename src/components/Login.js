import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Navbar } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { FaWeight } from 'react-icons/fa';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/predprof-olympiad-webapp/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <>
      <div>
        <Navbar bg="primary" variant="dark" fixed="top">
          <Navbar.Brand href="/predprof-olympiad-webapp/">
            <h4><FaWeight />{'       '}
              <strong>Контроль веса</strong></h4>
          </Navbar.Brand>
        </Navbar>
      </div>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Авторизация</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Войти
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Ещё не зарегистрированы? <Link to="/predprof-olympiad-webapp/signup">Зарегистрироваться!</Link>
      </div>
    </>
  )
}
