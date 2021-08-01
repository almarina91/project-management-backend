const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    assignee:{
        type: String,
        required: true
    },
    taskTitle: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectID: {
        type: String,
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;