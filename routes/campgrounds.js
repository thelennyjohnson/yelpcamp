const express = require("express"),
      router  = express.Router();
      Campground  = require("../models/campground"),
      middleware  = require("../middleware");
  
      // ROuter is used rather than app
  

      // is a user logged in? middleware
// isLoggedIn = (req,res,next) => {
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect("/login");
// }

// INDEX route show all cg
router.get("/", (req, res)=> {
  // Check if a user is logged in
    
    // Get all campgrounds from DB --- this is where the mondgo db comes in
    Campground.find({}, (err, allCampgrounds)=> {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds, /* Example of data you're passing in with router.use req.locals above*/ currentUser: req.user });
      }
    });
    // res.render("campgrounds",{campgrounds:campgrounds});
  });
  
  // NEW show form to add cg
  router.get("/new",  middleware.isLoggedIn ,(req, res)=> {
    res.render("campgrounds/new");
  });
  

  // CREATE add new cp to ddb
  
  router.post("/",  middleware.isLoggedIn ,(req, res)=> {
    // get data from the form
    var campName = req.body.campNameData;
    var campImage = req.body.campImageData;
    var campPrice = req.body.campPriceData
    var campDescription = req.body.campDescription;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = {
      name: campName,
      price: campPrice,
      image: campImage,
      description: campDescription,
      author: author
    };
    //and add to campgrounds array
    // Create a new campgrounds and save to db campgrounds.push(newCampground);
    Campground.create(newCampground, (err, newlyCreated)=> {
      if (err){
        console.log(err);
      } else {
        //redirect user back to campgrounds page
        console.log(newlyCreated)
        req.flash("success", "You've added a new campground!");
        res.redirect("/campgrounds");
      }
    });
  });
  
  // SHOW ROUTE
  
  // the order of declaring route matters.
  // make sure id doesn't share asimilar structure with other routes
  // show information on one campground
  router.get("/:id", (req, res)=> {
    // find the campground with the id provided
    // to show comments with their id reference use populate
    Campground.findById(req.params.id)
      .populate("comments")
      .exec((err, foundCampground)=> {
        if (err) {
          console.log(err);
        } else {
          // render the show template with that campground
          res.render("campgrounds/show", { campground: foundCampground});
        }
      });
  });
  

//Edit campground route. Form needed to take in data
router.get("/:id/edit",  middleware.checkCampgroundOwnership, (req,res)=>{
        Campground.findById(req.params.id, (err, foundCampground)=>{
          if(err){
            res.redirect("back");
          } else {
            res.render("campgrounds/edit", {campground: foundCampground});
          }
        });
});

router.put("/:id",  middleware.checkCampgroundOwnership,(req,res)=>{
  // find and update the correct campground

  //campground[name] is the same as creating an object here with var campground = {name:req.body.name,... } but shorter
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
      if(err){
        res.redirect("/campgrounds/" + req.params.id)
      } else {
          req.flash("success", "You've updated a campground!");
          res.redirect("/campgrounds/" + req.params.id);
      }
    })
  // redirect somewhere else
});

//Update campground route


// Destroy route
router.delete("/:id",  middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      res.redirect("/campgrounds");
    } else{
      req.flash("success", "You deleted a campground!");
      res.redirect("/campgrounds");
    }
  });
});


  // export this module

  module.exports = router;