// src/lib/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5167";
export const api = axios.create({ baseURL: API_BASE });

export interface NoteResponse {
    note_id: number;
    filename: string;
    transcript: string;
    summary: string;
    key_points: string[];
    tasks: any[];
    today?: string;
    sentiment?: string;
    language?: string;
    translated_summary?: string;
    created_at: string;
}

// Typed API methods
export const apiClient = {
    // Transcription
    transcribeAudio: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post<NoteResponse>("/transcribe", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // Notes
    getNotes: async () => api.get("/notes"),
    getNote: async (id: number) => api.get(`/notes/${id}`),
    deleteNote: async (id: number) => api.delete(`/notes/${id}`),
    searchNotes: async (query: string) => api.get(`/search?q=${query}`),
    translateNote: async (id: number, targetLanguage: string) => api.post(`/notes/${id}/translate`, { target_language: targetLanguage }),

    // Tasks
    getTasks: async () => api.get("/tasks"),
    getTasksByNote: async (noteId: number) => api.get(`/tasks/note/${noteId}`),
    updateTaskStatus: async (taskId: number, status: string) =>
        api.patch(`/tasks/${taskId}`, { status }),

    // Voice Commands
    processVoiceCommand: async (command: string, noteId: number) =>
        api.post("/voice-command", { command, note_id: noteId }),
};

