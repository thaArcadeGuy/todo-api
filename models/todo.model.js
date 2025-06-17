import mongoose from "mongoose";

const TaskState = {
  ACTIVE: "active",
  COMPLETED: "completed",
  DELETED: "deleted"
}

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: Object.values(TaskState),
    default: TaskState.ACTIVE
  },
  order: {
    type: Number,
    default: 0
  },
  deletedAt: {
    type: Date,
    default: null
  }
},
{
  timestamps: true
});

TodoSchema.pre("find", function() {
  this.where({ state: { $ne: TaskState.DELETED } });
});

TodoSchema.pre('findOne', function() {
  this.where({ state: { $ne: TaskState.DELETED } });
});

const Todo = mongoose.model("Todo", TodoSchema);

export { Todo, TaskState };