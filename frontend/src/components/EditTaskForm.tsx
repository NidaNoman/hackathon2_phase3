"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task, UpdateTask } from "~/packages/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner"; // Import toast
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog"; // Assuming Dialog.tsx exports these
import { DeleteTaskConfirm } from "./DeleteTaskConfirm"; // Import DeleteTaskConfirm

interface EditTaskFormProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: number) => void; // Callback for when a task is deleted from edit form
  children: React.ReactNode; // To allow passing the trigger button as a child
}

export function EditTaskForm({ task, onTaskUpdated, onTaskDeleted, children }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // State to control dialog open/close

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setTitleError(null);
  }, [task, open]); // Reset form when task changes or dialog opens/closes

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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const updatedTask: UpdateTask = { title, description, status };
      const response = await api.put<Task>(`/api/v1/tasks/${task.id}/`, updatedTask, true);
      toast.success("Task updated successfully!");
      onTaskUpdated(response);
      setOpen(false); // Close dialog on success
    } catch (error: any) {
      console.error("Failed to update task:", error);
      toast.error(error.message || "Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = (deletedTaskId: number) => {
    onTaskDeleted(deletedTaskId);
    setOpen(false); // Close dialog after successful deletion
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          {React.isValidElement(children) ? children : <div />} {/* Render the trigger button passed as children, ensuring it's a valid element */}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
        <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold text-white">Edit Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-300">Task Title</Label>
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
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            />
            {titleError && <p className="text-red-400 text-sm mt-1">{titleError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-300">Task Description (Optional)</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-gray-300">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "completed")}
              disabled={loading}
              className="flex h-12 w-full rounded-md border bg-gray-700 border-gray-600 px-3 py-2 text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <DialogFooter className="flex justify-between items-center pt-4 border-t border-gray-700 mt-4">
            <DeleteTaskConfirm taskId={task.id} taskTitle={task.title} onDeleteSuccess={handleDeleteSuccess}>
              <Button variant="destructive" type="button" className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105">Delete Task</Button>
            </DeleteTaskConfirm>
            <Button type="submit" variant="default" disabled={loading || !!titleError} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105">
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-5 w-5" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
