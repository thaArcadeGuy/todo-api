import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import "dotenv/config";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/users.route.js";

const PORT = process.env.PORT

const app = express();

app.use(cors())
app.use(express.json())

app.use("/", authRoute);
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});



mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to the database");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}` ));
  })
  .catch(err => console.log(err));
