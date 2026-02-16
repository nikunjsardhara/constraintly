import { Timer } from "lucide-react";

interface TimerDisplayProps {
  timeLeft: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  if (timeLeft <= 0) return null;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        timeLeft <= 60 ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"
      }`}
    >
      <Timer className="w-5 h-5" />
      <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
    </div>
  );
}
