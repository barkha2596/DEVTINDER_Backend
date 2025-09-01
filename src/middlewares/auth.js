const jwt = require("jsonwebtoken");
const User = require("../models/user");


// const adminAuth = (req,res,next) => {
//     console.log("Admin auth is getting checked");
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("Unauthorized token")
//     }else{
//         next();
//     }
// }

const userAuth = async (req,res,next) => {
    const cookies = req.cookies;
    const {token} = cookies;
    try{
        if(!token){
        throw new Error("Invalid token")
    }
    const decodedMessage = await jwt.verify(token, "Dev@Tinder$790");
    const {_id} = decodedMessage;
    const user = await User.findById(_id);
    console.log(user)
    if(!user){
        throw new Error("User not found")
    }
    req.user = user;
    next();
    }catch(err){
        res.status(400).send(err.message)
    }


}

module.exports ={
  
    userAuth
}