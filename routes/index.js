const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (request, response) =>
{
    response.render('welcome');
});

router.get('/dashboard',ensureAuthenticated, (request, response) =>
{
    response.render('dashboard', {
        user : request.user
    });
});
module.exports = router;