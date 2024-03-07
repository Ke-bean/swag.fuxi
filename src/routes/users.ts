const { User, validateUser } = require('../models/user');
import bcrypt from "bcrypt";
import  { auth }  from "../middleware/auth";
import _ from "lodash";
import mongoose from "mongoose"
import express  from "express";
import CustomRequest from "../middleware/auth";
const router = express.Router();
router.get("/me", auth, async (req: CustomRequest, res: express.Response) => {
    const user = await User.findById(req.user._id).select(["-password", "-confirmPassword"]);
    res.send(user);
});
router.post("/", async(req: express.Request, res: express.Response)=>{
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send("User already exists"); 
    user = new User(_.pick(req.body, ["fullName", "email", "password", "confirmPassword"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);
    await user.save();
    const token = user.generateAuthToken()
    res.header("x-auth-token", token).send(_.pick(user, ['_id', "fullName", "email"]));
})
module.exports = router;