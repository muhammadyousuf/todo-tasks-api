const Task = require("../model/task");
const mongoose = require("mongoose");
const User = require("../model/user");

exports.get_all_task = (req, res, next) => {
  Task.find()
    .select("title order completed dateTime  _id")
    .populate("user", "name email")
    .exec()
    .then(docs => {
      console.log("Get all Documents ", docs);

      if (docs.length >= 0) {
        const response = {
          count: docs.length,
          task: docs.map(doc => {
            return {
              title: doc.title,
              order: doc.order,
              completed: doc.completed,
              dateTime: doc.dateTime,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:5000/task/" + doc._id
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
  console.log("userId", req.body.userId);
  User.findById(req.body.userId)
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
        dateTime: req.body.dateTime
      });
      console.log("order", task);
      return task.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Add Order Suucessfully",
        createdTask: {
          _id: result._id,
          title: result.title,
          order: result.order,
          completed: result.completed,
          dateTime: result.dateTime
        },
        request: {
          type: "GET",
          url: "http://localhost:5000/task/" + result._id
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

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("quantity product _id")
    .populate("product", "name price")
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:5000/order"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delete_order = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order Deleted",
        request: {
          type: "POST",
          url: "http://localhost:5000/order",
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
