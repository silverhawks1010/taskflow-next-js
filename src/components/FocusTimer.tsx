"use client";

import { useEffect, useRef, useState } from "react";

const FOCUS_DURATION_SECONDS = 25 * 60;

export default function FocusTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState(FOCUS_DURATION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const remainingSecondsRef = useRef(FOCUS_DURATION_SECONDS);

  useEffect(() => {
    if (!isTimerRunning) return;

    const intervalId = window.setInterval(() => {
      const nextSeconds = Math.max(0, remainingSecondsRef.current - 1);
      remainingSecondsRef.current = nextSeconds;
      setRemainingSeconds(nextSeconds);
      if (nextSeconds === 0) setIsTimerRunning(false);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning]);

  function resetTimer() {
    setIsTimerRunning(false);
    remainingSecondsRef.current = FOCUS_DURATION_SECONDS;
    setRemainingSeconds(FOCUS_DURATION_SECONDS);
  }

  const formattedTime = `${Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="focus-timer">
      <p className="focus-timer__display" role="timer" aria-label={`Temps restant : ${formattedTime}`}>
        {formattedTime}
      </p>
      <div className="focus-timer__controls">
        <button
          type="button"
          onClick={() => setIsTimerRunning((running) => !running)}
          disabled={!isTimerRunning && remainingSeconds === 0}
        >
          {isTimerRunning ? "Arrêter" : "Démarrer"}
        </button>
        <button type="button" onClick={resetTimer}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
