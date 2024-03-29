const mongoose = require("mongoose");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../nodemon.env" });

exports.create_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "email is already exsists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              contact: req.body.contact,
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "user created"
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.login_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(401).json({ message: "Auth Failed" });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            res.status(401).json({ message: "Auth Failed" });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1d"
              }
            );
            res.status(200).json({ message: "Auth Successful", token });
          } else {
            res.status(401).json({ message: "Auth Failed" });
          }
        });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
};

exports.get_user = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params.user)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "Not found User"
        });
      }
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          contact: user.contact,
          email: user.email,
          userImage: user.userImage
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.update_user = async (req, res, next) => {
  const _id = req.params.user;

  const updates = Object.keys(JSON.parse(JSON.stringify(req.body)));

  const allowUpdates = ["name", "contact", "userImage"];
  const isValidOperator = updates.every(update =>
    allowUpdates.includes(update)
  );

  if (!isValidOperator) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        contact: req.body.contact,
        userImage: req.file.path
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!user) {
      return res.status(404).send([]);
    }
    console.log(user);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
