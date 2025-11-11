import { useEffect, useState, useRef } from "react";

export function useFleetSimulation(trips, speed) {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        timeRef.current += 1000 * speed;
        const newEvents = trips.flatMap((trip) =>
          trip.events.filter((e) => new Date(e.timestamp).getTime() <= timeRef.current)
        );
        setCurrentEvents(newEvents);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, trips]);

  return { currentEvents, isPlaying, setIsPlaying };
}
