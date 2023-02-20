import { randomId } from "../../utils/random";
import { Player, IPlayer } from "./Player";

interface BoardProp {
  size: number;
  playerSize: number;
  players: IPlayer[];
}

export function Board({ playerSize, size, players }: BoardProp) {
  const width = size * playerSize;
  const height = size * playerSize;

  console.count('## Board.render');
  return (
    <div
      className='board'
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `conic-gradient(from 90deg at 1px 1px, #fff 90deg, #f2f2f2 0) 0 0/${playerSize}px ${playerSize}px`
      }}
    >
      {players.map(({ status, type, x, y, direction }) => (
        <Player
          key={randomId()}
          status={status}
          size={playerSize}
          type={type}
          x={x}
          y={y}
          direction={direction}
        />
      ))}
    </div>
  )
}