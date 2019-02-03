var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
// ROOT
router.get("/", function(req, res){
    res.render("landing");
});
// REGISTER ROUTES
router.get("/register", function(req, res) {
    res.render("register", {page:"register"});
});
// CREATE USER
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        email: req.body.email,
        userBio: req.body.bio
    });
    if(req.body.adminCode === "AdminMe!"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
           req.flash("error", err.message);
           return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
// SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login", {page:"login"});
});
// LOGIN LOGIC
router.post("/login", passport.authenticate("local",
{   successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));
// LOGOUT LOGIC
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
});
// USER PROFILE
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", err.message);
           res.redirect("/"); } else { 
       Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
                       if(err){
                   req.flash("error", err.message);
                   res.redirect("/");
                    }
           res.render("users/show", {user: foundUser, campgrounds: campgrounds});
       });
   }
   });
});

module.exports = router;