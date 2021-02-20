import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Navbar } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { FaWeight } from 'react-icons/fa';

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <>
      <div>
        <Navbar bg="primary" variant="dark" fixed = "top">
            <Navbar.Brand href="/predprof-olympiad-webapp/">
              <h4><FaWeight/>{'       '}
              <strong>Контроль веса</strong></h4>
          </Navbar.Brand>
        </Navbar>
      </div>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Сброс пароля</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Сбросить пароль
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Ещё не зарегистрированы? <Link to="/predprof-olympiad-webapp/signup">Зарегистрироваться!</Link>
      </div>
    </>
  )
}
