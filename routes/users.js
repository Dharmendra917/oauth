var mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/googlee")

let userSchema = mongoose.Schema({
  username: String,
  email: String,
})

module.exports =  mongoose.model("users",userSchema)