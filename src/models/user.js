const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 10
    },
     lastName: {
        type: String
    },
     emailId: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Incorrect email address",value)
            }
        }
    },
     password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong password",value)
            }
        }
    },
     age: {
        type: String,
        min: 18
    },
     gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        // default: "",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid photo url")
            }
        }
    },
    about:{
        type: String,
        default: "This is the default about of the user"
    },
    skills: {
        type: [String]
    }


},{
    timestamps:true
})


userSchema.methods.getJwt = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Dev@Tinder$790",{expiresIn: "1d"})

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user =this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid;

}
module.exports = mongoose.model("User", userSchema)