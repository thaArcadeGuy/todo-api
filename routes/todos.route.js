import express from "express";
import auth from "../middleware/auth.middleware.js";
import {getTodos, createTodo, updateToDo, deleteTodo, clearCompleted, reorderTodos} from "../controllers/todo.controller.js";

const todosRouter = express.Router();

todosRouter.use(auth);

todosRouter.get("/", getTodos);
todosRouter.post("/", createTodo);
todosRouter.patch("/:id", updateToDo);
todosRouter.delete("/:id", deleteTodo);
todosRouter.delete("/", clearCompleted);
todosRouter.patch("/reorder", reorderTodos);

export default todosRouter;