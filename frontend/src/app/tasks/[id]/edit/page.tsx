"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "~/packages/types";
import { UpdateTaskForm } from "@/components/UpdateTaskForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface EditTaskPageProps {
  params: {
    id: string;
  };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter();
  const taskId = parseInt(params.id);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(taskId)) {
      setError("Invalid Task ID.");
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedTask = await api.get<Task>(`/api/v1/tasks/${taskId}/`, true);
        setTask(fetchedTask);
      } catch (err: any) {
        console.error("Failed to fetch task:", err);
        setError(`Failed to load task: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-xl font-semibold">Loading task editor...</div>
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
        <UpdateTaskForm task={task} />
    </div>
  );
}
