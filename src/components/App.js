import React from "react"
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/predprof-olympiad-webapp/" component={Dashboard} />
              <PrivateRoute path="/predprof-olympiad-webapp/update-profile" component={UpdateProfile} />
              <Route path="/predprof-olympiad-webapp/signup" component={Signup} />
              <Route path="/predprof-olympiad-webapp/login" component={Login} />
              <Route path="/predprof-olympiad-webapp/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App
