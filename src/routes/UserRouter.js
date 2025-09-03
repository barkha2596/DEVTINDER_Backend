const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();


const USER_SAFE_DATA =" firstName lastName age gender photoUrl about"

userRouter.get("/user/requests/received", userAuth ,async(req,res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser,
            status: "interested"
        }).populate("fromUserId", ["firstName","lastName"])
        res.json({
            message: "Data fetched successfully",
            data:connectionRequest
        })
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
})

userRouter.get("/user/connection", userAuth, async(req,res) => {
    try{

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId:loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}

            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
           
            if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
                return toUserId;
            }
            return row.fromUserId;
         })
        res.json(data);
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
})

userRouter.get("/user/feed", userAuth, async(req,res) =>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit= limit>50 ?50:limit;
        const skip = (page-1)*limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) =>{
            hideUserFromFeed.add(req.toUserId.toString());
            hideUserFromFeed.add(req.fromUserId.toString());
        });

        const users = await UserActivation.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ].select(USER_SAFE_DATA)
             .skip(skip)
             .limit(limit)
        })
        res.json({
            data:users
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
})





module.exports= userRouter;