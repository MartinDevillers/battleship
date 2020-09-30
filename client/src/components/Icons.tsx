import React from "react"
import "./Icons.css"

export const ShotMiss: React.FC = () => (
  <div className="cell miss">
    <div className="icon target" />
  </div>
)
export const ShotHit: React.FC = () => (
  <div className="cell hit">
    <div className="icon target" />
  </div>
)
export const Ship: React.FC = () => (
  <div className="cell ship">
    <div className="icon plus" />
  </div>
)
export const SunkShip: React.FC = () => (
  <div className="cell hit">
    <div className="icon target-solid" />
  </div>
)
export const Focus: React.FC = () => (
  <div className="cell focus">
    <div className="icon focus" />
  </div>
)
export const Targeting: React.FC = () => (
  <div className="cell focus active">
    <div className="icon focus spinning" />
    <div className="icon targeting" />
  </div>
)
