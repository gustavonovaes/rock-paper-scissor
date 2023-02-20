import { useEffect, useRef } from "react";

export function useInterval(callback: Function, intervalMs = 1000) {
  const handlerRef = useRef<number>();
  const pauseRef = useRef<boolean>(false);
  const stepRef = useRef<boolean>(false);

  const pause = () => {
    pauseRef.current = true;
  }

  const step = () => {
    stepRef.current = true;
  }

  const resume = () => {
    pauseRef.current = false;
  }

  useEffect(() => {
    handlerRef.current = setInterval(() => {
      if (pauseRef.current && !stepRef.current) {
        return
      };
      callback(performance.now())
      stepRef.current = false;
    }, intervalMs);
    return () => clearInterval(handlerRef.current);
  }, [intervalMs]);

  return {
    pause,
    step,
    resume
  }
}

export function useIntervalAnimation(callback: Function, intervalMs = 1000) {
  const requestRef = useRef<number>();
  const previousRequestRef = useRef<number>();
  const pauseRef = useRef<boolean>(false);

  const pause = () => {
    pauseRef.current = true;
  }
  const resume = () => {
    pauseRef.current = false;
  }

  let deltaTimeTotal = 0;

  const animate = (time: number) => {
    if (previousRequestRef.current) {
      const deltaTime = time - previousRequestRef.current;
      deltaTimeTotal += deltaTime;

      if (deltaTimeTotal > intervalMs && !pauseRef.current) {
        deltaTimeTotal = 0;
        callback();
      }
    }
    previousRequestRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    }
  }, []);

  return {
    pause,
    resume
  }
}
