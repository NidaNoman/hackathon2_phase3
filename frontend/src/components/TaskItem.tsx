"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip"; // Import Tooltip components
import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { Task } from "~/packages/types";
import { Loader2, RotateCw, Check, Edit, Trash2 } from "lucide-react"; // Import necessary icons
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/Card"; // Import Card components
import { cn } from "@/lib/utils";
import { EditTaskForm } from "./EditTaskForm"; // Import EditTaskForm
import { DeleteTaskConfirm } from "./DeleteTaskConfirm"; // Import DeleteTaskConfirm
import { Button } from "./ui/Button"; // Import Button
import { toast } from "sonner"; // Import toast

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number, newStatus: "pending" | "completed") => void;
  onTaskDeleted: (taskId: number) => void;
}

export function TaskItem({ task, onStatusChange, onTaskDeleted }: TaskItemProps) {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const handleStatusToggle = async () => {
    setLoadingStatus(true);
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await api.put(`/api/v1/tasks/${task.id}/`, { status: newStatus }, true);
      toast.success(`Task marked as ${newStatus}!`);
      onStatusChange(task.id, newStatus);
    } catch (err: any) {
      console.error("Failed to update task status:", err);
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    onStatusChange(updatedTask.id, updatedTask.status); // Update status if changed
    // Optionally, if TaskItem directly displayed more data, you'd update it here
  };

  const handleEditClick = () => {
    if (editButtonRef.current) {
      editButtonRef.current.click();
    }
  };

  const handleDeleteClick = () => {
    if (deleteButtonRef.current) {
      deleteButtonRef.current.click();
    }
  };

  return (
    <Card className={cn(
      "flex flex-col rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
      task.status === "completed"
        ? "bg-slate-800/30 border-slate-700/40 hover:border-slate-600/50"
        : "bg-slate-800/50 border-slate-700/60 hover:border-indigo-500/30 hover:bg-slate-800/60"
    )}>
      <CardHeader className="p-5 pb-3">
        <CardTitle className={cn(
          "text-lg font-bold leading-tight",
          task.status === "completed" ? "line-through text-slate-500" : "text-white"
        )}>
          {task.title}
        </CardTitle>
        {task.description && (
          <CardDescription className={cn(
            "text-sm mt-2 line-clamp-2 leading-relaxed",
            task.status === "completed" ? "line-through text-slate-600" : "text-slate-400"
          )}>
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow px-5 pb-4">
        <span className={cn(
          "inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border",
          task.status === "completed"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
            : "bg-amber-500/15 text-amber-400 border-amber-500/25"
        )}>
          {task.status === "completed" ? "Done" : "Pending"}
        </span>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-5 pt-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/15 transition-all duration-200 rounded-xl h-10 w-10 border border-transparent hover:border-indigo-500/20"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white border border-slate-700 text-xs rounded-lg font-medium">
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition-all duration-200 rounded-xl h-10 w-10 border border-transparent hover:border-red-500/20"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white border border-slate-700 text-xs rounded-lg font-medium">
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Hidden buttons for dialog components */}
          <EditTaskForm task={task} onTaskUpdated={handleTaskUpdated} onTaskDeleted={onTaskDeleted}>
            <Button ref={editButtonRef} className="hidden" aria-hidden="true">
              Edit Task
            </Button>
          </EditTaskForm>
          <DeleteTaskConfirm
            taskId={task.id}
            taskTitle={task.title}
            onDeleteSuccess={onTaskDeleted}
          >
            <Button ref={deleteButtonRef} className="hidden" aria-hidden="true">
              Delete Task
            </Button>
          </DeleteTaskConfirm>
        </div>
        <Button
          onClick={handleStatusToggle}
          disabled={loadingStatus}
          variant="secondary"
          size="sm"
          className={cn(
            "flex items-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 h-10 px-5",
            task.status === "completed"
              ? "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 border border-slate-600/50"
              : "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35"
          )}
        >
          {loadingStatus ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : task.status === "completed" ? (
            <RotateCw className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>
            {loadingStatus
              ? "..."
              : task.status === "completed"
              ? "Undo"
              : "Complete"}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
