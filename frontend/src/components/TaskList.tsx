import { PlusCircle, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/Alert";
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
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 rounded-lg shadow-md animate-pulse">
            <CardHeader className="p-6 pb-4">
              <div className="h-5 bg-gray-700 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded-md w-1/2"></div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-4 bg-gray-700 rounded-full w-1/4"></div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-transparent pt-4 px-6">
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-700 rounded-md"></div>
                <div className="h-8 w-8 bg-gray-700 rounded-md"></div>
              </div>
              <div className="h-9 w-28 bg-gray-700 rounded-md"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="p-8 space-y-4 bg-red-900/20 border-red-500 text-red-300 rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <AlertTitle className="font-semibold text-xl text-red-200">Error loading tasks!</AlertTitle>
        </div>
        <AlertDescription className="text-center text-red-300">{error}</AlertDescription>
        {onRetry && (
          <div className="flex justify-center mt-4">
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700 text-white rounded-md">
              Try Again
            </Button>
          </div>
        )}
      </Alert>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <Card className="text-center max-w-lg w-full p-8 shadow-xl bg-gray-800 border-gray-700 rounded-xl">
          <CardContent className="space-y-6">
            <div className="flex justify-center items-center text-blue-400">
                <PlusCircle size={64} />
            </div>
            <h3 className="text-3xl font-bold text-white leading-tight">No tasks yet? Let's get productive!</h3>
            <p className="text-lg text-gray-400">
              Your task list is sparkling clean. Add a new task to kickstart your day.
            </p>
            {onRetry && (
              <CreateTaskForm onTaskCreated={onRetry}>
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Task
                </Button>
              </CreateTaskForm>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
