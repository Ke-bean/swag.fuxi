const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const users = require("./routes/users");
const auth  = require("./routes/auth")
const express = require("express");
import blogsRouter from "./routes/blogs"; 
const app = express();
if(!config.get("jwtPrivateKey")){
    console.error("Fatal Error: JwtPrivateKey is not defined.")
    process.exit(1);
}
app.use(express.json())
mongoose.Promise = Promise;
const db = config.get("db");
mongoose.connect(db);
mongoose.connection.on("connected", ()=> console.log(`connected to ${db}`));
// mongoose.connection.on("error", (error: Error) => console.log(error));
app.use(express.json());
app.use("/users", users);
app.use("/auth", auth);
app.use("/blogs", blogsRouter)
const port = process.env.PORT || 3000;
const server = app.listen(port , ()=> console.log(`listening on port ${port}...`))
// export default app;
module.exports = { server, app }
