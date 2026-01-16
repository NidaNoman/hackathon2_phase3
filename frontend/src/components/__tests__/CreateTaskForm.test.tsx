import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskForm } from '../CreateTaskForm';
import { api } from '@/lib/api';
import { act } from 'react';

// Mock the API module
jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('CreateTaskForm', () => {
  const mockOnTaskCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Use `act` when rendering and making initial state updates
    act(() => {
      render(<CreateTaskForm onTaskCreated={mockOnTaskCreated} />);
    });
  });

  const openFormDialog = async () => {
    const triggerButton = screen.getByRole('button', { name: /add new task/i });
    await act(async () => { // Wrap user interaction in act
      await userEvent.click(triggerButton);
    });
    // Wait for the dialog to be visible
    await screen.findByRole('dialog', { name: /add new task/i }); 
  };

  it('renders the form elements correctly', async () => {
    await openFormDialog();

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('shows validation error if title is empty on submit', async () => {
    await openFormDialog();
    const submitButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => { // Wrap user interaction in act
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.findByText(/title is required/i)).toBeInTheDocument();
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows validation error if title is too long on input change', async () => {
    await openFormDialog();
    const titleInput = screen.getByLabelText(/task title/i);

    const longTitle = 'a'.repeat(256);
    await act(async () => { // Wrap user interaction in act
      await userEvent.type(titleInput, longTitle);
    });

    await waitFor(() => {
      expect(screen.findByText(/title cannot exceed 255 characters/i)).toBeInTheDocument();
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it('submits the form successfully with valid data', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({}); // Mock successful API call

    await openFormDialog();
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionTextarea = screen.getByLabelText(/task description/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => { // Wrap user interaction in act
      await userEvent.type(titleInput, 'New Task Title');
      await userEvent.type(descriptionTextarea, 'Task Description');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/v1/tasks/', { title: 'New Task Title', description: 'Task Description' }, true);
    });
    expect(mockOnTaskCreated).toHaveBeenCalledTimes(1);
    await waitFor(() => { // Wait for the success message to appear
        expect(screen.getByText(/task created successfully/i)).toBeInTheDocument();
    });
    expect(titleInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
  });

  it('shows error message if API call fails', async () => {
    const errorMessage = 'Failed to create task.'; // Match the exact error message from component
    (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage)); // Mock failed API call

    await openFormDialog();
    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => { // Wrap user interaction in act
      await userEvent.type(titleInput, 'Failing Task');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => { // Wait for the error message to appear
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('disables submit button while loading', async () => {
    (api.post as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve to simulate loading

    await openFormDialog();
    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => { // Wrap user interaction in act
      await userEvent.type(titleInput, 'Loading Task');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByRole('button', { name: /adding task.../i })).toBeInTheDocument();
    });
  });
});
