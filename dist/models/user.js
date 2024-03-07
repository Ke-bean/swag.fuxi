"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const userSchema = new mongoose_1.default.Schema({
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
userSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id, email: this.email, isAdmin: this.isAdmin }, config_1.default.get("jwtPrivateKey"));
    return token;
};
const User = mongoose_1.default.model("User", userSchema);
function validateUser(user) {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().required(),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().min(8).max(255).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required().label('Confirm password')
    });
    return schema.validate(user);
}
module.exports = {
    User,
    validateUser
};
//# sourceMappingURL=user.js.map