import { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from "lodash";

import { Board, Direction, OpositeDirectionMap, IPlayer, PlayerType, TypeEmojiMap } from './components/Board';
import { useInterval, useIntervalAnimation } from './hooks/useInterval';
import { randomInt } from './utils/random';

import './App.css'

const DEFAULT_BOARD_SIZE = 15;
const DEFAULT_PLAYER_SIZE = 24;
const DEFAULT_PLAYERS_COUNT = 12;
const DEFAULT_CLOCK = 1000 / 8;

const DESTRUCTION_MODE = false;

function updatePlayers(players: IPlayer[], boardSize: number) {
  const newPlayers = players
    .map(player => {
      switch (player.direction) {
        case "left": player.x = player.x - 1; break;
        case "top": player.y = player.y - 1; break;
        case "right": player.x = player.x + 1; break;
        case "bottom": player.y = player.y + 1; break;
        default: throw new Error("invalid player direction");
      }

      if (player.x > boardSize - 1) {
        player.x = boardSize - 2;
        player.direction = "left";
      }

      if (player.x < 0) {
        player.x = 1;
        player.direction = "right";
      }

      if (player.y > boardSize - 1) {
        player.y = boardSize - 2;
        player.direction = "top";
      }

      if (player.y < 0) {
        player.y = 1;
        player.direction = "bottom";
      }

      return player;
    });

  return newPlayers.map((player, index, players) => {
    const playersCollidedKeys = players.map((item, itemIndex) => {
      if (index === itemIndex) return -1;
      if (player.direction === "right" && player.x + 1 === item.x && player.y === item.y && item.direction === "left") return itemIndex;
      else if (player.direction === "left" && player.x - 1 === item.x && player.y === item.y && item.direction === "right") return itemIndex;
      else if (player.direction === "bottom" && player.y + 1 === item.y && player.x === item.x && item.direction === "top") return itemIndex;
      else if (player.direction === "top" && player.y - 1 === item.y && player.x === item.x && item.direction === "bottom") return itemIndex;
      else if (player.direction === "right" && player.x + 1 === item.x && player.y === item.y && item.x === boardSize - 1) return itemIndex;
      else if (player.direction === "left" && player.x - 1 === item.x && player.y === item.y && item.x === 0) return itemIndex;
      else if (player.direction === "bottom" && player.y + 1 === item.y && player.x === item.x && item.y === boardSize - 1) return itemIndex;
      else if (player.direction === "top" && player.y - 1 === item.y && player.x === item.x && item.y === 0) return itemIndex;
      else if (player.x === item.x && player.y === item.y) return itemIndex;
      return -1;
    }).filter(item => item >= 0);

    if (!playersCollidedKeys.length) {
      return player;
    }

    playersCollidedKeys.forEach(playerCollidedIndex => {
      const playerCollided = players[playerCollidedIndex];

      const looseCollision = (player.type == "rock" && playerCollided.type === "paper")
        || (player.type == "paper" && playerCollided.type === "scissor")
        || (player.type == "scissor" && playerCollided.type === "rock")

      if (!looseCollision) {
        return;
      }

      player.type = playerCollided.type;
    })

    return player;

  });
}

function checkWinner(players: IPlayer[]): PlayerType | false {
  const set = new Set(players.map(player => player.type));
  if (set.size === 3) {
    return false;
  }

  if (![...set.values()].includes('rock')) {
    return "scissor";
  }

  if (![...set.values()].includes('scissor')) {
    return "paper";
  }

  return "rock";
}

function App() {
  const [frame, setFrame] = useState(0);
  const [winner, setWinner] = useState<PlayerType | false>(false);
  const [speed, setSpeed] = useState<number>(DEFAULT_CLOCK);
  const [boardSize, setBoardSize] = useState<number>(DEFAULT_BOARD_SIZE);
  const [playerSize, setPlayerSize] = useState<number>(DEFAULT_PLAYER_SIZE);
  const [playersCount, setPlayersCount] = useState<number>(DEFAULT_PLAYERS_COUNT);
  const players = useRef<IPlayer[]>([]);
  const maxPlayers = (boardSize * boardSize) / 2;

  const forceRender = () => {
    setFrame(prev => prev + 1);
  };

  const { pause, step, resume } = useInterval(() => {
    forceRender();
  }, speed);

  const reset = () => {
    players.current = generatePlayers(playersCount, boardSize);
    setWinner(false);
    setFrame(0);
    resume();
  };

  // Initialize players 
  useEffect(() => {
    const newPlayers = generatePlayers(DEFAULT_PLAYERS_COUNT, boardSize);
    players.current = updatePlayers(newPlayers, boardSize);
  }, []);

  // Every render
  useEffect(() => {
    players.current = updatePlayers(players.current, boardSize);

    const winner = checkWinner(players.current);
    if (winner !== false) {
      setWinner(winner);
    }
  })

  useEffect(() => {
    if (winner) pause();
  }, [winner]);

  const handleChangeBoardSize = useCallback(debounce((event) => {
    setBoardSize(parseInt(event.target.value))
  }, 280, { leading: false, trailing: true }), []);

  const handleChangePlayerSize = useCallback(debounce((event) => {
    setPlayerSize(parseInt(event.target.value))
  }, 280, { leading: false, trailing: true }), []);

  const handleChangeSpeed = useCallback(debounce((event) => {
    setSpeed(parseInt(event.target.value))
  }, 280, { leading: false, trailing: true }), []);

  const handleChangePlayersCount = useCallback(debounce((event) => {
    const newPlayersCount = parseInt(event.target.value);
    setPlayersCount(newPlayersCount);
    players.current = generatePlayers(newPlayersCount, boardSize);
  }, 280, { leading: false, trailing: true }), [boardSize]);

  return (
    <div className="App">
      {winner && <h1>Victory of {TypeEmojiMap[winner]}!</h1>}

      <Board
        playerSize={playerSize}
        size={boardSize}
        players={players.current}
      />
      <div>
        <label>Frame {frame}</label>
      </div>

      <div className='controls'>
        <div>
          <label>
            <p>Board Size: {boardSize}</p>
            <input
              type="range"
              defaultValue={boardSize}
              onChange={handleChangeBoardSize}
              step="1"
              min="5"
              max="30"
            />
          </label>

          <label>
            <p>Player Size: {boardSize}</p>
            <input
              type="range"
              defaultValue={boardSize}
              onChange={handleChangePlayerSize}
              step="1"
              min="12"
              max="32"
            />
          </label>

          <label>
            <p>Players Count: {playersCount}</p>
            <input
              type="range"
              defaultValue={playersCount}
              onChange={handleChangePlayersCount}
              step="1"
              min="2"
              max={maxPlayers}
            />
          </label>
          <label>
            <p>Speed: {speed.toFixed(0)}</p>
            <input
              type="range"
              defaultValue={speed}
              onChange={handleChangeSpeed}
              step="1"
              min="10"
              max="2000"
            />
          </label>
        </div>
      </div>

      <div className='buttons'>
        <button onClick={() => reset()}>Reset</button>
        <button disabled={!!winner} onClick={() => pause()}>Pause</button>
        <button disabled={!!winner} onClick={() => step()}>Step</button>
        <button disabled={!!winner} onClick={() => resume()}>Resume</button>
      </div>
    </div>
  )
}

function generatePlayers(count: number, boardSize: number) {
  let usedLocations: { x: number, y: number }[] = [];

  return [...new Array(count)].map(() => {
    let newPlayer: IPlayer;
    do {
      newPlayer = generatePlayer(boardSize);

      const locationInUse = usedLocations.filter(({ x, y }) => x === newPlayer.x && y === newPlayer.y).length;
      if (locationInUse) {
        continue;
      }

      usedLocations.push({ x: newPlayer.x, y: newPlayer.y });
      break;
    } while (true);

    return newPlayer;
  });
}

function generatePlayer(boardSize: number): IPlayer {
  return {
    direction: ["top", "right", "bottom", "left"][randomInt(0, 3)] as Direction,
    size: 16,
    x: randomInt(0, boardSize - 1),
    y: randomInt(0, boardSize - 1),
    type: ["rock", "paper", "scissor"][randomInt(0, 2)] as PlayerType,
  }
}

export default App
