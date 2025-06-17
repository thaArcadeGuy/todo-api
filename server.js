import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import "dotenv/config";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/users.route.js";
import todosRouter from "./routes/todos.route.js";

const PORT = process.env.PORT

const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/todos", todosRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});



mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to the database", process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.log(err));
