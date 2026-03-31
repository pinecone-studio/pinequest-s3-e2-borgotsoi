#!/usr/bin/env bash
# Copies the ONNX models, worklet bundle, and WASM runtime files that
# @ricky0123/vad-web + onnxruntime-web need at runtime into public/vad-assets/
# so Next.js can serve them as static files.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DEST="$PROJECT_DIR/public/vad-assets"

mkdir -p "$DEST"

VAD_DIST="$PROJECT_DIR/node_modules/@ricky0123/vad-web/dist"
ORT_DIST="$PROJECT_DIR/node_modules/onnxruntime-web/dist"

# Silero ONNX models
cp "$VAD_DIST/silero_vad_legacy.onnx" "$DEST/"
cp "$VAD_DIST/silero_vad_v5.onnx"    "$DEST/"

# Audio worklet bundle
cp "$VAD_DIST/vad.worklet.bundle.min.js" "$DEST/"

# ONNX Runtime WASM + JS wrapper files
cp "$ORT_DIST/ort-wasm-simd-threaded.mjs"  "$DEST/"
cp "$ORT_DIST/ort-wasm-simd-threaded.wasm" "$DEST/"

echo "✅  VAD assets copied to public/vad-assets/"
ls -lh "$DEST"
