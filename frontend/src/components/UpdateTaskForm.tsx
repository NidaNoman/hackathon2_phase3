"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task, UpdateTask, TaskStatus } from "~/packages/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup";
import { Loader2, CheckCircle, AlertCircle, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/Card";
import { useRouter } from "next/navigation";

interface UpdateTaskFormProps {
  task: Task;
}

export function UpdateTaskForm({ task }: UpdateTaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
  }, [task]);

  const validateForm = () => {
    let isValid = true;
    if (!title.trim()) {
      setTitleError("Title is required.");
      isValid = false;
    } else if (title.trim().length > 255) {
      setTitleError("Title cannot exceed 255 characters.");
      isValid = false;
    } else {
      setTitleError(null);
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const updatedTask: UpdateTask = { title, description, status };
      await api.put(`/api/v1/tasks/${task.id}/`, updatedTask, true);
      setMessage("Task updated successfully!");
      setIsError(false);
      setTimeout(() => router.push('/tasks'), 1000);
    } catch (error: any) {
      console.error("Failed to update task:", error);
      setMessage(error.message || "Failed to update task.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(null);
              }}
              required
              disabled={loading}
              className="h-12"
            />
            {titleError && <p className="text-destructive text-sm mt-1">{titleError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            ></Textarea>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <RadioGroup value={status} onValueChange={(value: TaskStatus) => setStatus(value)} disabled={loading} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="status-pending" />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed">Completed</Label>
              </div>
            </RadioGroup>
          </div>
          {message && (
            <div
                className={`flex items-center gap-3 p-3 mt-4 rounded-md text-sm ${
                isError ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700"
                }`}
            >
                {isError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                <span>{message}</span>
            </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/tasks')} disabled={loading}>
                Cancel
            </Button>
            <Button type="submit" disabled={loading || !!titleError} className="min-w-[120px]">
                {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                <Save className="mr-2 h-5 w-5" />
                )}
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}