import React from "react"
import { Link } from "react-router-dom"
import logo from "../logo.svg"
import "./Home.css"

const Home: React.FC = () => {
  const host =
    process.env.NODE_ENV === "production" ? "https://my-battleship-client.herokuapp.com" : "http://localhost:3000"
  const gameId = 10000 + Math.floor(Math.random() * 89999)
  const playerLink = `/${gameId}/0`
  const enemyLink = `${host}/${gameId}/1`
  const localGameLink = `/0/0`

  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>Battleship by Martin Devillers</p>
        <p>
          <Link to={localGameLink} className="Home-link">
            Start Local Game
          </Link>
        </p>
        <p>Or share the below link with an other player to play against them:</p>
        <p>
          <code>{enemyLink}</code>
        </p>
        <p>
          <Link to={playerLink} className="Home-link">
            Start Multiplayer Game
          </Link>
        </p>
      </header>
    </div>
  )
}

export default Home
