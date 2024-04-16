const express = require('express');
const router = express.Router();
const axios = require('axios');


const User = require('./../models/users');
const VerifyToken = require("./../middlewares/verifiyToken");
const Link = require('../models/links');


// login user by email and password
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Username not found
            return res.status(401).json({ message: 'Invalid user' });
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            // Incorrect password
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = user.generateAuthToken();
        res.json({ message: "Login Success", status: 1, token: token })
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// signup user
router.post('/user/signup', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(401).json({ message: 'Email address already exists.' });
        const { email, password, name } = req.body;
        const newUser = await User.create({ email, password, name, isNew: true });

        res.json({ message: "User created.", status: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }

})

router.get('/link/list', async (req, res) => {
    try {
        const links = await Link.find({});
        res.json({ status: 1, data: links })
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

router.post('/link/add', async (req, res) => {
    try {
        req.body['img'] = await getRandomImageLink();
        req.body.tags = req.body.tags.split(",") 
        const link = await Link.create(req.body);
        res.json({ status: 1, data: link })
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

// Function to fetch a random image link from Unsplash
const getRandomImageLink = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('https://picsum.photos/seed/picsum/200/300');
            return resolve(response.request.res.responseUrl);
        } catch (error) {
            console.error('Error:', error);
            return reject(error);
        }
    })
};


// router.get("/user/profile", VerifyToken, Profile);

module.exports = router;