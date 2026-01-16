"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip"; // Import Tooltip components
import { useState } from "react";
import { api } from "@/lib/api";
import { Loader2, RotateCw, Check, Edit, Trash2 } from "lucide-react"; // Import necessary icons
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/Card"; // Import Card components
import { cn } from "@/lib/utils";
import { StatusBadge } from "./ui/StatusBadge"; // Import StatusBadge
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

  return (
    <Card className={cn(
      "flex flex-col rounded-xl border-none shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1",
      task.status === "completed" ? "bg-gray-800/60" : "bg-gray-800",
      "hover:border-blue-500" // Add a subtle border on hover for all cards
    )}>
      <CardHeader className="p-5 pb-3">
        <CardTitle className={cn(
          "text-xl font-bold text-white",
          task.status === "completed" && "line-through text-gray-500"
        )}>
          {task.title}
        </CardTitle>
        {task.description && (
          <CardDescription className={cn(
            "text-gray-400 text-sm",
            task.status === "completed" && "line-through text-gray-600"
          )}>
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow px-5 pb-2">
        <StatusBadge variant={task.status === "completed" ? "completed" : "default"}>
          {task.status === "completed" ? "Completed" : "Pending"}
        </StatusBadge>
      </CardContent>
      <div className="border-b border-gray-700 mx-5 my-2" />
      <CardFooter className="flex justify-between items-center bg-transparent p-5 pt-3">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <EditTaskForm task={task} onTaskUpdated={handleTaskUpdated} onTaskDeleted={onTaskDeleted}>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 transition-colors duration-200 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditTaskForm>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-700 text-white border-none">
                <p>Edit Task</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <DeleteTaskConfirm
                  taskId={task.id}
                  taskTitle={task.title}
                  onDeleteSuccess={onTaskDeleted}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-400 hover:bg-gray-700/50 transition-colors duration-200 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DeleteTaskConfirm>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-700 text-white border-none">
                <p>Delete Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          onClick={handleStatusToggle}
          disabled={loadingStatus}
          variant="secondary"
          size="sm"
          className={cn(
            "flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200",
            task.status === "completed" 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
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
              ? "Updating..."
              : task.status === "completed"
              ? "Mark Pending"
              : "Mark Complete"}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
