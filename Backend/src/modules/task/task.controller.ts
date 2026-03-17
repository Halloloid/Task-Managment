import { Request, Response } from 'express';
import { prisma } from '../../config/db.js';
import { TaskStatus } from '@prisma/client';



// Get all tasks (with pagination, filter, search)
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as TaskStatus | undefined;
    const search = req.query.search as string | undefined;

    // Validate pagination
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 4;
    const skip = (safePage - 1) * safeLimit;

    // Build where clause
    const where: any = {
      userId,
    };

    // Add status filter
    if (status && Object.values(TaskStatus).includes(status)) {
      where.status = status;
    }

    // Add search filter
    if (search && search.trim()) {
      where.title = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    // Get total count
    const totalTasks = await prisma.task.count({ where });

    // Get tasks
    const tasks = await prisma.task.findMany({
      where,
      take: safeLimit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalTasks / safeLimit);

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: safePage,
        totalPages,
        totalTasks,
        tasksPerPage: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single task
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Authorization check
    if (task.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to access this task' });
      return;
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create task
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, description, status } = req.body;

    // Validation
    if (!title || !description) {
      res.status(400).json({
        error: 'Validation error',
        details: ['Title and description are required'],
      });
      return;
    }

    // Validate title length
    if (title.trim().length < 3) {
      res.status(400).json({
        error: 'Validation error',
        details: ['Title must be at least 3 characters'],
      });
      return;
    }

    if (description.trim().length < 10 || description.trim().length > 2000) {
      res.status(400).json({
        error: 'Validation error',
        details: ['Description must be between 10 and 2000 characters'],
      });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        error: 'Validation error',
        details: ['Invalid status. Must be: PENDING, IN_PROGRESS, or COMPLETED'],
      });
      return;
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        status: status || TaskStatus.PENDING,
        userId,
      },
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { title, description, status } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Authorization check
    if (existingTask.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to update this task' });
      return;
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) {
      if (title.trim().length < 3) {
        res.status(400).json({
          error: 'Validation error',
          details: ['Title must be at least 3 characters'],
        });
        return;
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (status !== undefined) {
      if (!Object.values(TaskStatus).includes(status)) {
        res.status(400).json({
          error: 'Validation error',
          details: [
            'Invalid status. Must be: PENDING, IN_PROGRESS, or COMPLETED',
          ],
        });
        return;
      }
      updateData.status = status;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        error: 'Validation error',
        details: ['No valid fields provided for update'],
      });
      return;
    }

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Authorization check
    if (existingTask.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this task' });
      return;
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};