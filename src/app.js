const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app= express();
const connectDB = require("./config/database");
const User = require("./models/user");


app.use(express.json())



app.post("/signup", async (req,res) => {
    console.log(req.body); 
    const user = new User(req.body);
    try{
         await  user.save();
            res.send("user added successlly")
    }catch(err){
        res.status(400).send("Error saving the user"+ err.message)
    }
});

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
