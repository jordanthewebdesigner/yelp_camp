var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found.");
            res.redirect("back");
        } else {
            if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
                } else {
                req.flash("error", "You don't own this campground!");
                res.redirect("back");
            }
            
        }
    });
        } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("back");
        } else {
            if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
                } else {
                req.flash("error", "That's not your comment!");
                res.redirect("back");
            }
            
        }
    });
        } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};



module.exports = middlewareObj;