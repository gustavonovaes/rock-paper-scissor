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
  status: "moving" | "collided" | "destroyed";
}

export function Player({ status, type, x, y, size }: IPlayer) {
  const emoji = status === "collided" ? "💥" : TypeEmojiMap[type];
  const [top, left] = [y * size, x * size];

  return (
    <div 
      className='player' 
      style={{
        width: `${size}px`,
        fontSize: `${size * .8}px`,
        height: `${size}px`,
        top: `${(top)}px`,
        left: `${(left)}px`
      }}
    >
      <span>{emoji}</span>
    </div>
  )
}