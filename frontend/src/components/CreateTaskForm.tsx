"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { CreateTask } from "~/packages/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Import toast

// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog"; // Assuming Dialog.tsx exports these

interface CreateTaskFormProps {
  onTaskCreated: () => void;
  children?: React.ReactNode; // Allow children for custom trigger
}

export function CreateTaskForm({ onTaskCreated, children }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // State to control dialog open/close

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
      const newTask: CreateTask = { title, description };
      await api.post("/api/v1/tasks/", newTask, true);
      toast.success("Task created successfully!");
      setTitle("");
      setDescription("");
      onTaskCreated();
      setOpen(false); // Close dialog on success
    } catch (error: any) {
      console.error("Failed to create task:", error);
      toast.error(error.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || ( // Render children if provided, otherwise render the default button
            <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105"> {/* Trigger button */}
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl"> {/* Dialog content wrapper */}
        <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold text-white">Add New Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details below to add a new task to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2"> {/* Form content */}
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
              placeholder="e.g., Redesign the landing page"
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
              placeholder="Add more details about your task..."
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <DialogFooter className="pt-4 border-t border-gray-700 mt-4"> {/* Dialog footer for buttons */}
            <Button type="submit" variant="primary" disabled={loading || !!titleError} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105">
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              {loading ? "Adding Task..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
