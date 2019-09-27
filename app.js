const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  envVariable = require("dotenv").config(),
  flash    = require("connect-flash"),
  methodOverride = require('method-override'),
  localStrategy = require("passport-local"),
  Comment = require("./models/comment"),
  Campground = require("./models/campground"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// seed the database
// seedDB();


// Requiring Routes
const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      authRoutes       = require("./routes/index");


// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "This is a really good course",
    resave: false,
    saveUninitialized: false
  })
);


app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use flash
app.use(flash());


// add user data to all your routes so you can use in EJS templates
app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.error =  req.flash("error");
  res.locals.success =  req.flash("success");
  next();

});


app.use(bodyParser.urlencoded({ extended: true }));

// link to css stylesheet in public dir
// dir name is the dir this file is on
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");


console.log(process.env.DATABASEURL);

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true
});

// Use mongoatlas db
// mongoose.connect("mongodb+srv://thelennyjohnson:S4yo3wHf9iVMsHtD@cluster0-hl4ks.mongodb.net/test?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useCreateIndex: true
// }).then(() => {
//   console.log("connected to DB");
// }).catch(err => {
//     console.log("Error:", err.message)
// });



// Instruct app.js to use external routes
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
// Appened the routes so you follow DRY rules of nonrepitition
app.use("/campgrounds/:id/comments", commentRoutes);


// =========================
app.listen(process.env.PORT || 5000)