const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please add a task title',
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      category,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
      error: error.message,
    });
  }
};

// @desc    Get all tasks with search, filter, sort, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user._id };

    // Search filter (matches title or description case-insensitively)
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by Status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by Category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by Priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Determine custom sorting logic
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let aggregationPipeline = [{ $match: query }];

    // If sorting by priority, project priority level weight: High=3, Medium=2, Low=1
    if (sortBy === 'priority') {
      aggregationPipeline.push({
        $addFields: {
          priorityWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'High'] }, then: 3 },
                { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'Low'] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      });
      aggregationPipeline.push({ $sort: { priorityWeight: sortOrder, createdAt: -1 } });
    } else if (sortBy === 'dueDate') {
      // Handle sorting by due date, pushing null due dates to the end
      aggregationPipeline.push({
        $addFields: {
          hasDueDate: { $cond: [{ $eq: ['$dueDate', null] }, 0, 1] },
        },
      });
      aggregationPipeline.push({
        $sort: { hasDueDate: -1, dueDate: sortOrder, createdAt: -1 },
      });
    } else {
      // Default sorting (usually createdAt)
      aggregationPipeline.push({ $sort: { [sortBy]: sortOrder } });
    }

    // Count matching documents before paginating
    const total = await Task.countDocuments(query);

    // Apply pagination
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });

    const tasks = await Task.aggregate(aggregationPipeline);

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
      },
      data: tasks,
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving tasks',
      error: error.message,
    });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized access',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get Task By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving task details',
      error: error.message,
    });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized access',
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized access',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task successfully deleted',
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics for charts and counters
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run parallel count aggregations
    const stats = await Task.aggregate([
      { $match: { createdBy: userId } },
      {
        $facet: {
          totalTasks: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    // Format output data cleanly
    const formattedStats = {
      total: stats[0].totalTasks[0]?.count || 0,
      status: {
        Pending: 0,
        InProgress: 0, // In Progress inside the DB is 'In Progress'
        Completed: 0
      },
      priority: {
        Low: 0,
        Medium: 0,
        High: 0
      },
      category: {
        Personal: 0,
        Work: 0,
        Study: 0
      }
    };

    // Parse status counts
    stats[0].byStatus.forEach((item) => {
      if (item._id === 'Pending') formattedStats.status.Pending = item.count;
      if (item._id === 'In Progress') formattedStats.status.InProgress = item.count;
      if (item._id === 'Completed') formattedStats.status.Completed = item.count;
    });

    // Parse priority counts
    stats[0].byPriority.forEach((item) => {
      if (item._id === 'Low') formattedStats.priority.Low = item.count;
      if (item._id === 'Medium') formattedStats.priority.Medium = item.count;
      if (item._id === 'High') formattedStats.priority.High = item.count;
    });

    // Parse category counts
    stats[0].byCategory.forEach((item) => {
      if (item._id === 'Personal') formattedStats.category.Personal = item.count;
      if (item._id === 'Work') formattedStats.category.Work = item.count;
      if (item._id === 'Study') formattedStats.category.Study = item.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Get Task Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating task statistics',
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};
