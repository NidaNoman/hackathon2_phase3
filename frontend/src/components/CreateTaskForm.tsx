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
        <div>
          {React.isValidElement(children) ? (
            // If children is a valid single React element, render it
            children
          ) : (
            // Otherwise, render the default button
            <Button variant="default" className="w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 text-white rounded-xl shadow-xl shadow-indigo-500/25 transition-all duration-300 h-12 text-base font-bold hover:shadow-2xl hover:shadow-indigo-500/35 hover:-translate-y-0.5">
              <Plus className="mr-2 h-5 w-5" />
              Add New Task
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 text-white rounded-2xl shadow-2xl shadow-black/30">
        <DialogHeader className="border-b border-slate-700/50 pb-5 mb-6">
          <DialogTitle className="text-2xl font-black text-white">Add New Task</DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-2">
            Fill in the details below to add a new task to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-3">
            <Label htmlFor="title" className="text-slate-200 text-sm font-semibold">Task Title</Label>
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
              className="bg-slate-800/50 border-slate-700/60 text-white rounded-xl h-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500 text-base"
            />
            {titleError && <p className="text-red-400 text-sm mt-1 font-medium">{titleError}</p>}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description" className="text-slate-200 text-sm font-semibold">Task Description (Optional)</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Add more details about your task..."
              className="bg-slate-800/50 border-slate-700/60 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500 text-base"
            />
          </div>
          <DialogFooter className="pt-6 border-t border-slate-700/50 mt-6">
            <Button type="submit" variant="default" disabled={loading || !!titleError} className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 text-white rounded-xl shadow-xl shadow-indigo-500/25 transition-all duration-300 h-12 px-8 text-base font-bold hover:shadow-2xl hover:shadow-indigo-500/35">
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              {loading ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
