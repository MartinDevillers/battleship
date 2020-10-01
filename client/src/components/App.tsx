import React from "react"
import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import Game from "./Game"

// Main component for this React application
const App: React.FC = () => (
  <div className="app">
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/:gameId/:player">
          <Game />
        </Route>
      </Switch>
    </Router>
  </div>
)

export default App
