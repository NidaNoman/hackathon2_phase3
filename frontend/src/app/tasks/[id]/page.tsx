"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Task } from "~/packages/types";
import { DeleteTaskConfirm } from "@/components/DeleteTaskConfirm";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchTask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTask = await api.get<Task>(`/api/v1/tasks/${taskId}`, true);
      setTask(fetchedTask);
    } catch (err: any) {
      console.error("Failed to fetch task:", err);
      setError(`Failed to fetch task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId, fetchTask]);


  const handleTaskDeleted = (deletedTaskId: number) => {
    router.push("/tasks"); // Redirect to task list after deletion
  };


  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-xl font-semibold">Loading task...</div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 border-2 border-dashed border-destructive/50 rounded-lg bg-destructive/10 text-destructive space-y-4">{error}</div>;
  }

  if (!task) {
    return <div className="text-center p-8 border-2 border-dashed rounded-lg">Task not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tasks
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          {task.description && (
            <CardDescription>{task.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
            <span
                className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
                    task.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                )}
                >
                {task.status}
            </span>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href={`/tasks/${task.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <DeleteTaskConfirm
            taskId={task.id}
            taskTitle={task.title}
            onDeleteSuccess={handleTaskDeleted}
          >
            <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DeleteTaskConfirm>
        </CardFooter>
      </Card>
    </div>
  );
}