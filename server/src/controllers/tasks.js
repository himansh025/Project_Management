import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {

  try {
    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    const taskData = {
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      createdBy: req.user.id
    };

    if (status) taskData.status = status;
    if (priority) taskData.priority = priority;

    // Create and save task
    const task = new Task(taskData);
    await task.save();

    // Add task to project's tasks array
    project.tasks.push(task._id);
    await project.save();

    // Populate user data
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title description');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    // your error handling stays the same
  }
}

export const getTasks = async (req, res) => {
  try {
    // const { projectId, filter, status, priority, sortField, sortDirection, page = 1, limit = 10 } = req.query;

    // Build query object
    // const query = {};

    // Filter by project
    // if (projectId) {
    //   if (!mongoose.Types.ObjectId.isValid(projectId)) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Invalid project ID format'
    //     });
    //   }
    //   query.projectId = projectId;
    // }

    // Filter by status
    // if (status) {
    //   const validStatuses = ['todo', 'in_progress', 'review', 'completed'];
    //   if (validStatuses.includes(status)) {
    //     query.status = status;
    //   }
    // }

    // Filter by priority
    // if (priority) {
    //   const validPriorities = ['low', 'medium', 'high', 'urgent'];
    //   if (validPriorities.includes(priority)) {
    //     query.priority = priority;
    //   }
    // }

    // Filter by assigned user
    // if (filter === 'mine') {
    //   query.assignedTo = req.user.id;
    // }

    // Build sort object
    // const sort = {};
    // if (sortField && ['priority', 'status', 'createdAt', 'dueDate'].includes(sortField)) {
    //   sort[sortField] = sortDirection === 'asc' ? 1 : -1;
    // } else {
    //   // Default sort
    //   sort.createdAt = -1;
    // }

    // Handle custom priority sorting
    // if (sortField === 'priority') {
    //   // Fetch tasks
    //   const tasks = await Task.find(query)
    //     .populate('assignedTo', 'name email')
    //     .populate('createdBy', 'name email')
    //     .populate('projectId', 'title')
    //     .lean();

    //   // Custom priority order
    //   const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };

    //   // Sort by priority
    //   tasks.sort((a, b) => {
    //     const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    //     return sortDirection === 'asc' ? -priorityDiff : priorityDiff;
    //   });

    // Apply pagination
    // const startIndex = (Number(page) - 1) * Number(limit);
    // const endIndex = startIndex + Number(limit);
    // const paginatedTasks = tasks.slice(startIndex, endIndex);



    // return res.status(200).json({
    //   success: true,
    //   count: tasks.length,
    //   data: paginatedTasks,
    //   pagination: {
    //     currentPage: Number(page),
    //     totalPages: Math.ceil(tasks.length / Number(limit)),
    //     totalItems: tasks.length
    //   }
    // });

    // // Regular pagination
    // const skip = (Number(page) - 1) * Number(limit);

    // // Get total count for pagination
    // const totalTasks = await Task.countDocuments(query);

    // // Fetch tasks with regular sorting
    // const tasks = await Task.find(query)
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(Number(limit))
    //   .populate('assignedTo', 'name email')
    //   .populate('createdBy', 'name email')
    //   .populate('projectId', 'title');

    // res.status(200).json({
    //   success: true,
    //   count: tasks.length,
    //   data: tasks,
    //   pagination: {
    //     currentPage: Number(page),
    //     totalPages: Math.ceil(totalTasks / Number(limit)),
    //     totalItems: totalTasks
    //   }
    // });

    const tasks = await Task.find();
    console.log("tasks", tasks)
    if (!tasks) {
      return res.status(500), json({ message: "not found" })
    }
    res
      .status(200)
      .json(
        {
          data: tasks,
          message: "all tasks found"
        }
      )

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}

export const getTaskofUser = async (req, res) => {
  try {
    const user = req.user.id

    if (!user) {
      return res.status(500).json({ message: " userid not not found" })
    }
    console.log("check the user",user)
    const tasks = await Task.find({ assignedTo: user }); 
    console.log("tasks of user found", tasks)

    if (!tasks) {
      return res.status(500).json({ message: " tasks of user not found" })
    }
    res
      .status(200)
      .json(
        {
          data: tasks,
          message: "user all tasks tasks"
        }
      )
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    // Build update object
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (status) {
      const validStatuses = ['todo', 'in_progress', 'review', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status value. Allowed values are: ${validStatuses.join(', ')}`
        });
      }
      updateData.status = status;
    }
    if (priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority value. Allowed values are: ${validPriorities.join(', ')}`
        });
      }
      updateData.priority = priority;
    }
    if (dueDate) updateData.dueDate = dueDate;

    // Find and update task
    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Remove task from project's tasks array
    await Project.findByIdAndUpdate(task.projectId, {
      $pull: { tasks: task._id }
    });

    // Delete the task
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
