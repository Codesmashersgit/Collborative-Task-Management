// tests/services/task.service.test.ts
import { TaskService } from '../../src/services/task.service';
import { TaskRepository } from '../../src/repositories/task.repository';
import { NotificationService } from '../../src/services/notification.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockNotificationService = {
      create: jest.fn(),
    } as any;

    taskService = new TaskService(mockTaskRepository, mockNotificationService);
  });

  describe('createTask', () => {
    it('should create a task and send notification to assignee', async () => {
      const userId = 'user-1';
      const input = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-31T00:00:00Z',
        priority: 'High' as const,
        assignedToId: 'user-2',
      };

      const mockTask = {
        id: 'task-1',
        ...input,
        dueDate: new Date(input.dueDate),
        creatorId: userId,
        status: 'ToDo',
      };

      mockTaskRepository.create.mockResolvedValue(mockTask as any);

      const result = await taskService.createTask(userId, input);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...input,
        dueDate: new Date(input.dueDate),
        creatorId: userId,
      });

      expect(mockNotificationService.create).toHaveBeenCalledWith({
        userId: 'user-2',
        message: 'New task assigned: Test Task',
        type: 'TASK_ASSIGNED',
      });

      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should throw error if user is not authorized', async () => {
      const taskId = 'task-1';
      const userId = 'user-3';
      const input = { title: 'Updated Title' };

      const mockTask = {
        id: taskId,
        creatorId: 'user-1',
        assignedToId: 'user-2',
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);

      await expect(taskService.updateTask(taskId, userId, input)).rejects.toThrow(
        'Unauthorized to update this task'
      );
    });
  });

  describe('deleteTask', () => {
    it('should only allow creator to delete task', async () => {
      const taskId = 'task-1';
      const userId = 'user-2';

      const mockTask = {
        id: taskId,
        creatorId: 'user-1',
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);

      await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow(
        'Only the creator can delete this task'
      );
    });
  });
});