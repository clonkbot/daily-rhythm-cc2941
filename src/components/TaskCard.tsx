import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  name: string;
  icon: string;
  description: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  index: number;
}

const GRADIENTS = [
  "from-amber-400 to-yellow-500",
  "from-orange-400 to-rose-400",
  "from-indigo-400 to-purple-500",
  "from-emerald-400 to-teal-500",
];

const SHADOWS = [
  "shadow-yellow-200/60",
  "shadow-rose-200/60",
  "shadow-purple-200/60",
  "shadow-teal-200/60",
];

export function TaskCard({ task, index }: TaskCardProps) {
  const toggleComplete = useMutation(api.tasks.toggleComplete);

  const handleToggle = () => {
    toggleComplete({ id: task._id });
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        group relative w-full text-left
        bg-white/70 backdrop-blur-xl rounded-3xl p-5 md:p-7
        border-2 transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-1
        ${task.completed
          ? "border-emerald-300/70 bg-emerald-50/50"
          : "border-white/50 hover:border-amber-200/70"
        }
      `}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Completion glow effect */}
      {task.completed && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-200/20 to-teal-200/20 animate-pulse" />
      )}

      <div className="relative flex items-start gap-4 md:gap-5">
        {/* Icon Container */}
        <div className={`
          relative flex-shrink-0 w-14 h-14 md:w-18 md:h-18
          bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}
          rounded-2xl md:rounded-3xl
          shadow-lg ${SHADOWS[index % SHADOWS.length]}
          flex items-center justify-center
          transform transition-transform duration-300
          ${task.completed ? "rotate-6 scale-95" : "group-hover:-rotate-3 group-hover:scale-105"}
        `}>
          <span className="text-2xl md:text-3xl filter drop-shadow-sm">
            {task.completed ? "✓" : task.icon}
          </span>

          {/* Decorative ring */}
          <div className={`
            absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-white/40
            transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity
          `} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className={`
            font-serif text-lg md:text-xl font-semibold mb-1 md:mb-2 transition-colors
            ${task.completed ? "text-emerald-700 line-through decoration-2" : "text-amber-900"}
          `}>
            {task.name}
          </h3>
          <p className={`
            text-sm md:text-base leading-relaxed transition-colors
            ${task.completed ? "text-emerald-600/60" : "text-amber-700/60"}
          `}>
            {task.description}
          </p>
        </div>

        {/* Checkbox */}
        <div className={`
          flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full border-2
          flex items-center justify-center transition-all duration-300
          ${task.completed
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-amber-300 group-hover:border-amber-400 group-hover:bg-amber-50"
          }
        `}>
          {task.completed && (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Completion sparkles */}
      {task.completed && (
        <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8">
          <span className="absolute text-lg animate-bounce">✨</span>
        </div>
      )}
    </button>
  );
}
