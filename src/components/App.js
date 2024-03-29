import React from "react"
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./ChartPage"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"


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
              <Route path="/predprof-olympiad-webapp/signup" component={Signup} />
              <Route path="/predprof-olympiad-webapp/login" component={Login} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}


export default App