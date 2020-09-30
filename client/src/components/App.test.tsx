import React from "react"
import { render } from "@testing-library/react"
import App from "./App"

test("renders Player text", () => {
  const { getByText } = render(<App />)
  const playerElement = getByText(/Player/i)
  expect(playerElement).toBeInTheDocument()
})
