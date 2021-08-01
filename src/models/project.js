const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    usersInvolved: [{
        id: {
            type: String
        },
        role: {
            type: String
        }
    }]
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;