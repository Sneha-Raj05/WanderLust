const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose")

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})
userSchema.plugin(passportLocalMongoose);//ye passport naam ka 
//middleware apne aap username aur password deta hai 
//hume dene ki jarurat nhi padti is userSchema me

module.exports=mongoose.model("User",userSchema)