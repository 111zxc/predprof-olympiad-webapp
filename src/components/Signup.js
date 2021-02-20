import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Navbar } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { FaWeight } from 'react-icons/fa';

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      history.push("/predprof-olympiad-webapp/")
    } catch {
      setError("Failed to create an account")
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
          <h2 className="text-center mb-4">Зарегистрироваться</h2>
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
            <Form.Group id="password-confirm">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Зарегистрироваться
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Уже есть аккаунт? <Link to="/predprof-olympiad-webapp/login/">Войти!</Link>
      </div>
    </>
  )
}
