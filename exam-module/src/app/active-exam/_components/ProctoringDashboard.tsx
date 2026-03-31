interface ProctorProps {
  videoRef: React.Ref<HTMLVideoElement>;
  isReady: boolean;
  isSpeechDetected: boolean;
}

export const ProctoringDashboard = ({
  videoRef,
  isReady,
  isSpeechDetected,
}: ProctorProps) => {
  return (
    <div className="space-y-6">
      {/* Video Container */}
      <div className="relative aspect-video bg-slate-800 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-700 ${isReady ? "opacity-100 grayscale" : "opacity-0"}`}
        />

        {/* Speech Detection Indicator */}
        {isReady && (
          <div
            className={`absolute bottom-0 left-0 w-full flex items-center gap-2 px-3 py-2 backdrop-blur-md border-t transition-colors duration-300 ${
              isSpeechDetected
                ? "bg-red-900/60 border-red-500/40"
                : "bg-black/60 border-white/10"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {isSpeechDetected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  isSpeechDetected ? "bg-red-500" : "bg-slate-500"
                }`}
              />
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 ${
                isSpeechDetected ? "text-red-300" : "text-slate-400"
              }`}
            >
              {isSpeechDetected ? "Speech Detected" : "Audio Monitoring"}
            </span>
          </div>
        )}

        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Status Card */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${isReady ? "bg-green-500 animate-pulse" : "bg-slate-500"}`}
          />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {isReady ? "Encrypted Feed Live" : "Awaiting Sensors"}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 uppercase leading-relaxed">
          Biometric patterns & audio frequencies are being processed locally for
          privacy compliance
        </p>
      </div>
    </div>
  );
};
