const Task = require("../model/task");
const mongoose = require("mongoose");
const User = require("../model/user");

exports.get_all_task = (req, res, next) => {
  Task.find({ user: req.params.user })
    .select("title order completed dateTime _id")
    .exec()
    .then(docs => {
      if (docs.length >= 0) {
        const response = {
          count: docs.length,
          task: docs.map(doc => {
            return {
              title: doc.title,
              order: doc.order,
              completed: doc.completed,
              sys: {
                id: doc._id,
                createdTime: doc.dateTime
              }
            };
          })
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "no entries found"
        });
      }
    })
    .catch(err => {
      console.log("error ", err);
      res.status(500).json({
        error: err
      });
    });
};

exports.create_task = (req, res, next) => {
  User.findById(req.params.user)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "Not found User"
        });
      }
      const task = new Task({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        order: req.body.order,
        completed: req.body.completed,
        dateTime: req.body.dateTime,
        user: req.params.user
      });
      return task.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Add Order Suucessfully",
        createdTask: {
          title: result.title,
          order: result.order,
          completed: result.completed
        },
        sys: {
          id: result._id,
          createdTime: result.dateTime
        }
      });
    })
    .catch(err => {
      console.log("error", err);
      res.status(500).json({
        error: err
      });
    });
};

exports.get_single_task = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params.user).then(user => {
    if (!user) {
      return res.status(404).json({
        message: "Not found User"
      });
    }
  });
  Task.findById(req.params.taskId)
    .select("title order completed dateTime _id")
    .exec()
    .then(task => {
      if (!task) {
        return res.status(404).json({
          message: "Task not found"
        });
      }
      res.status(200).json({
        task: {
          title: task.title,
          order: task.order,
          completed: task.completed
        },
        sys: {
          id: task._id,
          createdTime: task.dateTime
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delete_task = (req, res, next) => {
  User.findById(req.params.user).then(user => {
    if (!user) {
      return res.status(404).json({
        message: "Not found User"
      });
    }
  });
  Task.deleteOne({ _id: req.params.taskId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Task Deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
