const express = require("express");
const { userAuth } = require("./middlewares/auth");
const app= express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/UserRouter");



app.use(express.json())
app.use(cookieParser())

 app.use("/",authRouter)
 app.use("/",profileRouter)
 app.use("/",requestRouter)
 app.use("/",userRouter)









connectDB()
.then(() => {
    console.log("Database Connection established")
    app.listen(8080, () => {
    console.log("server is successfully listening")
})
}).catch((err) => {
    console.error("Database cannot be connected")
})
