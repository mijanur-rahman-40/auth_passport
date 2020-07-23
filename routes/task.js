const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {forwardAuthenticated} = require('../config/auth');
// Task Model
const Task = require('../model/Task');


router.get('/task', ensureAuthenticated, (request, response) => {
    // response.render('task', {
    //     user: request.user
    // });
    
    Task.find({
        user: request.user.id
    }, (error, task)=>{
            if (error) {
                console.log(error);
            }
            else {
                response.render('task', {
                    details: task,
                    user: request.user
                });
            }
    });

    // Task.find({}, (error, details) =>
    // {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         response.render('task', {
    //             details: details,
    //             user: request.user
    //         })
    //     }
    // });
    
    // work : response.json(details);
});

router.post('/task', ensureAuthenticated,(request, response) => {
    const {title, description} = request.body;
    let errors = [];

// Check required fields
    if (!title || !description) {
        errors.push({
            message: 'Please fill in all fields'
        });
    }
    if (errors.length > 0) {
        response.render('task', {
            errors,
            title,
            description
        });
    } else {
        const newTask = new Task({
            title,
            description,
            user: request.user
        });
        newTask.save()
            .then(task => {
                request.flash('success_message', 'You are now registered and can log in..');
                response.redirect('/dashboard');
            })
            .catch(error => console.log(error));
    }
});
module.exports = router;

 