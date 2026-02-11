// src/components/TaskList.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Calendar, FileText } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

export interface Task {
    id: number;
    task: string;
    deadline: string | null;
    status: string;
    note_id?: number;
    note_filename?: string;
}

interface TaskListProps {
    tasks: Task[];
    onTaskUpdate?: () => void;
}

export default function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

    const toggleTaskStatus = async (taskId: number, currentStatus: string) => {
        setUpdatingTaskId(taskId);
        try {
            const newStatus = currentStatus === "pending" ? "completed" : "pending";
            await apiClient.updateTaskStatus(taskId, newStatus);
            onTaskUpdate?.();
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const isOverdue = (deadline: string | null) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadlineDate < today;
    };

    const formatDeadline = (deadline: string | null) => {
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
                <CardTitle className="text-lg">Action Items</CardTitle>
            </CardHeader>
            <CardContent>
                {tasks && tasks.length > 0 ? (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${task.status === "completed"
                                    ? "border-neutral-800 bg-neutral-900/30"
                                    : "border-neutral-700 bg-neutral-900/50"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleTaskStatus(task.id, task.status)}
                                    disabled={updatingTaskId === task.id}
                                    className="mt-0.5 shrink-0 hover:scale-110 transition-transform disabled:opacity-50"
                                >
                                    {task.status === "completed" ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-neutral-500" />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`${task.status === "completed"
                                            ? "line-through text-neutral-500"
                                            : "text-neutral-200"
                                            }`}
                                    >
                                        {task.task}
                                    </p>

                                    {task.deadline && (
                                        <div
                                            className={`flex items-center gap-1.5 mt-1.5 text-xs ${isOverdue(task.deadline) && task.status !== "completed"
                                                ? "text-red-400"
                                                : "text-neutral-500"
                                                }`}
                                        >
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDeadline(task.deadline)}</span>
                                            {isOverdue(task.deadline) && task.status !== "completed" && (
                                                <span className="text-red-400 font-medium ml-1">(Overdue)</span>
                                            )}
                                        </div>
                                    )}

                                    {task.note_filename && task.note_id && (
                                        <Link
                                            href={`/notes/${task.note_id}`}
                                            className="flex items-center gap-1.5 mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors w-fit"
                                        >
                                            <FileText className="h-3 w-3" />
                                            <span>{task.note_filename}</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 text-sm">No action items found</p>
                )}
            </CardContent>
        </Card>
    );
}
