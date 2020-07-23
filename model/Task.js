const mongoose = require('mongoose');

const UserTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const UserTask = mongoose.model('Task', UserTaskSchema);
module.exports = UserTask;