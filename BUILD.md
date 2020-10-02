# Before we begin

Given the constraints of the project I'm going for a setup with:
* **Client** (frontend) using React.
* **Server** (backend) using NodeJS and a SQL-compatible persistence provider.

Things I'll do from the start:
* **Client and Server separation in independent projects**. It's easier to kickstart a React app (create-react-app) and Node app, then having to create a "master" app that does everything. The client and server seperation is quite common and conforms to the mental model of most developers.
* **TypeScript** in both client and server. This is a no-brainer for these types of projects and in 2020 I wouldn't write plain JavaScript anymore unless I was targeting old browsers.
* **Linting**. Even with small projects I'd never do JavaScript or TypeScript without a linter. It enforces a minimum quality bar right from the start. Also, it's easier to do linting right from the start, than adding it later and having to fix hundreds of problems.
* **Hot reloading**. For speed of development. Should come out of the box with create-react-app.

Things I'll do later:
* **Deployment**. I first want to have everything working on my machine, before I'll worry about bringing it to the cloud.
* **Unit testing**. I'll write tests for those methods that I feel unsure about, but I'm not going to go 80% coverage first. 

Things I am not going to do (but would strongly recommend if this was the real deal):
* **Automated UI testing**. This used to be a big ordeal in the past, but in 2020 it's doable (wouldn't say easy) to create a fully automated end-to-end test with tech like Selenium, BrowserStack, Headless Chrome, etc. In this case I'd have two simulated players play out a pre-configured match. While harder to setup these tests are much more valuable than a series of unit tests since they literally test the application from the perspective of the user.

I'm going to build this game as a fat-client application. This means that most of the logic will reside within the client and the server is reduced to a "dumb" storage-and-retrieval service. The main advantage is that it's for me as a developer to quickly put things together.

# Model

I'm going to think of a rudimentary mental model for this game. It helps me to first think out this model, before I start coding. There's a few things to think about:
* **Less is more**. It's best to keep the model abstract and express only those concepts necessary to persist the game and rebuild the actual game board in memory. I also prefer more semantically expressive concepts like a "Ship" and a "Shot" than say a "Grid" made of X,Y coordinates that are in some state. In the end, the grid is just a specific representation (view) on the model. 
* **Client vs Server perspectives**. While both the client and the server possess similar concepts (e.g. board, ships, shots) there are a few subtle differences to consider. For instance, since the client is used from the perspective of a single player, there's a clear distinction between the player's board (mine) and the opponent's board (theirs). Both boards have different behaviors. "My" board shows my ships, but I can't see the ships on "their" board until I've sunk them. On the server side, there's a distinction between the players (A and B) but both sides are equal.
* **Actions vs Events**. An action is performed by a player by interacting with the game client and requires *immediate* (or as soon as possible) feedback. An event is something happening "outside" the application (could be the server or the other game client) but the current application is interested in. 

## Objects

```
ServerGame:
  BoardA: Board
  BoardB: Board
  Turn: Player
  
ClientGame:
  PlayerBoard: Board
  EnemyBoard: Board
  IsMyTurn: Boolean
  
Board:
  Ships: Ship[]
  Shots: Shot[]
  
Ship:
  Name: String
  Positions: Coordinate[]
  
Shot:
  Target: Coordinate
  IsHit: Boolean
  
Coordinate:
  X: Integer
  Y: Integer
  
Player:
  A,
  B
```

## API

`GET /{game}/{player}`

Returns game state for that player

`POST /{game}/{player}/fire-shot`

Fires a shot at the other player's board

`EVENT-SOURCE /{game}/{player}/shot-received`

Occurs when a shot by the other player has been made

# Build log

1. Initialize client project with `npx create-react-app my-app --template typescript`
2. Add linting using ESLint with TS support (not TSLint since it's deprecated)/
3. Draw a rudimentary Battleship game board, which is a grid. Draw inspiration from: https://www.freecodecamp.org/news/create-gameoflife-with-react-in-one-hour-8e686a410174/
4. Add ships and shots to the board. Create a nice representation, so it's clear what's a ship and what's a shot. Modern CSS allows you to easily create appealing visual presentations, animations and even simple icons. They perform well and look good on any device (hdpi or otherwise).
5. Reuse the board for both the player and the enemy. There's some subtle differences that need to be worked out, such as the player board shows ships whereas the enemy board doesn't.
6. In creating the board I found out I actually need a whole series of different cells: ship, a sunk ship, a missed shot, a direct hit, a "being targeted" indicator, a targeted indicator, etc. Also, my Board component was getting heavy with all the different cells that actually have little overlap with each other, so I decided to create all of these as separate components and move the orchestration to the Game component. 
7. The Game class will be the top-level component responsible for holding the client's game state and wiring user actions to server side operations.
8. Create the game service client. I'll go with a "fake" client first, so I can completely simulate a game using just the client. The fake client uses random sleeps to simulate client-server latency and waiting for the opponent to make a move. Once that's stable I'll know how the server should behave, and I can go implement that. 
9. Spent some time dealing with all the *intermittent* game states (loading game data; after firing a shot; waiting for opponent).
10. Ran into a recently introduced known dependency problem with react-script and typescript-eslint, so pinning packages to 4.0.1: https://github.com/typescript-eslint/typescript-eslint/issues/2540 -- well that didn't work; downgrading to 2.x
11. Initialize server project following https://github.com/treyhuffine/typescript-node-example
12. Setup basic handlers, service and storage. I'm going to have the storage class return a hardcoded game state for now.
13. Enabled debugging (--inspect flag no longer works on ts-node).
14. Adding sqlite3 database to storage class for persistence (using in-memory database for now).
15. Wrote most of the server side game logic and tested the API with PostMan.
16. Adding a "real" GameServerClient implementation to the client that communicates with the server API.
17. Adding starting page to client and routing to switch from the home screen to the game screen.
18. Setting up Server Side Events for handling received shots. Had a little trouble with my dev setup losing connection because of https://github.com/facebook/create-react-app/issues/1633
19. Deploying client & server on Heroku. Ran into some deployment woes with Heroku but nothing serious. Added CORS support since we're running on separate servers.
20. Added ability to choose between playing against the computer or a real person
21. Added win detection 
22. Tried to move common assets to a shared library using Typescript Project References feature but had to abandon that plan because create-react-app doesn't support it (yet) https://github.com/facebook/create-react-app/issues/6799
23. Added fleet rotation

# Todo
* Responsiveness (aka make it work on a smartphone)
* CSS still feels messy and spread around
* Proper unit testing
