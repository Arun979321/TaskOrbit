// controllers/taskController.js
const Task = require("../models/Task");


exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      dueDate: req.body.dueDate,   
      duration: req.body.duration, 
      user: req.user.id, 
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { returnDocument: 'after', runValidators: true } 
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};