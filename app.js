//initial Setup
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Footballer = require("./models/footballer");
var Comment = require("./models/comment");

//for authantication
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/footballers_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// passport configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//routers
app.get("/", function(req, res){
   res.redirect("footballers/footballers"); 
});

//index
app.get("/footballers", function(req, res){
   //get data from db
   Footballer.find({}, function(err, fbs){
      if(err){
          console.log(err);
      } else{
          res.render("footballers/footballers", {footballers: fbs});
      }
   });
});

//new
app.get("/footballers/new", function(req, res){
    res.render("footballers/new");
});

//create
app.post("/footballers", function(req, res){
   //get data from form & add to the array
   var name = req.body.name; 
   var image = req.body.image; 
   var description = req.body.description; 
   var newFootballer = {name: name, image: image, description: description};
   //create a db object
   Footballer.create(newFootballer, function (err, newF) {
       if(err){
           console.log(err);
       } else {
           res.redirect("footballers/footballers");
       }
   });
});

//show
app.get("/footballers/:id", function(req, res) {
   //find the object with id
   Footballer.findById(req.params.id).populate("comments").exec(function(err, found){
      if(err){
          console.log(err);
      } else{
          res.render("footballers/show", {footballer: found});
      }
   });
});

//===============
//comment routes
//============================

//new
app.get("/footballers/:id/comments/new", isLoggedIn, function(req, res) {
   //find footballer
   Footballer.findById(req.params.id, function(err, footballer){
      if(err){
         console.log(err);
      } else{
         res.render("comments/new", {footballer: footballer})
      }
   });
});

//create
app.post("/footballers/:id/comments", isLoggedIn, function(req, res){
   //find by id
   Footballer.findById(req.params.id, function(err, found) {
       if(err){
          console.log(err);
       } else{
          Comment.create(req.body.comment, function(err, comment){
             if(err){
                console.log(err);
             } else{
                found.comments.push(comment);
                found.save();
                res.redirect('/footballers/' + found._id);
             }
          });
       }
   })
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/footballers"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/footballers",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/footballers");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//server code
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server has started..."); 
});