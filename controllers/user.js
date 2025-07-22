const User=require("../models/user")

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUpForm=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser = new User({email,username});
        const registeredUser=await User.register(newUser,password)
        console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to WanderLust!")
            res.redirect("/listings") 
        }) 
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs")
}



module.exports.loginForm=async(req,res)=>{
    req.flash("success",Congratulations! Login successfull.")
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl)
}

module.exports.logoutForm = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You've been logged out")
        res.redirect("/listings")
    })
}
