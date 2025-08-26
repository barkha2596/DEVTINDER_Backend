const express = require("express");
const app= express();

app.use("/hello",(req,res) => {
    res.send("Hello from the server and from nodemon!!!!!")
})


app.listen(8080, () => {
    console.log("server is successfully listening")
})