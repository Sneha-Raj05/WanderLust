
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express")
const app=express()
const mongoose=require("mongoose")
const ejs=require("ejs")
const path=require("path");
const methodOverride=require("method-override")//while editing and deleting we use this
//method override is used to override the method of form submission
const ejsMate=require("ejs-mate") //helps in creating template
const ExpressError = require('./public/utils/ExpressError');
const session=require("express-session")
const MongoStore = require('connect-mongo'); //to store session in mongoDB
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy= require("passport-local")
const User=require("./models/user.js")


const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")


const dbUrl=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl)
}

main()
   .then(()=>{
      console.log("connected to DB")
    })
    .catch((err)=>{
        console.log(err)
    })

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));//SHOW ROUTE ME LIKHTE H YE
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public"))) //yWhile styling we write this


const store = MongoStore.create({
    mongoUrl:ATLASDB_URL,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,

}) 

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})



const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

// app.get("/",(req,res)=>{
//     res.send("Hi,I am root!")
//     })




app.use(session(sessionOptions))
app.use(flash());
    
//FOR AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());//store karna mtlb serialize
passport.deserializeUser(User.deserializeUser());


//While using Flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next()
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"sneha123@gmail.com",
//         username:"sneha-05"
//     })

//     let registeredUser=await User.register(fakeUser,"helloworld")
//     res.send(registeredUser)
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//Agar user koi aise route ke paas req bhejta hai ..aur sab route match hone ke baad hume pta
//chalta h ki wo route kisise match nhi kha rhi toh phir hum ek standard res bhejte h
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
} )



app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})
