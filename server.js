import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import "dotenv/config";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/users.route.js";
import todosRouter from "./routes/todos.route.js";

const PORT = process.env.PORT || 3000

const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/todos", todosRouter);
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!"});
})



mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to the database");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.log(err);
    process.exit(1)
  });