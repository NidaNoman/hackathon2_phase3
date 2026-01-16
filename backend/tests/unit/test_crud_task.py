import pytest
from sqlmodel import create_engine, Session
from app.crud.task import create_task
from app.crud.user import create_user
from app.schemas.task import TaskCreate
from app.schemas.user import UserCreate
from app.db.models import SQLModel

# Use an in-memory SQLite database for testing
engine = create_engine("sqlite:///:memory:")

def setup_database():
    SQLModel.metadata.create_all(engine)

def teardown_database():
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="session")
def session_fixture():
    setup_database()
    with Session(engine) as session:
        yield session
    teardown_database()

def test_create_task(session: Session):
    # 1. Create a user first
    user_to_create = UserCreate(username="testuser", password="testpassword")
    user = create_user(session, user_to_create)

    # 2. Create a task for that user
    task_to_create = TaskCreate(title="Test Task", description="Test Description")
    task = create_task(session, task_to_create, user.id)

    # 3. Assert the task was created with the correct data
    assert task.title == task_to_create.title
    assert task.description == task_to_create.description
    assert task.owner_id == user.id
    assert task.status == "pending"
    assert task.id is not None
