import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { TaskCard } from "./TaskCard";
import { Timer } from "./Timer";
import { MusicPlayer } from "./MusicPlayer";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const tasks = useQuery(api.tasks.list);
  const initializeTasks = useMutation(api.tasks.initializeTasks);
  const resetAllTasks = useMutation(api.tasks.resetAllTasks);

  useEffect(() => {
    initializeTasks();
  }, [initializeTasks]);

  const completedCount = tasks?.filter((t: { completed: boolean }) => t.completed).length ?? 0;
  const totalCount = tasks?.length ?? 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/25 to-pink-200/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-yellow-200/15 to-amber-200/15 rounded-full blur-2xl" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 md:px-8 py-4 md:py-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-300/40 flex items-center justify-center transform -rotate-6">
                <span className="text-2xl md:text-3xl">🌄</span>
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                  Daily Rhythm
                </h1>
                <p className="text-amber-600/60 text-sm hidden sm:block">Your morning awaits</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => resetAllTasks()}
                className="px-4 py-2 md:px-5 md:py-2.5 bg-white/60 hover:bg-white/80 border border-amber-200/50 rounded-xl text-amber-700 font-medium transition-all hover:shadow-lg text-sm md:text-base"
              >
                Reset Day
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-rose-200/50 transition-all hover:shadow-xl text-sm md:text-base"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Progress Section */}
            <div className="mb-6 md:mb-10">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-white/50 shadow-xl shadow-amber-100/50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-xl md:text-2xl font-semibold text-amber-900 mb-1">Today's Progress</h2>
                    <p className="text-amber-600/70">
                      {completedCount === totalCount && totalCount > 0
                        ? "Amazing! You've completed everything!"
                        : `${totalCount - completedCount} tasks remaining`}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                      {completedCount}
                    </span>
                    <span className="text-amber-400 text-xl md:text-2xl">/ {totalCount}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-4 md:h-5 bg-amber-100/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                    {progress > 0 && (
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/40 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
              {tasks === undefined ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white/40 rounded-3xl p-6 md:p-8 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-200/50 rounded-2xl" />
                      <div className="flex-1">
                        <div className="h-6 bg-amber-200/50 rounded-lg w-3/4 mb-3" />
                        <div className="h-4 bg-amber-100/50 rounded-lg w-full" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                tasks.map((task: { _id: string; name: string; icon: string; description: string; completed: boolean }, index: number) => (
                  <TaskCard key={task._id} task={task as any} index={index} />
                ))
              )}
            </div>

            {/* Music Player */}
            <MusicPlayer />
          </div>
        </main>

        {/* Timer Section */}
        <Timer />

        {/* Footer */}
        <footer className="px-4 py-4 text-center text-amber-500/40 text-xs">
          Requested by @stringer_kade · Built by @clonkbot
        </footer>
      </div>
    </div>
  );
}
