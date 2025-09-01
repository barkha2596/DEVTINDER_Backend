const express = require("express");
const { validateSignupData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req,res) => {
     
    const { firstName, lastName, emailId, password} = req.body;
 
    try{
         //validate the data 
        validateSignupData(req);

    //encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash)
//store the encrypted password in the db
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        await  user.save();
        res.send("user added successlly")
        }catch(err){
            res.status(400).send(err.message)
        }
    });

authRouter.post("/login", async (req,res) => {
    const { emailId, password} =req.body;
    try{
        const user = await User.findOne({emailId: emailId})
        if(!user){
            throw new Error("Invalid Credentials")
        }
        //const isPasswordValid = await bcrypt.compare(password,user.password);
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            //create a jwt token
            // const token = await jwt.sign({_id:user._id}, "Dev@Tinder$790",{expiresIn:"1d"});
            // console.log(token)
            const token = await user.getJwt();
            res.cookie("token", token, {expires: new Date(Date.now()+7*360000)});
            res.send("login successfull")
        }
        else{
            throw new Error("Invalid credentials")
        }
    }catch(err){
        res.status(400).send(err.message)
    }
    
})

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null,{
        expires: new Date(Date.now())
    });
    res.send("logout successfull");
})



module.exports = authRouter;