const express=require("express");
const router = express.Router({mergeParams:true});//jab hum parent route 
//ke kisi parameter ko child route se merge karna chahte h tab use karte h
//parent route=/listings/:id toh isme parameter hogya /:id and child route jaise
///:reviewId

const wrapAsync=require("../public/utils/wrapAsync.js")
const ExpressError=require("../public/utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js")

const reviewController=require("../controllers/review.js")


//REVIEW'S POST ROUTE
router.post("/",isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview))


//REVIEW'S DELETE POST
router.delete("/:reviewId",isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview))


module.exports=router;