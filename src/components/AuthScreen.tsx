import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch {
      setError("Could not continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-200/40 to-orange-300/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-2xl shadow-orange-300/50 mb-6 transform -rotate-6">
            <span className="text-4xl md:text-5xl">🌄</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 mb-3">
            Daily Rhythm
          </h1>
          <p className="text-amber-800/70 text-lg md:text-xl font-light tracking-wide">
            Start your day with intention
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-amber-200/50 p-6 md:p-10 border border-white/50">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-amber-900 mb-2 text-center">
              {flow === "signIn" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-amber-700/60 text-center mb-8">
              {flow === "signIn" ? "Continue your journey" : "Begin your daily rhythm"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-800 ml-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-amber-200/50 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all text-amber-900 placeholder:text-amber-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-800 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-amber-200/50 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all text-amber-900 placeholder:text-amber-400"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="bg-rose-100/80 text-rose-700 px-4 py-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : flow === "signIn" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="text-amber-600 hover:text-amber-800 font-medium transition-colors"
              >
                {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/70 px-4 text-amber-500 text-sm">or</span>
              </div>
            </div>

            <button
              onClick={handleAnonymous}
              disabled={isLoading}
              className="w-full py-4 bg-white border-2 border-amber-200 hover:border-amber-300 text-amber-700 font-medium rounded-2xl transition-all hover:bg-amber-50 disabled:opacity-50"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-12 text-center text-amber-600/50 text-xs">
          Requested by @stringer_kade · Built by @clonkbot
        </footer>
      </div>
    </div>
  );
}
