const express=require("express");
const router = express.Router()
const User=require("../models/user.js")
const wrapAsync=require("../public/utils/wrapAsync.js")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signUpForm))

router.route("/login")
.get(userController.renderLogin)
.post(
    saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect: '/login',
    failureFlash:true}),userController.loginForm)


router.get("/logout",userController.logoutForm)


module.exports=router;