const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    tags: [
        {
            type: String
        }
    ],
    link: {
        type: String
    },
    img: {
        type: String
    }
}, {
    timestamps: true
});

const Link = mongoose.model('Links', LinkSchema);

module.exports = Link;