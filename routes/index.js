const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');



const User = require('./../models/users');
const VerifyToken = require("./../middlewares/verifiyToken");
const Link = require('../models/links');
const sendMessageAndGetResponse = require("./../lib/openAI");


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

router.get('/link/list', VerifyToken, async (req, res) => {
    try {
        const pageSize = req.query.pageSize; // Number of documents per page
        const pageNumber = req.query.pageNumber || 1; // Page number (starting from 1)

        const skip = (pageNumber - 1) * pageSize;

        console.log(`skip : ${skip} and pageSize : ${pageSize}`)

        let query = {
            user: req.user._id
        }

        if(req.query.isStarLink) query["star"] = true
        if(req.query.search) {
            query["$or"] = [
                {
                    title : { $regex: req.query.search, $options: 'i' }
                },
                {
                    description : { $regex: req.query.search, $options: 'i' }
                }
            ]
        }

        const links = await Link.find(query).sort({crecreatedAt: -1}).skip(skip).limit(pageSize);
        res.json({ status: 1, data: links })
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

router.post('/link/add', VerifyToken, async (req, res) => {
    try {
        console.log(`adding link data ${JSON.stringify(req.body)}`)
        req.body['img'] = await getImageUrlFromInstagramReelUrl(req.body.link);
        req.body.tags = req.body.tags.split(",")
        req.body['user'] = req.user._id;
        const link = await Link.create(req.body);
        res.json({ status: 1, data: link })
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

router.post('/link/edit/:linkId', VerifyToken, async (req, res) => {
    try {
        console.log(`adding link data ${JSON.stringify(req.body)}`)
        let { imageUrl, appName } = await getImageUrlFromInstagramReelUrl(req.body.link)
        req.body['img'] = imageUrl;
        req.body['appName'] = appName;
        if(req.body.tags) req.body.tags = req.body.tags.split(",")
        if(req.body.autoTags) {
            let autoTg = await sendMessageAndGetResponse(req.body.description);
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXxx", autoTg)
            req.body.tags = req.body.tags.length ? [...req.body.tags, ...autoTg] : autoTg
        }
        req.body['user'] = req.user._id;
        const link = await Link.findOneAndUpdate({_id : req.params.linkId}, {$set : req.body});
        res.json({ status: 1, data: link })
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

router.get('/link/remove/:linkid', async (req, res) => {
    try {
        await Link.deleteOne({_id : req.params.linkid});
        res.json({ status: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})


router.get('/link/star/:linkid/:star', VerifyToken, async (req, res) => {
    try {
        await Link.findOneAndUpdate({_id : req.params.linkid},{$set : {star : req.params.star}});
        res.json({ status: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})


async function getImageUrlFromInstagramReelUrl(instagramReelUrl) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("instagramReelUrl", instagramReelUrl)
            // Fetch the HTML content of the Instagram reel page
            const response = await axios.get(instagramReelUrl);
            const html = response.data;
    
            // Load the HTML content into cheerio
            const $ = cheerio.load(html);

            // Find the meta tag with property="og:image" to extract the image URL
            const imageUrl = $('meta[property="og:image"]').attr('content');
            const appName = $('meta[property="og:site_name"]').attr('content');

            // Return the image URL
            return resolve({
                imageUrl: imageUrl,
                appName : appName
            });
        } catch (error) {
            console.error('Error fetching Instagram reel URL:', error);
            return resolve({
                imageUrl: instagramReelUrl,
                appName: ""
            });
        }
    })
}


// router.get("/user/profile", VerifyToken, Profile);

module.exports = router;