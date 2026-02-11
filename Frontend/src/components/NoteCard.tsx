// src/components/NoteCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface NoteCardProps {
    id: number;
    filename: string;
    summary: string | null;
    created_at: string;
}

export default function NoteCard({ id, filename, summary, created_at }: NoteCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Link href={`/notes/${id}`}>
            <Card className="border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/70 transition-colors cursor-pointer">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-sky-500 shrink-0" />
                            <CardTitle className="text-base truncate">{filename}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(created_at)}</span>
                        </div>
                    </div>
                </CardHeader>
                {summary && (
                    <CardContent>
                        <p className="text-sm text-neutral-400 line-clamp-2">{summary}</p>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
