const express=require("express");
const router = express.Router(); //creates new Router object
const wrapAsync=require("../public/utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})



router.route("/")   //(FOR INDEX AND CREATE ROUTE)
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing))


//New ROUTE--3
router.get("/new",isLoggedIn,listingController.renderNewForm)



router.route("/:id") //(FOR SHOW ROUTE,UPDATE AND DELETE ROUTE)
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
    isOwner, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing))


//EDIT ROUTE --5
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing))


module.exports=router;
