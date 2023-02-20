import { randomInt } from '../../utils/random';
export type PlayerType = "rock" | "paper" | "scissor";
export type Direction = "top" | "right" | "bottom" | "left";
export const OpositeDirectionMap = {
  "top": "bottom",
  "bottom": "top",
  "left": "right",
  "right": "left",
} as const;

export const TypeEmojiMap = {
  rock: "🪨",
  paper: "📄",
  scissor: "✂️"
} as const;

export interface IPlayer {
  type: PlayerType;
  x: number;
  y: number;
  size: number;
  direction: Direction;
}

export function Player({  type, x, y, size }: IPlayer) {
  const emoji = TypeEmojiMap[type];
  const [top, left] = [y * size, x * size];
  const angle = randomInt(-20, 20);

  return (
    <div 
      className='player' 
      style={{
        width: `${size}px`,
        fontSize: `${size * .8}px`,
        height: `${size}px`,
        top: `${(top)}px`,
        left: `${(left)}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <span>{emoji}</span>
    </div>
  )
}