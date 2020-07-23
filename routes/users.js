const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// User Model
const User = require('../model/User');

// Register page
router.get('/register', (request, response) => {
    response.render('register');
});

// Register handle
router.post('/register', (request, response) => {
    // Object destructuring
    const {name, email, password, password2} = request.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            message: 'Please fill in all fields'
        });
    }

    // Check password match
    if (password !== password2) {
        errors.push({
            message: 'Password do not match'
        });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({
            message: 'Password should be at least 6 characters'
        })
    }
    if (errors.length > 0) {
        response.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation Passed
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                // User Exists
                errors.push({
                    message: 'Email already exists..'
                });
                response.render('register', {
                    errors, name, email, password, password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (error, salt) => {
                    const data = bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save User
                        newUser.save()
                            .then(user => {
                                request.flash('success_message', 'You are now registered and can log in..');
                                response.redirect('/user/login');
                            })
                            .catch(error => console.log(error));
                    })
                });
            }
        })
    }
});

// Login Page
router.get('/login', (request, response) => {
    response.render('login');
});

// Login Handle
router.post('/login', (request, response, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(request, response, next);
});

router.get('/logout', (request, response) => {
    request.logout();
    request.flash('success_message', 'You are logged out');
    response.redirect('/user/login');
});

router.get('/sendEmail', (request, response) =>{
    response.render('emailSend');
})

module.exports = router;