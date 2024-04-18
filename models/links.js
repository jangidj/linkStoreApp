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
    },
    star: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

const Link = mongoose.model('Links', LinkSchema);

module.exports = Link;