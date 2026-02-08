"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { api } from "@/lib/api";
import { toast } from "sonner"; // Import toast
import { Loader2, Trash2 } from "lucide-react"; // Import necessary icons for loading and delete
import { Button } from "./ui/Button"; // Import Button

interface DeleteTaskConfirmProps {
  taskId: number;
  taskTitle: string;
  onDeleteSuccess: (taskId: number) => void;
  children: React.ReactNode;
}

export function DeleteTaskConfirm({
  taskId,
  taskTitle,
  onDeleteSuccess,
  children,
}: DeleteTaskConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Assuming 'api' is correctly imported and configured
      await api.delete(`/api/v1/tasks/${taskId}/`, true);
      toast.success("Task deleted successfully!");
      onDeleteSuccess(taskId);
      setIsOpen(false);
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      toast.error(err.message || "Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div>
          {React.isValidElement(children) ? children : <div />}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white rounded-lg shadow-xl">
        <AlertDialogHeader className="border-b border-gray-700 pb-4 mb-4">
          <AlertDialogTitle className="text-2xl font-bold text-white">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete the task:
            <br />
            <strong className="text-blue-400 font-semibold">{taskTitle}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border-none rounded-lg transition-colors duration-200">Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="min-w-[120px] bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105"
          >
            {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <Trash2 className="mr-2 h-5 w-5" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
