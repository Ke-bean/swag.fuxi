"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { User, validateUser } = require('../models/user');
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
const lodash_1 = __importDefault(require("lodash"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/me", auth_1.auth, async (req, res) => {
    const user = await User.findById(req.user._id).select(["-password", "-confirmPassword"]);
    res.send(user);
});
router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send("User already exists");
    user = new User(lodash_1.default.pick(req.body, ["fullName", "email", "password", "confirmPassword"]));
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hash(user.password, salt);
    user.confirmPassword = await bcrypt_1.default.hash(user.confirmPassword, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(lodash_1.default.pick(user, ['_id', "fullName", "email"]));
});
module.exports = router;
//# sourceMappingURL=users.js.map