"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { TaskList } from "@/components/TaskList";
import { api } from "@/lib/api";
import { Task } from "~/packages/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"; // Import Card components
import { Button } from "@/components/ui/Button";
import { MessageCircle, ListTodo, CheckCircle, Clock } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
    <div className="relative min-h-screen">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Task Dashboard</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage and track your tasks efficiently</p>
            </div>
          </div>

          {/* Stats Row - MORE PROMINENT */}
          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
            <div className="glass-card p-5 sm:p-6 rounded-2xl group hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-600/60">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-indigo-600/20 transition-colors border border-indigo-500/20">
                  <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">Total</p>
                  <p className="text-2xl sm:text-3xl font-black text-white">{tasks.length}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5 sm:p-6 rounded-2xl group hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-600/60">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-emerald-600/20 transition-colors border border-emerald-500/20">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">Done</p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400">{completedTasks.length}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5 sm:p-6 rounded-2xl group hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-600/60">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-amber-600/20 transition-colors border border-amber-500/20">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">Pending</p>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">{pendingTasks.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-5">
            <div className="glass-card rounded-2xl overflow-hidden hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-600/60">
              <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-indigo-500/10 to-violet-500/10">
                <h3 className="text-lg font-bold text-white">Create New Task</h3>
                <p className="text-xs text-slate-400 mt-1">Add a task to your list</p>
              </div>
              <div className="p-5">
                <CreateTaskForm onTaskCreated={handleTaskCreated} />
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border-l-4 border-l-indigo-500 hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-600/60">
              <p className="text-xs text-indigo-400 uppercase tracking-wider font-bold mb-2">Pro Tip</p>
              <p className="text-slate-300 text-sm leading-relaxed">If a task takes less than two minutes, do it now instead of adding it to your list.</p>
            </div>
          </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/20">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Pending Tasks</h2>
            </div>
            <span className="text-sm font-bold text-amber-400 bg-amber-500/15 px-4 py-2 rounded-xl border border-amber-500/25">
              {pendingTasks.length} {pendingTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {pendingTasks.length === 0 && !loading ? (
            <div className="glass-card p-12 rounded-2xl text-center border-dashed border-2 border-slate-600/50">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-300 font-semibold text-lg">No pending tasks</p>
              <p className="text-slate-500 text-sm mt-2">Create your first task to get started</p>
            </div>
          ) : (
            <TaskList
              tasks={pendingTasks}
              onStatusChange={handleTaskStatusChange}
              onTaskDeleted={handleTaskDeleted}
              isLoading={loading}
              error={error}
              onRetry={fetchTasks}
            />
          )}

          {completedTasks.length > 0 && (
            <>
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-400">Completed</h2>
                </div>
                <span className="text-sm font-medium text-slate-500 bg-slate-700/50 px-4 py-2 rounded-xl border border-slate-600/50">
                  {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
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
      </div>

      {/* Chatbot Icon Button - MORE PROMINENT */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 shadow-2xl shadow-indigo-500/30 flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      </div>

      {/* Chatbot Component */}
      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}