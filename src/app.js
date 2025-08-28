const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app= express();
const connectDB = require("./config/database");
const User = require("./models/user");



app.post("/signup", async (req,res) => {
    
    const user = new User({
        firstName: "Barkha",
        lastName: "Bandana",
        emailId: "barkha@123",
        password: "barkha@12"
    });
   
 
    try{
         await  user.save();
            res.send("user added successlly")
    }catch(err){
        res.status(400).send("Error saving the user"+ err.message)
    }
  
});



connectDB()
.then(() => {
    console.log("Database Connection established")
    app.listen(8080, () => {
    console.log("server is successfully listening")
})
}).catch((err) => {
    console.error("Database cannot be connected")
})
