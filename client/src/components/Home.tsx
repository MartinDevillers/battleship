import React from "react"
import { Link } from "react-router-dom"
import logo from "../logo.svg"
import "./Home.css"

const Home: React.FC = () => {
  const host = "http://localhost:3000"
  const gameId = 10000 + Math.floor(Math.random() * 89999)
  const playerLink = `/${gameId}/0`
  const enemyLink = `${host}/${gameId}/1`

  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>Battleship by Martin Devillers</p>
        <p>Share the below link with the other player to play against them:</p>
        <p>
          <code>{enemyLink}</code>
        </p>
        <p>
          <Link to={playerLink} className="Home-link">
            Start Game
          </Link>
        </p>
      </header>
    </div>
  )
}

export default Home
