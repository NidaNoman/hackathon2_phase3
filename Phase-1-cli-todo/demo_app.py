"""Demo script to showcase the Todo Console App functionality."""

from src.models.task import Task
from src.repositories.in_memory_repository import InMemoryTaskRepository
from src.services.task_service import TaskService
from src.ui.formatters import format_task_table

def demo_app():
    """Demonstrate the app's core functionality."""
    print("=" * 60)
    print(" PHASE 1 TODO CONSOLE APP - DEMO")
    print("=" * 60)

    # Initialize
    repo = InMemoryTaskRepository()
    service = TaskService(repo)

    # Demo 1: Create tasks
    print("\n[1] CREATING TASKS...")
    print("-" * 60)

    task1 = service.create_task(
        "Buy groceries",
        "Get milk, eggs, bread, and fresh vegetables from the store"
    )
    print(f"[OK] Created: {task1}")

    task2 = service.create_task(
        "Finish homework",
        "Complete math problems 1-20 and review chapter 5"
    )
    print(f"[OK] Created: {task2}")

    task3 = service.create_task(
        "Call dentist",
        "Schedule appointment for teeth cleaning"
    )
    print(f"[OK] Created: {task3}")

    task4 = service.create_task(
        "Plan weekend trip",
        "Research destinations and book hotel for Saturday-Sunday"
    )
    print(f"[OK] Created: {task4}")

    task5 = service.create_task(
        "Read book chapter",
        "Finish reading Chapter 7 of Python programming book"
    )
    print(f"[OK] Created: {task5}")

    # Demo 2: View all tasks
    print("\n[2] VIEWING ALL TASKS...")
    print("-" * 60)
    tasks = service.get_all_tasks()
    print(format_task_table(tasks))

    # Demo 3: Mark some tasks as complete
    print("\n[3] MARKING TASKS AS COMPLETE...")
    print("-" * 60)

    # Complete task 1
    task = service.toggle_task_status(1)
    print(f"[OK] Task #1 marked complete: {task.title}")

    # Complete task 3
    task = service.toggle_task_status(3)
    print(f"[OK] Task #3 marked complete: {task.title}")

    # Complete task 5
    task = service.toggle_task_status(5)
    print(f"[OK] Task #5 marked complete: {task.title}")

    # Demo 4: View tasks after completion
    print("\n[4] VIEWING TASKS AFTER MARKING COMPLETE...")
    print("-" * 60)
    tasks = service.get_all_tasks()
    print(format_task_table(tasks))

    # Demo 5: Update a task
    print("\n[5] UPDATING A TASK...")
    print("-" * 60)
    print("Before update:")
    task = service.get_task(2)
    print(f"  Task #{task.id}: {task.title}")
    print(f"  Description: {task.description}")

    task = service.update_task(
        2,
        "Complete math and science homework",
        "Finish math problems 1-30, science lab report, and review both chapters"
    )
    print("\nAfter update:")
    print(f"  Task #{task.id}: {task.title}")
    print(f"  Description: {task.description}")
    print("[OK] Task updated successfully!")

    # Demo 6: Delete a task
    print("\n[6] DELETING A TASK...")
    print("-" * 60)
    print("Before deletion:")
    tasks = service.get_all_tasks()
    print(f"  Total tasks: {len(tasks)}")

    deleted = service.delete_task(4)
    print(f"[OK] Task #4 deleted: {deleted}")

    print("\nAfter deletion:")
    tasks = service.get_all_tasks()
    print(f"  Total tasks: {len(tasks)}")

    # Demo 7: View final state
    print("\n[7] FINAL TASK LIST...")
    print("-" * 60)
    tasks = service.get_all_tasks()
    print(format_task_table(tasks))

    # Summary
    print("\n" + "=" * 60)
    print(" DEMO COMPLETE!")
    print("=" * 60)
    print(f"\nTotal tasks remaining: {len(tasks)}")
    completed = sum(1 for t in tasks if t.completed)
    pending = len(tasks) - completed
    print(f"Completed: {completed}")
    print(f"Pending: {pending}")
    print("\nNote: All data is in-memory only. Restarting the app will")
    print("      reset to an empty task list.")
    print("\nTo run the interactive app, use: python src/main.py")
    print("=" * 60)

if __name__ == "__main__":
    demo_app()
