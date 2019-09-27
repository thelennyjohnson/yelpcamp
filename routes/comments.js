const express = require("express"),
// pass params ID through route in app.js
      router  = express.Router({mergeParams: true}),
  Campground  = require("../models/campground"),
  Comment     = require("../models/comment"),
  middleware  = require("../middleware");

// middleware
// isLoggedIn = (req,res,next) => {
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect("/login");
// }

//Comments new
router.get("/new", middleware.isLoggedIn,(req, res)=> {
  // find campgrounds by id
  Campground.findById(req.params.id, (err, foundCampground)=> {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: foundCampground });
    }
  });
});

//comments create
router.post("/", middleware.isLoggedIn, (req, res)=> {
  // Lookup campgrounds using ID
  Campground.findById(req.params.id, (err, foundCampground)=> {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, newComment)=> {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
         newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;

         // save comment
         newComment.save();
         
          foundCampground.comments.push(newComment);
          foundCampground.save();
          console.log(newComment);
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
  // create new comment
  // connect new comment to campground
  // redirect to show page of campground
});


//COmments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership,(req,res)=>{
  Comment.findById(req.params.comment_id, (err,foundComment)=>{
    if(err){
      console.log(err)
      res.redirect("back")
    } else{
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment
      })
    }
  })
 
});


// Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership,(req,res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
    if(err){
      res.redirect("back")
    } else {
      req.flash("success", "Comment created!")
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
});


// COmment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership,(req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      res.redirect("back")
    } else{
      req.flash("success", "Comment Deleted!")
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
});

module.exports = router;
