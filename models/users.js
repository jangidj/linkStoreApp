const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: String,
    password: String
}, {
    timestamps: true
});

// Hash password before saving to database
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
            next();
        } catch (err) {
            return next(err);
        }
    } else {
        return next();
    }
});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
};

UserSchema.statics.findByToken = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return this.findOne({ _id: decoded._id });
    } catch (err) {
        throw new Error(`Error verifying token: ${err.message}`);
    }
};

// Compare password with hashed password in database
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;