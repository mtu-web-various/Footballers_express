//initial Setup
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Footballer = require("./models/footballer");
var Comment = require("./models/comment");

mongoose.connect("mongodb://localhost/footballers_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


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
app.get("/footballers/:id/comments/new", function(req, res) {
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
app.post("/footballers/:id/comments", function(req, res){
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
             }
          });
       }
   })
});


//server code
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server has started..."); 
});