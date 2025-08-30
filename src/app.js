const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app= express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt")


app.use(express.json())



app.post("/signup", async (req,res) => {
    console.log(req.body); 
    
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

app.post("/login", async (req,res) => {
    const { emailId, password} =req.body;
    try{
        const user = await User.findOne({emailId: emailId})
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("login successfull")
        }
        else{
            throw new Error("Invalid credentials")
        }
    }catch(err){
        res.status(400).send(err.message)
    }
    
})

app.get("/user", async (req,res) => {
    const userEmailId = req.body.emailId;
    console.log(userEmailId)
    try{
        const user = await User.findOne({emailId:userEmailId});
        console.log(user);
        //if(user.length === 0){
        if(!user){
            //throw new Error("user not found")
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send(err.message);
    }
    
})

app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("something wnet wrong");
    }
    


})

app.delete("/user", async(req,res) => {
    try{
        console.log("HIIIIII")
        const userId = req.body.userId;
        console.log(userId)
        const user = await User.findByIdAndDelete({_id: userId});
        res.send("user deleted successfully")
    }catch(err){
        res.status(400).send("Something went wrong!!!!")
    }
})


app.patch("/user/:userId", async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try{

        const ALLOWED_UPDATES = ["photoUrl", "about","gender","age","skills"]
        const isAllowedUpdates = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isAllowedUpdates){
            throw new Error("update not allowed")
        }

        if(data?.skills.length > 10){
            throw new Error("skills cannot be greater than 10");
        }
        await User.findByIdAndUpdate({_id:userId}, data,{runValidators: true})
        res.send("User updated successfully")
    }catch(err){
        res.status(400).send(err.message)
    }
})
connectDB()
.then(() => {
    console.log("Database Connection established")
    app.listen(8080, () => {
    console.log("server is successfully listening")
})
}).catch((err) => {
    console.error("Database cannot be connected")
})
