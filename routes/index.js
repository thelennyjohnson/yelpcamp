const express = require("express"),
      router  = express.Router(),
      passport= require("passport"),
      User    = require("../models/user")


// index route
router.get("/", (req, res)=> {
  res.render("landing");
});


//Show register form
router.get("/register", (req, res) => {
  res.render("register");
});


// handling signup logic
router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp " +  user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// Logoout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You're now logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;