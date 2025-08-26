const express = require("express");
const app= express();

app.use("/hello",(req,res) => {
    res.send("Hello from the server and from nodemon!!!!!")
})

app.get("/user/:userId/:name",(req,res) => {
    console.log(req.params)
    const {userId , name} =req.params;
    console.log(userId);
    console.log(name)
    res.send({firstName: "Barkha", secondName: "Bandana"})
})

app.listen(8080, () => {
    console.log("server is successfully listening")
})