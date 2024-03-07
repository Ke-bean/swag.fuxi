const { User }  = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const mongoose  =  require("mongoose");
import express from 'express'
const router = express.Router();
router.post("/", async(req:express.Request, res: express.Response)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken()
    res.send(token)
})
function validate (req: express.Request) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(req);
}
module.exports = router;