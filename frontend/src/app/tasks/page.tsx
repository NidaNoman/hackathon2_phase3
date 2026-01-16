"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { TaskList } from "@/components/TaskList";
import { api } from "@/lib/api";
import { Task } from "~/packages/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"; // Import Card components

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await api.get<Task[]>("/api/v1/tasks/", true); // `true` for authenticated
      setTasks(fetchedTasks);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(`Failed to fetch tasks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Function to refresh tasks after a new one is created
  const handleTaskCreated = () => {
    fetchTasks();
  };

  // Function to update task status in the local state
  const handleTaskStatusChange = (
    taskId: number,
    newStatus: "pending" | "completed"
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Function to remove a task from the local state after deletion
  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId));
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateTaskForm onTaskCreated={handleTaskCreated} />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-8"> {/* Added space-y-8 for vertical spacing */}
        <h2 className="text-3xl font-bold mb-6 text-foreground">Pending Tasks</h2>
        <TaskList
          tasks={pendingTasks}
          onStatusChange={handleTaskStatusChange}
          onTaskDeleted={handleTaskDeleted}
          isLoading={loading}
          error={error}
          onRetry={fetchTasks}
        />

        {completedTasks.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">Completed Tasks</h2>
            <TaskList
              tasks={completedTasks}
              onStatusChange={handleTaskStatusChange}
              onTaskDeleted={handleTaskDeleted}
              isLoading={loading}
              error={error}
              onRetry={fetchTasks}
            />
          </>
        )}
      </div>
    </div>
  );
}