"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { RecorderMode, useBrowserRecorder } from "@/hooks/useBrowserRecorder";
import { Mic, Loader2 } from "lucide-react";
import TranscriptViewer from "@/components/TranscriptViewer";
import SummaryCard from "@/components/SummaryCard";
import TaskList from "@/components/TaskList";

interface ProcessingResult {
  note_id: number;
  filename: string;
  transcript: string;
  summary: string;
  key_points: string[];
  tasks: Array<{ id: number; task: string; deadline: string | null; status: string }>;
}

export default function Page() {
  const [mode, setMode] = useState<RecorderMode>("mic");
  const { recording, start, stop } = useBrowserRecorder("audio/webm");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (result) {
      setStatus("Complete");
    } else if (processing) {
      setStatus("Processing...");
    } else if (audioUrl) {
      setStatus("Ready to process");
    } else if (recording) {
      setStatus("Recording");
    } else {
      setStatus("Idle");
    }
  }, [audioUrl, recording, processing, result]);

  const onStart = async () => {
    try {
      setStatus(mode === "mic" ? "Requesting microphone…" : "Pick a tab/window and enable 'Share audio'…");
      setResult(null);
      setError(null);
      await start(mode);
      setStatus("Recording");
    } catch (e) {
      console.error(e);
      setStatus("Permission denied or unavailable");
      setError("Failed to start recording. Please check permissions.");
    }
  };

  const onStop = async () => {
    setStatus("Stopping…");
    const blob = await stop();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setStatus("Ready to process");
  };

  const onProcess = async () => {
    if (!audioUrl) return;

    setProcessing(true);
    setError(null);
    setStatus("Uploading audio...");

    try {
      // Convert blob URL to File
      const res = await fetch(audioUrl);
      const blob = await res.blob();
      const file = new File(
        [blob],
        mode === "mic" ? "mic_recording.webm" : "system_recording.webm",
        { type: "audio/webm" }
      );

      setStatus("Transcribing with Whisper...");

      // Send to backend for processing
      const response = await apiClient.transcribeAudio(file);

      setStatus("Analyzing with GPT...");

      // Set the result
      setResult(response.data);
      setStatus("Complete");

    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.detail || "Processing failed. Please try again.");
      setStatus("Error");
    } finally {
      setProcessing(false);
    }
  };

  const onNewRecording = () => {
    setAudioUrl(null);
    setResult(null);
    setError(null);
    setStatus("Idle");
  };

  return (
    <div className="space-y-6">
      {/* Recording Card */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">+ New Recording</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  value="mic"
                  checked={mode === "mic"}
                  onChange={() => setMode("mic")}
                  disabled={recording || processing}
                />
                Microphone
              </label>
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  value="system"
                  checked={mode === "system"}
                  onChange={() => setMode("system")}
                  disabled={recording || processing}
                />
                System/Tab audio
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {!recording && !audioUrl ? (
            <button
              id="echonotes-record-btn"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <Mic className="h-4 w-4" />
              <span>Start Recording</span>
            </button>
          ) : recording ? (
            <button
              onClick={onStop}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <Mic className="h-4 w-4" />
              <span>Stop</span>
            </button>
          ) : (
            <Button
              onClick={onNewRecording}
              variant="outline"
              disabled={processing}
            >
              New Recording
            </Button>
          )}

          <span className="text-neutral-400">{status}</span>
        </CardContent>
      </Card>

      {/* Audio Preview & Process */}
      {audioUrl && !result && (
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-lg">Preview & Process</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <audio controls src={audioUrl} className="flex-1" />
            <Button
              onClick={onProcess}
              disabled={processing}
              className="bg-sky-600 hover:bg-sky-500 gap-2"
            >
              {processing && <Loader2 className="h-4 w-4 animate-spin" />}
              {processing ? "Processing..." : "Process with AI"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-800 bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">AI Analysis Results</h2>
            <Button onClick={onNewRecording} variant="outline">
              New Recording
            </Button>
          </div>

          {/* Summary */}
          <SummaryCard summary={result.summary} keyPoints={result.key_points} />

          {/* Tasks */}
          <TaskList tasks={result.tasks} />

          {/* Transcript */}
          <TranscriptViewer transcript={result.transcript} />
        </div>
      )}
    </div>
  );
}

