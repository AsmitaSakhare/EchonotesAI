"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Loader2, Download } from "lucide-react";
import TranscriptViewer from "@/components/TranscriptViewer";
import SummaryCard from "@/components/SummaryCard";
import TaskList from "@/components/TaskList";
import VoiceCommandPanel from "@/components/VoiceCommandPanel";

interface NoteDetail {
    id: number;
    filename: string;
    transcript: string;
    raw_transcript: string;
    summary: string;
    key_points: string[];
    created_at: string;
}

interface Task {
    id: number;
    task: string;
    deadline: string | null;
    status: string;
}

export default function NoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const noteId = parseInt(params.id as string);

    const [note, setNote] = useState<NoteDetail | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchNoteDetails();
    }, [noteId]);

    const fetchNoteDetails = async () => {
        try {
            setLoading(true);
            const [noteResponse, tasksResponse] = await Promise.all([
                apiClient.getNote(noteId),
                apiClient.getTasksByNote(noteId),
            ]);
            setNote(noteResponse.data);
            setTasks(tasksResponse.data);
        } catch (error) {
            console.error("Failed to fetch note details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            setDeleting(true);
            await apiClient.deleteNote(noteId);
            router.push("/notes");
        } catch (error) {
            console.error("Failed to delete note:", error);
            alert("Failed to delete note");
        } finally {
            setDeleting(false);
        }
    };

    const handleExport = () => {
        if (!note) return;

        const content = `
Title: ${note.filename}
Date: ${new Date(note.created_at).toLocaleString()}
--------------------------------------------------

SUMMARY
--------------------------------------------------
${note.summary || 'No summary available.'}

KEY POINTS
--------------------------------------------------
${Array.isArray(note.key_points) ? note.key_points.map((p: string) => `- ${p}`).join('\n') : 'No key points available.'}

ACTION ITEMS
--------------------------------------------------
${tasks.length > 0 ? tasks.map(t => `[${t.status === 'completed' ? 'x' : ' '}] ${t.task} ${t.deadline ? `(Due: ${t.deadline})` : ''}`).join('\n') : 'No action items.'}

TRANSCRIPT
--------------------------------------------------
${note.transcript}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-400">Note not found</p>
                <Button onClick={() => router.push("/notes")} className="mt-4">
                    Back to Notes
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/notes")}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{note.filename}</h1>
                        <p className="text-sm text-neutral-500">{formatDate(note.created_at)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="gap-2"
                    >
                        {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                    </Button>
                </div>
            </div>

            {/* Voice Commands */}
            <VoiceCommandPanel noteId={noteId} />

            {/* Summary */}
            <SummaryCard summary={note.summary} keyPoints={note.key_points} />

            {/* Tasks */}
            <TaskList tasks={tasks} onTaskUpdate={fetchNoteDetails} />

            {/* Transcript */}
            <TranscriptViewer transcript={note.transcript} rawTranscript={note.raw_transcript} />
        </div>
    );
}
