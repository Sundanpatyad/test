const express = require('express');

const { fetchUserById, updateUser } = require('../controller/User');
const { createUser , loginUser, checkAuth } = require('../controller/Auth');
const passport = require('passport');

const  router = express.Router();

router.post('/signup' , createUser).post('/login' ,passport.authenticate('local'), loginUser).get('/check' , checkAuth)


exports.router  = router;