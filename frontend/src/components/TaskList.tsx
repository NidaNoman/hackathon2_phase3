import { Task } from "~/packages/types";
import { PlusCircle, AlertCircle, Plus } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/Button";
import { CreateTaskForm } from "./CreateTaskForm"; // Import CreateTaskForm
import { TaskItem } from "./TaskItem"; // Import TaskItem

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: "pending" | "completed") => void;
  onTaskDeleted: (taskId: number) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function TaskList({ tasks, onStatusChange, onTaskDeleted, isLoading, error, onRetry }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10 rounded-2xl animate-pulse">
            <CardHeader className="p-5 pb-3">
              <div className="h-4 bg-white/10 rounded-lg w-3/4 mb-3"></div>
              <div className="h-3 bg-white/5 rounded-lg w-1/2"></div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="h-6 bg-white/10 rounded-lg w-20"></div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-5 pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-white/10 rounded-xl"></div>
                <div className="h-9 w-9 bg-white/10 rounded-xl"></div>
              </div>
              <div className="h-9 w-28 bg-white/10 rounded-xl"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center backdrop-blur-sm">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-300 text-sm mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <PlusCircle size={32} className="text-indigo-400" />
          </div>
          <p className="text-gray-400 mb-5">No tasks yet</p>
          {onRetry && (
            <CreateTaskForm onTaskCreated={onRetry}>
              <Button size="default" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 px-6">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </CreateTaskForm>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
}
