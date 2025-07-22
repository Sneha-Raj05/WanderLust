// This file is responsible for connecting to the database and initializing the data.
// It connects to the MongoDB database and populates it with initial data from a local file
const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main()
   .then(()=>{
      console.log("connected to DB")
    })
    .catch((err)=>{
        console.log(err)
    })


const initDB = async()=>{
    await Listing.deleteMany({});   
    initData.data=initData.data.map((obj) => ({
        ...obj ,
        owner:"67fc94b12b7b840d3e394790"
    }))
    await Listing.insertMany(initData.data)
    console.log("data was initialised")
}

initDB();