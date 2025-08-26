const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app= express();


app.get("/getUserData",(req,res) => {
    // try{
        throw new Error("hfregfyrefguyr")
        res.send("User Data Received");
    // }catch(err){
        //res.status(500).send("Some error occured, contact support team")
   // }
})

app.use("/", (err, req, res, next) =>{
    if(err){
        res.status(500).send("Something went wrong");
    }
})







app.listen(8080, () => {
    console.log("server is successfully listening")
})