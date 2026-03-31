"use client";

import { useEffect, useRef, useState } from "react";

export interface UseVoiceProctoringOptions {
  onFlag: (type: string) => void;
  enabled: boolean;
}

export interface UseVoiceProctoringReturn {
  /** True while the VAD model considers the user to be speaking */
  isSpeechDetected: boolean;
}

/**
 * Replaces the old volume-threshold approach with Silero VAD via @ricky0123/vad-web.
 * Only fires the proctor flag when a speech segment survives the full
 * positiveSpeechThreshold + minSpeechMs gate, eliminating background-noise false positives.
 */
export function useVoiceProctoring({
  onFlag,
  enabled,
}: UseVoiceProctoringOptions): UseVoiceProctoringReturn {
  const [isSpeechDetected, setIsSpeechDetected] = useState(false);

  const onFlagRef = useRef(onFlag);
  onFlagRef.current = onFlag;

  const vadRef = useRef<{ destroy: () => Promise<void> } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let destroyed = false;

    const initVAD = async () => {
      try {
        const { MicVAD } = await import("@ricky0123/vad-web");

        if (destroyed) return;

        const vad = await MicVAD.new({
          baseAssetPath: "/vad-assets/",
          onnxWASMBasePath: "/vad-assets/",

          positiveSpeechThreshold: 0.7,
          negativeSpeechThreshold: 0.55,
          minSpeechMs: 500,
          redemptionMs: 300,

          onSpeechStart: () => {
            console.log("[VAD] speech start (tentative)");
          },

          onSpeechRealStart: () => {
            console.log("[VAD] speech confirmed (real start)");
            if (!destroyed) setIsSpeechDetected(true);
          },

          onSpeechEnd: () => {
            console.log("[VAD] speech ended – flagging human_speech_detected");
            if (!destroyed) {
              onFlagRef.current("human_speech_detected");
              setIsSpeechDetected(false);
            }
          },

          onVADMisfire: () => {
            console.log("[VAD] misfire (too short, ignored)");
            if (!destroyed) setIsSpeechDetected(false);
          },

          onFrameProcessed: () => {},
        });

        if (destroyed) {
          await vad.destroy();
          return;
        }

        vadRef.current = vad;
        await vad.start();
        console.log("[VAD] MicVAD started successfully");
      } catch (err) {
        console.error("[useVoiceProctoring] VAD init failed:", err);
      }
    };

    void initVAD();

    return () => {
      destroyed = true;
      setIsSpeechDetected(false);
      if (vadRef.current) {
        void vadRef.current.destroy();
        vadRef.current = null;
      }
    };
  }, [enabled]);

  return { isSpeechDetected };
}
