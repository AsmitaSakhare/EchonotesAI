// src/components/SummaryCard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import { Loader2, Languages } from "lucide-react";

interface SummaryCardProps {
    summary: string;
    keyPoints: string[];
    sentiment?: string;
    noteId?: number; // Optional for pages where we might not have ID or want translation
}

const sentimentColor: Record<string, string> = {
    Positive: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Neutral: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
    Tense: "bg-red-500/20 text-red-400 border-red-500/30",
    Urgent: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function SummaryCard({ summary, keyPoints, sentiment = "Neutral", noteId }: SummaryCardProps) {
    const [targetLang, setTargetLang] = useState<string>("Hindi");
    const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
    const [translating, setTranslating] = useState(false);

    const handleTranslate = async () => {
        if (!noteId) return;
        setTranslating(true);
        try {
            const res = await apiClient.translateNote(noteId, targetLang);
            if (res.data.translated_summary) {
                setTranslatedSummary(res.data.translated_summary);
            }
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setTranslating(false);
        }
    };

    return (
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                    AI Summary
                </CardTitle>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 text-xs font-medium rounded-full border ${sentimentColor[sentiment] || sentimentColor.Neutral}`}>
                        {sentiment}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* Summary Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mt-1">Executive Summary</h3>

                        {/* Translation Controls (Only if noteId is present) */}
                        {noteId && (
                            <div className="flex items-center gap-2">
                                <Select value={targetLang} onValueChange={setTargetLang}>
                                    <SelectTrigger className="h-8 w-28 text-xs bg-neutral-800 border-neutral-700 text-neutral-300">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Hindi">Hindi</SelectItem>
                                        <SelectItem value="Marathi">Marathi</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                                    onClick={handleTranslate}
                                    disabled={translating}
                                >
                                    {translating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                                </Button>
                            </div>
                        )}
                    </div>

                    <p className="text-neutral-300 leading-relaxed text-base">{summary || "No summary available."}</p>

                    {/* Translated Summary Block */}
                    {translatedSummary && (
                        <div className="mt-4 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Languages className="h-3 w-3 text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-300 uppercase">Translated to {targetLang}</span>
                            </div>
                            <p className="text-indigo-100 leading-relaxed text-base">{translatedSummary}</p>
                        </div>
                    )}
                </div>

                <Separator className="bg-neutral-800/50" />

                {/* Key Points Section */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Key Takeaways</h3>
                    {keyPoints && keyPoints.length > 0 ? (
                        <ul className="grid gap-3">
                            {keyPoints.map((point, index) => (
                                <li key={index} className="flex gap-3 text-neutral-300 text-sm leading-relaxed p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-indigo-400 font-bold shrink-0">•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-neutral-500 text-sm italic">No key points extracted yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
