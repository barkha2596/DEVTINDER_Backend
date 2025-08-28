const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://barkhabandana02:barkhaAeli@cluster0.1c4u9.mongodb.net/devTinder")
}

module.exports = connectDB;