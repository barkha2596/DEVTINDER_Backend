const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app= express();

app.use("/admin",adminAuth)

app.get("/user/login", (req,res) => {
    res.send("login successful")
})

app.get("/user/getData", userAuth, (req,res) =>{
    res.send("User Data received")
})

app.get("/admin/getAllData",(req,res) => {
    res.send("User Data received")
})

app.get("/admin/deleteAllData",(req,res) => {
    res.send("User Data Deleted!!")
})

app.listen(8080, () => {
    console.log("server is successfully listening")
})