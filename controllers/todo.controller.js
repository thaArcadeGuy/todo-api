import { Todo, TaskState } from "../models/todo.model.js";

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({user: req.user.id}).sort({order: 1}).lean();
    res.json(todos);
  } catch (error) {
    res.status(500).json({error: "Server Error"});
  }
};

const createTodo = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({error: "Text is required"});
    }

    const lastTodo = await Todo.findOne({user: req.user.id}).sort({ order: -1 }).select("order");

    const order = lastTodo ? lastTodo.order + 1 : 1;

    const todo = await Todo.create({ user:req.user.id, text: text.trim(), order });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({error:"Failed to create todo"});
  }
};

const updateToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({error:"Invalid todo ID"});
    }

    if (Object.keys(updates).length === 0) {
      return res.status.json({error: "No update data provided"})
    }

    delete updates.user;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt

    const todo = await Todo.findOneAndUpdate(
      {_id: id, user:req.user.id},
      updates,
      { new: true, runValidators: true, context: "query" }
    );

    if (!todo) {
      return res.status(404).json({error:"Task not found"});
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.message 
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({ 
        error: "Invalid data format", 
        details: error.message 
      });
    }
    res.status(500).json({error: "Failed to update todo"});
  }
};

const deleteTodo = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({error: "invalid todo ID"});
    }

    const todo = await Todo.findOneAndDelete(
      {_id: id, user:req.user.id},
      {
        state: TaskState.DELETED,
        deletedAt: new Date()
      },
      {new: true}
    );

    if (!todo) {
      return res.status(404).json({error: "Task not found"});
    }

    res.json({message: "Task Deleted", deletedTodo: todo});
  } catch (error) {
    res.status(500).json({error: "Failed to delete task"});
  }
};

const clearCompleted = async (req, res) => {
  try {
    const result = await Todo.deleteMany({user: req.user.id, state: TaskState.COMPLETED});

    if (result.deletedCount === 0) {
      return res.status(404).json({message: "No completed tasks found"});
    }
    res.json({message: `Completed tasks cleared. ${result.deletedCount} tasks deleted`})
  } catch (error) {
    res.status(500).json({error: "Failed to clear completed tasks"});
  }
};

const reorderTodos = async (req, res) => {
  try {
    const {order} = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({error: "Order array is required"});
    }

    for (let item of order) {
      if (!item.id || typeof item.order !== "number") {
        return res.status(400).json({
          error: 'Each item must have id and order properties'
        });
      }
    }

    const operations = order.map(item => ({
      updateOne: {
        filter: {_id: item.id, user: req.user.id},
        update: {order: item.order}
      }
    }));

    const result = await Todo.bulkWrite(operations);

    res.json({message: "Tasks reordered"});
  } catch (error) {
    res.status(500).json({error: 'Failed to reorder tasks'});
  }
};

export {
  getTodos,
  createTodo,
  updateToDo,
  deleteTodo,
  clearCompleted,
  reorderTodos
}