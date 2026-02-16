import { useState, useRef } from "react";

// Curated ambient/focus tracks (royalty-free/creative commons)
const AMBIENT_TRACKS = [
  {
    id: 1,
    title: "Morning Meditation",
    artist: "Ambient Sounds",
    // Using a public domain/CC audio file
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: 2,
    title: "Peaceful Piano",
    artist: "Relaxing Music",
    url: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    color: "from-indigo-400 to-purple-500",
  },
  {
    id: 3,
    title: "Nature Sounds",
    artist: "Forest Ambience",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
    color: "from-emerald-400 to-teal-500",
  },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showTracks, setShowTracks] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = AMBIENT_TRACKS[currentTrack];

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrack(index);
    setShowTracks(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={track.url}
        loop
        onEnded={() => setIsPlaying(false)}
      />

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 shadow-xl shadow-amber-100/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Album Art / Play Button */}
          <button
            onClick={togglePlay}
            className={`
              relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20
              bg-gradient-to-br ${track.color}
              rounded-2xl md:rounded-3xl
              shadow-lg
              flex items-center justify-center
              transform transition-all duration-300
              hover:scale-105 hover:-rotate-3
              group
            `}
          >
            <span className="text-2xl md:text-3xl transition-transform group-hover:scale-110">
              {isPlaying ? "⏸️" : "▶️"}
            </span>

            {/* Animated rings when playing */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-white/40 animate-ping" />
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/20 animate-pulse" />
              </>
            )}
          </button>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-amber-600/50 text-xs font-medium uppercase tracking-wider">
                  {isPlaying ? "Now Playing" : "Focus Music"}
                </p>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-amber-900 truncate">
                  {track.title}
                </h3>
                <p className="text-amber-600/60 text-sm truncate">{track.artist}</p>
              </div>

              {/* Track selector toggle */}
              <button
                onClick={() => setShowTracks(!showTracks)}
                className="p-2 hover:bg-amber-100/50 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <span className="text-amber-500">🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-amber-100 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-gradient-to-r
                  [&::-webkit-slider-thumb]:from-amber-500
                  [&::-webkit-slider-thumb]:to-orange-500
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                "
              />
              <span className="text-amber-500">🔊</span>
            </div>
          </div>
        </div>

        {/* Track List Dropdown */}
        {showTracks && (
          <div className="mt-4 pt-4 border-t border-amber-200/30 space-y-2">
            <p className="text-amber-600/50 text-xs font-medium uppercase tracking-wider mb-3">
              Available Tracks
            </p>
            {AMBIENT_TRACKS.map((t, index) => (
              <button
                key={t.id}
                onClick={() => handleTrackChange(index)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                  ${currentTrack === index
                    ? "bg-amber-100/70 border border-amber-200/50"
                    : "hover:bg-amber-50/50"
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl bg-gradient-to-br ${t.color}
                  flex items-center justify-center text-lg
                `}>
                  🎵
                </div>
                <div>
                  <p className="font-medium text-amber-900">{t.title}</p>
                  <p className="text-sm text-amber-600/60">{t.artist}</p>
                </div>
                {currentTrack === index && (
                  <span className="ml-auto text-emerald-500">✓</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Suno Attribution */}
        <div className="mt-4 pt-3 border-t border-amber-200/20">
          <p className="text-amber-500/40 text-xs text-center">
            🎧 Ambient tracks powered by royalty-free music ·
            <span className="ml-1">Suno API ready for custom AI-generated tracks</span>
          </p>
        </div>
      </div>
    </div>
  );
}
