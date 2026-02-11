"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import NoteCard from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface Note {
  id: number;
  filename: string;
  summary: string | null;
  created_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query || query.length < 2) {
      fetchNotes();
      return;
    }

    try {
      setSearching(true);
      const response = await apiClient.searchNotes(query);
      setNotes(response.data.results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meeting Notes</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-neutral-900 border-neutral-800"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-neutral-500" />
        )}
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
        </div>
      ) : notes.length > 0 ? (
        <div className="grid gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} {...note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-400">
            {searchQuery
              ? "No notes found matching your search"
              : "No notes yet. Record and process a meeting to get started."}
          </p>
        </div>
      )}
    </div>
  );
}

