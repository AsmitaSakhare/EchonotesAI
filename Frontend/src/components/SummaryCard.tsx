// src/components/SummaryCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SummaryCardProps {
    summary: string;
    keyPoints: string[];
}

export default function SummaryCard({ summary, keyPoints }: SummaryCardProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
                <CardTitle className="text-lg">AI Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Summary */}
                <div>
                    <h3 className="text-sm font-semibold text-neutral-400 mb-2">Summary</h3>
                    <p className="text-neutral-200 leading-relaxed">{summary}</p>
                </div>

                <Separator className="bg-neutral-800" />

                {/* Key Points */}
                <div>
                    <h3 className="text-sm font-semibold text-neutral-400 mb-2">Key Points</h3>
                    {keyPoints && keyPoints.length > 0 ? (
                        <ul className="space-y-2">
                            {keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-1">•</span>
                                    <span className="text-neutral-300">{point}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-neutral-500 text-sm">No key points extracted</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
