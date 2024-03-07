import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import config from "config";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, email: this.email, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
    return token;
};

const User  = mongoose.model("User", userSchema);

function validateUser(user: any) {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm password')
    });
    return schema.validate(user);
}

module.exports = {
    User,
    validateUser
};
