const adminAuth = (req,res,next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized token")
    }else{
        next();
    }
}

const userAuth = (req,res,next) => {
    console.log("User auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized token")
    }else{
        next();
    }
}

module.exports ={
    adminAuth,
    userAuth
}