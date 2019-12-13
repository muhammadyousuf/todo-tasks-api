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
    default: false,
    required: true
  },
  dateTime: {
    type: Date,
    default: new Date()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Task", taskSchema);
