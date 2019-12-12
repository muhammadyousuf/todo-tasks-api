const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    required: true,
    ref: "User",
    lowercase: true,
    trim: true,
    type: String
  },
  order: {
    default: 1,
    type: Number
  },
  completed: {
    type: Boolean,
    defaut: 1
  },
  dateTime: {
    type: Date
  }
});

module.exports = mongoose.model("Task", taskSchema);
