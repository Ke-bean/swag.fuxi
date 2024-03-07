"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const mongoose = require("mongoose");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    res.send(token);
});
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(req);
}
module.exports = router;
//# sourceMappingURL=auth.js.map