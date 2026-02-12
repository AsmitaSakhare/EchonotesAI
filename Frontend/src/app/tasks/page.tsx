"use client";

import { useState, useEffect } from "react";
import TaskList, { Task } from "@/components/TaskList";
import { apiClient } from "@/lib/api";
import { CheckSquare, ListFilter, AlertCircle, Clock, CheckCircle2, RotateCcw, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_TASKS: Task[] = [
    { id: 201, task: "Review ensuring mobile responsiveness is working", deadline: new Date(Date.now() - 86400000 * 2).toISOString(), status: "pending", note_id: 101, note_filename: "Weekly_Sync_Design_Review.webm" },
    { id: 202, task: "Update the API documentation for the new endpoints", deadline: new Date(Date.now() + 86400000 * 1).toISOString(), status: "pending", note_id: 101, note_filename: "Weekly_Sync_Design_Review.webm" },
    { id: 203, task: "Schedule a follow-up meeting with the design lead", deadline: new Date(Date.now() + 86400000 * 3).toISOString(), status: "pending", note_id: 101, note_filename: "Weekly_Sync_Design_Review.webm" },
    { id: 204, task: "Implement granular filters for user activity reports", deadline: new Date(Date.now() + 86400000 * 5).toISOString(), status: "pending", note_id: 102, note_filename: "Client_Feedback_Q1_Roadmap.mp3" },
    { id: 205, task: "Export user data to CSV feature", deadline: new Date(Date.now() + 86400000 * 7).toISOString(), status: "pending", note_id: 102, note_filename: "Client_Feedback_Q1_Roadmap.mp3" },
    { id: 206, task: "Define push notification strategy", deadline: new Date(Date.now() + 86400000 * 10).toISOString(), status: "pending", note_id: 103, note_filename: "Project_Kickoff_Mobile_App.wav" },
    { id: 207, task: "Draft initial authentication flow diagrams", deadline: new Date(Date.now() - 86400000 * 5).toISOString(), status: "completed", note_id: 103, note_filename: "Project_Kickoff_Mobile_App.wav" },
];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"pending" | "overdue" | "due-soon" | "completed">("pending");

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await apiClient.getTasks();
            if (res.data && res.data.length > 0) {
                setTasks(res.data);
            } else {
                console.warn("No tasks found from API, using mock data for demo.");
                setTasks(MOCK_TASKS);
            }
        } catch (error) {
            console.error("Failed to fetch tasks, using mock data:", error);
            setTasks(MOCK_TASKS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const isOverdue = (deadline: string | null, status: string | undefined) => {
        if (!deadline || status === "completed") return false;
        const d = new Date(deadline);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return d < now;
    };

    const getFilteredTasks = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        const next7Days = new Date(now);
        next7Days.setDate(now.getDate() + 7);

        const isDueSoon = (deadline: string | null) => {
            if (!deadline) return false;
            const d = new Date(deadline);
            return d >= now && d <= next7Days;
        };

        let filtered = tasks;

        // First level filtering based on status/deadline logic
        if (filter === "completed") {
            filtered = tasks.filter(t => t.status === "completed");
        } else {
            // Base: all pending
            filtered = tasks.filter(t => t.status !== "completed");

            if (filter === "overdue") {
                filtered = filtered.filter(t => isOverdue(t.deadline, t.status));
            } else if (filter === "due-soon") {
                filtered = filtered.filter(t => isDueSoon(t.deadline));
            }
        }

        // Sorting
        // 1. Overdue first (if pending)
        // 2. Deadline ascending (nearest first)
        // 3. No deadline last
        return filtered.sort((a, b) => {
            if (a.status === "completed" && b.status === "completed") {
                // Sort completed by deadline desc (most recent relevant) or id desc
                return b.id - a.id;
            }

            const aOverdue = isOverdue(a.deadline, a.status);
            const bOverdue = isOverdue(b.deadline, b.status);

            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;

            if (a.deadline && b.deadline) {
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            if (a.deadline) return -1;
            if (b.deadline) return 1;

            return b.id - a.id; // Newest first fallback
        });
    };

    const handleTaskUpdate = () => {
        fetchTasks();
    };

    const filteredTasks = getFilteredTasks();

    const counts = {
        pending: tasks.filter(t => t.status !== "completed").length,
        overdue: tasks.filter(t => isOverdue(t.deadline, t.status)).length,
        dueSoon: tasks.filter(t => {
            if (t.status === "completed" || !t.deadline) return false;
            const d = new Date(t.deadline);
            const now = new Date(); now.setHours(0, 0, 0, 0);
            const next7 = new Date(now); next7.setDate(now.getDate() + 7);
            return d >= now && d <= next7;
        }).length,
        completed: tasks.filter(t => t.status === "completed").length
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Tasks Dashboard</h1>
                    <p className="text-neutral-400 mt-1">Manage action items across all meetings</p>
                </div>
                <button
                    onClick={fetchTasks}
                    className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                    title="Refresh tasks"
                >
                    <RotateCcw className={`h-5 w-5 text-neutral-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            {/* Metric Cards (optional, maybe overkill, let's stick to tabs for now) */}

            <div className="flex gap-2 p-1 bg-neutral-900/50 rounded-lg w-fit border border-neutral-800">
                <FilterTab
                    active={filter === "pending"}
                    onClick={() => setFilter("pending")}
                    label="All Pending"
                    count={counts.pending}
                    icon={ListFilter}
                />
                <FilterTab
                    active={filter === "due-soon"}
                    onClick={() => setFilter("due-soon")}
                    label="Due Soon"
                    count={counts.dueSoon}
                    icon={CalendarClock}
                    activeClass="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                />
                <FilterTab
                    active={filter === "overdue"}
                    onClick={() => setFilter("overdue")}
                    label="Overdue"
                    count={counts.overdue}
                    icon={AlertCircle}
                    activeClass="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                />
                <FilterTab
                    active={filter === "completed"}
                    onClick={() => setFilter("completed")}
                    label="Completed"
                    count={counts.completed}
                    icon={CheckCircle2}
                />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredTasks.length > 0 ? (
                    <TaskList tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
                ) : (
                    <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                        <CheckSquare className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-neutral-300">No tasks found</h3>
                        <p className="text-neutral-500 max-w-sm mx-auto mt-1">
                            {filter === "completed"
                                ? "You haven't completed any tasks yet."
                                : "You're all caught up! No pending tasks in this category."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterTab({ active, onClick, label, count, icon: Icon, activeClass }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${active
                    ? (activeClass || "bg-neutral-800 text-white shadow-sm")
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }
            `}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {count > 0 && (
                <span className={`
                    ml-1 px-1.5 py-0.5 rounded-full text-xs
                    ${active ? "bg-black/20" : "bg-neutral-800 text-neutral-300"}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
}
