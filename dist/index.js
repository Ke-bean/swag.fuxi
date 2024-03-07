"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const blogs_1 = __importDefault(require("./routes/blogs"));
const app = express();
if (!config.get("jwtPrivateKey")) {
    console.error("Fatal Error: JwtPrivateKey is not defined.");
    process.exit(1);
}
app.use(express.json());
mongoose.Promise = Promise;
mongoose.connect("mongodb+srv://chenqiua:beandenzel123333@cluster0.gcn1z85.mongodb.net/KebeanElie");
mongoose.connection.on("connected", () => console.log("connected to db"));
mongoose.connection.on("error", (error) => console.log(error));
app.use(express.json());
app.use("/users", users);
app.use("/auth", auth);
app.use("/blogs", blogs_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
exports.default = app;
//# sourceMappingURL=index.js.map