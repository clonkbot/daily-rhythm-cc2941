import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const DEFAULT_DURATION = 2 * 60 * 60; // 2 hours (1:59:60)

export function Timer() {
  const timerSession = useQuery(api.timer.get);
  const startTimer = useMutation(api.timer.start);
  const pauseTimer = useMutation(api.timer.pause);
  const resetTimer = useMutation(api.timer.reset);

  const [displayTime, setDisplayTime] = useState(DEFAULT_DURATION);
  const [isComplete, setIsComplete] = useState(false);

  const calculateRemaining = useCallback(() => {
    if (!timerSession) return DEFAULT_DURATION;

    if (timerSession.remainingWhenPaused !== undefined) {
      return timerSession.remainingWhenPaused;
    }

    if (timerSession.isRunning) {
      const elapsed = Math.floor((Date.now() - timerSession.startedAt) / 1000);
      return Math.max(0, timerSession.duration - elapsed);
    }

    return timerSession.duration;
  }, [timerSession]);

  useEffect(() => {
    const updateDisplay = () => {
      const remaining = calculateRemaining();
      setDisplayTime(remaining);
      setIsComplete(remaining === 0 && timerSession?.isRunning === true);
    };

    updateDisplay();

    if (timerSession?.isRunning) {
      const interval = setInterval(updateDisplay, 100);
      return () => clearInterval(interval);
    }
  }, [timerSession, calculateRemaining]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(displayTime);
  const isRunning = timerSession?.isRunning ?? false;
  const progress = ((DEFAULT_DURATION - displayTime) / DEFAULT_DURATION) * 100;

  return (
    <div className={`
      sticky bottom-0 px-4 md:px-8 pb-2
      ${isComplete ? "animate-pulse" : ""}
    `}>
      <div className={`
        max-w-6xl mx-auto
        bg-white/80 backdrop-blur-2xl
        rounded-t-3xl md:rounded-3xl
        border border-white/60
        shadow-2xl shadow-amber-200/50
        overflow-hidden
        ${isComplete ? "ring-4 ring-rose-400 ring-opacity-50" : ""}
      `}>
        {/* Progress bar at top */}
        <div className="h-1.5 bg-amber-100/50">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isComplete
                ? "bg-gradient-to-r from-rose-500 to-orange-500"
                : "bg-gradient-to-r from-amber-400 to-orange-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            {/* Timer Display */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`
                w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center
                ${isRunning
                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200/50"
                  : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200/50"
                }
              `}>
                <span className="text-xl md:text-2xl">
                  {isComplete ? "🔔" : isRunning ? "⏱️" : "⏸️"}
                </span>
              </div>

              <div>
                <p className="text-amber-600/60 text-xs md:text-sm font-medium uppercase tracking-wider mb-0.5">
                  {isComplete ? "Time's Up!" : isRunning ? "Focus Time" : "Ready"}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`
                    font-mono text-3xl md:text-5xl font-bold tracking-tight
                    ${isComplete
                      ? "text-rose-600"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600"
                    }
                  `}>
                    {time.hours}
                  </span>
                  <span className="text-amber-400 text-2xl md:text-4xl font-light animate-pulse">:</span>
                  <span className={`
                    font-mono text-3xl md:text-5xl font-bold tracking-tight
                    ${isComplete
                      ? "text-rose-600"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600"
                    }
                  `}>
                    {time.minutes}
                  </span>
                  <span className="text-amber-400 text-2xl md:text-4xl font-light animate-pulse">:</span>
                  <span className={`
                    font-mono text-3xl md:text-5xl font-bold tracking-tight
                    ${isComplete
                      ? "text-rose-600"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600"
                    }
                  `}>
                    {time.seconds}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 md:gap-3">
              {isRunning ? (
                <button
                  onClick={() => pauseTimer()}
                  className="px-5 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl md:rounded-2xl shadow-lg shadow-orange-200/50 transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => startTimer()}
                  className="px-5 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl md:rounded-2xl shadow-lg shadow-emerald-200/50 transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base"
                >
                  {timerSession?.remainingWhenPaused !== undefined ? "Resume" : "Start"}
                </button>
              )}

              <button
                onClick={() => resetTimer()}
                className="px-5 py-2.5 md:px-8 md:py-3 bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 text-amber-700 font-semibold rounded-xl md:rounded-2xl transition-all text-sm md:text-base"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
