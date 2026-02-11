"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { RecorderMode, useBrowserRecorder } from "@/hooks/useBrowserRecorder";
import { Mic } from "lucide-react";


export default function Page() {
  const [mode, setMode] = useState<RecorderMode>("mic");
  const { recording, start, stop } = useBrowserRecorder("audio/webm");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setStatus(audioUrl ? "Ready to upload" : recording ? "Recording" : "Idle");
  }, [audioUrl, recording]);

  const onStart = async () => {
    try {
      setStatus(mode === "mic" ? "Requesting microphone…" : "Pick a tab/window and enable 'Share audio'…");
      await start(mode);
      setStatus("Recording");
    } catch (e) {
      console.error(e);
      setStatus("Permission denied or unavailable");
    }
  };

  const onStop = async () => {
    setStatus("Stopping…");
    const blob = await stop();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setStatus("Ready to upload");
  };

  const onUpload = async () => {
    if (!audioUrl) return;
    setUploading(true);
    setStatus("Uploading…");
    try {
      const res = await fetch(audioUrl);
      const blob = await res.blob();
      const fd = new FormData();
      fd.append("file", blob, mode === "mic" ? "mic_recording.webm" : "system_recording.webm");
      await api.post("/upload/single", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus("Uploaded");
    } catch (e) {
      console.error(e);
      setStatus("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">+ New Call</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  value="mic"
                  checked={mode === "mic"}
                  onChange={() => setMode("mic")}
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
                />
                System/Tab audio
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {!recording ? (
  <button
    id="echonotes-record-btn"
    onClick={onStart}
    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
  >
    <Mic className="h-4 w-4" />
    <span>Start Recording</span>
  </button>
) : (
  <button
    onClick={onStop}
    className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300"
  >
    <Mic className="h-4 w-4" />
    <span>Stop</span>
  </button>
)}


          <span className="text-neutral-400">{status}</span>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {audioUrl ? (
            <>
              <audio controls src={audioUrl} className="w-full" />
              <Button onClick={onUpload} disabled={uploading} className="bg-sky-600 hover:bg-sky-500">
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </>
          ) : (
            <div className="text-neutral-500">No transcripts yet — start recording to see the preview.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
