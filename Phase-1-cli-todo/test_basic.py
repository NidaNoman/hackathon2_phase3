"""Basic functionality test."""

from src.models.task import Task
from src.repositories.in_memory_repository import InMemoryTaskRepository
from src.services.task_service import TaskService

def test_basic_functionality():
    """Test basic CRUD operations."""
    # Initialize
    repo = InMemoryTaskRepository()
    service = TaskService(repo)

    print("Testing Phase 1 Todo Console App...")
    print("=" * 50)

    # Test 1: Create task
    print("\n[PASS] Test 1: Create task")
    task1 = service.create_task("Buy groceries", "Get milk and eggs")
    assert task1.id == 1
    assert task1.title == "Buy groceries"
    print(f"  Created: {task1}")

    # Test 2: Create another task
    print("\n[PASS] Test 2: Create second task")
    task2 = service.create_task("Finish homework", "Math problems 1-20")
    assert task2.id == 2
    print(f"  Created: {task2}")

    # Test 3: View all tasks
    print("\n[PASS] Test 3: View all tasks")
    tasks = service.get_all_tasks()
    assert len(tasks) == 2
    print(f"  Total tasks: {len(tasks)}")
    for task in tasks:
        print(f"    {task}")

    # Test 4: Toggle status
    print("\n[PASS] Test 4: Toggle status")
    task1 = service.toggle_task_status(1)
    assert task1.completed == True
    print(f"  Task 1 status: {task1.completed}")

    # Test 5: Update task
    print("\n[PASS] Test 5: Update task")
    task2 = service.update_task(2, "Complete math homework", "Problems 1-30 and review")
    assert task2.title == "Complete math homework"
    print(f"  Updated task 2: {task2.title}")

    # Test 6: Delete task
    print("\n[PASS] Test 6: Delete task")
    deleted = service.delete_task(1)
    assert deleted == True
    tasks = service.get_all_tasks()
    assert len(tasks) == 1
    print(f"  Remaining tasks: {len(tasks)}")

    # Test 7: Validation
    print("\n[PASS] Test 7: Validation (empty title)")
    try:
        service.create_task("", "Test")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  Caught expected error: {e}")

    # Test 8: Not found
    print("\n[PASS] Test 8: Task not found")
    try:
        service.get_task(999)
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  Caught expected error: {e}")

    print("\n" + "=" * 50)
    print("[SUCCESS] All tests passed!")
    print("=" * 50)

if __name__ == "__main__":
    test_basic_functionality()
