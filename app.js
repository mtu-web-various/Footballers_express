//initial Setup
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/footballers_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//mongo schema
var footballerSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Footballer = mongoose.model("Footballer", footballerSchema);


//routers
app.get("/", function(req, res){
   res.redirect("footballers"); 
});

//index
app.get("/footballers", function(req, res){
   //get data from db
   Footballer.find({}, function(err, fbs){
      if(err){
          console.log(err);
      } else{
          res.render("footballers", {footballers: fbs});
      }
   });
});

//new
app.get("/footballers/new", function(req, res){
    res.render("new");
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
           res.redirect("/footballers");
       }
   });
});

//show
app.get("/footballers/:id", function(req, res) {
   //find the object with id
   Footballer.findById(req.params.id, function(err, found){
      if(err){
          console.log(err);
      } else{
          res.render("show", {footballer: found});
      }
   });
});


//server code
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server has started..."); 
});